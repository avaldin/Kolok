'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
  API_URL,
  sendSubscriptionToBackend,
  sendUnsubscriptionToBackend,
} from './api';
import { urlBase64ToUint8Array } from './validation';

export function useShoppingListSocket(
  userId: string | null,
  onUpdate: () => void,
): void {
  useEffect((): (() => void) => {
    if (!userId) return () => {};

    const socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.emit('joinShoppingList', userId);
    socket.on('listUpdated', onUpdate);

    return (): void => {
      socket.off('listUpdated', onUpdate);
      socket.disconnect();
    };
  }, [userId, onUpdate]);
}

export function useServiceWorker(userId: string) {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );

  useEffect(() => {
    if (!(`serviceWorker` in navigator))
      throw new Error('Service worker is not supported');

    setIsSupported(true);

    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => setRegistration(registration))
      .catch((err) => {
        throw new Error(err);
      });
  }, []);

  const subscribeToNotifications = async () => {
    if (!registration) throw new Error('Service worker pas encore enregistre');

    const permission = await Notification.requestPermission();

    if (permission !== `granted`)
      throw new Error(
        `si vous voulez etre notifier dans l'avenir, activez les notifications dans les paramettres`,
      );

    const response = await fetch(`${API_URL}/notifications/vapid-key`);
    const vapidPublicKey = await response.text();
    try {
      const pushSubscription: PushSubscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      setSubscription(pushSubscription);
      const subscriptionJSON = pushSubscription.toJSON();
      const subscriptionDto = {
        url: subscriptionJSON.endpoint as string,
        p256dh: subscriptionJSON.keys?.p256dh as string,
        auth: subscriptionJSON.keys?.auth as string,
      }; //zod
      await sendSubscriptionToBackend(userId, subscriptionDto);
    } catch (e) {
      console.error(e);
      throw new Error(`Erreur dans l'activation des notifications.`);
    }
  };

  const unSubscribeToNotifications = async () => {
    if (!subscription || !registration)
      throw new Error('Service worker pas encore enregistre');
    try {
      await sendUnsubscriptionToBackend(userId);
      const success = await registration.unregister();
      if (success) {
        setSubscription(null);
      } else throw new Error('unregister failed');
    } catch (e) {
      console.error(e);
      throw new Error(`Erreur dans la suppression des notifications.`);
    }
  };

  return {
    registration,
    isSupported,
    subscription,
    subscribeToNotifications,
    unSubscribeToNotifications,
  };
}
