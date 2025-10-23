`use client`

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { sendSubscriptionToBackend } from './api'
import { urlBase64ToUint8Array } from './validation'

export function useShoppingListSocket(roomName: string, onUpdate: () => void): void {
	useEffect((): (() => void) => {
		const socket = io(process.env.NEXT_PUBLIC_API_URL)


		socket.emit('joinShoppingList', roomName)
		socket.on('listUpdated', onUpdate)

		return ((): void => {
			socket.off('listUpdated', onUpdate)
			socket.disconnect()
		})
	}, [roomName, onUpdate])
}

export function useServiceWorker() {
	const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
	const [isSupported, setIsSupported] = useState(false)
	const [subscription, setSubscription] = useState<PushSubscription | null>(null);

	useEffect(() => {
		if (!(`serviceWorker` in navigator))
			throw new Error('Service worker is not supported')

		setIsSupported(true)

		navigator.serviceWorker
			.register('/service-worker.js')
			.then(registration => setRegistration(registration))
			.catch((err) => {
				throw new Error(err.message)
			})
	}, [])


	const subscribeToNotifications = async () => {
		if (!registration)
			throw new Error('Service worker pas encore enregistre')

		const permission = await Notification.requestPermission()

		if (permission !== `granted`)
			throw new Error(`si vous voulez etre notifier dans l'avenir, activez les notifications dans les paramettres`)

		const vapidPublicKey = `A CHANGER`

		try {
			const pushSubscription: PushSubscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
			})
			setSubscription(pushSubscription)

			await sendSubscriptionToBackend(pushSubscription)
		} catch (e) {
			console.error(e)
			throw new Error(`Erreur dans l'activation des notifications.`)
		}
	}

	return {
		registration,
		isSupported,
		subscription,
		subscribeToNotifications
	}
}