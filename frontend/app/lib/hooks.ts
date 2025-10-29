'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { sendUnsubscriptionToBackend } from './api';
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

export function useServiceWorker() {
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

    const vapidPublicKey = `BNTiOxNslsP1rKKRvRuz8tkTXkNNF1zelRkMyxeWCnv0_rfLMVsXlZWti6SPjLTbbGZvM6semMBkV_KOCx1kkQw`;

    try {
      const pushSubscription: PushSubscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      setSubscription(pushSubscription);
      // const subscriptionData = pushSubscription.toJSON();
      // await sendSubscriptionToBackend(subscriptionData);
    } catch (e) {
      console.error(e);
      throw new Error(`Erreur dans l'activation des notifications.`);
    }
  };

  const unSubscribeToNotifications = async () => {
    if (!subscription || !registration)
      throw new Error('Service worker pas encore enregistre');
    try {
      await sendUnsubscriptionToBackend(subscription);
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
