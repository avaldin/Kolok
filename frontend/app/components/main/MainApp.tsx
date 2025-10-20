'use client'

import React, { useEffect } from 'react'
import { getRoom } from '../../services/api'
import { Header } from '../layout/header'
import ResumeCard from '../layout/resumeCard'
import { useToast } from '../ui/Toast'

interface Room {
	name: string,
	participants: string[],
	tools: string[],
}

interface MainAppProps {
	userName: string,
	kolokName: string,
	clearKolokNameAction: () => void
}

export default function MainApp({userName, kolokName, clearKolokNameAction}: MainAppProps) {
	const [room, setRoom] = React.useState<Room | null>()
	const [loading, setLoading] = React.useState<boolean>(true)

	const { showToast } = useToast()

	useEffect(() => {
		if (!userName || !kolokName) return

		const loadRoom = async () => {
			setLoading(true)
			try {
				const room: Room = await getRoom(kolokName)
				setRoom(room)
			} catch (e) {
				if (e instanceof Error)
					showToast(e.message, 'error')
			} finally {
				setLoading(false)
			}
		}
		loadRoom()
	}, [userName, kolokName])


	if (loading) {
		return (
			<>
				<main className="flex flex-col min-h-screen justify-center">
					<Header/>
					<div className="flex-1 flex items-center">
						<p>chargement de la koloc...</p>
					</div>
				</main>
			</>
		)
	}

	if (!room) {
		clearKolokNameAction()
		return
	}

	return (
		<>
			<main className="flex flex-col min-h-screen justify-center">
				<Header/>
				<div className="flex-1 flex items-center">
					<ResumeCard name={room.name} participants={room.participants} tools={room.tools}/>
				</div>
			</main>
		</>
	)
}