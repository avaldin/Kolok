`use client`

import { useEffect } from 'react'
import { io } from 'socket.io-client'

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