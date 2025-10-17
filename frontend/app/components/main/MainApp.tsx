'use client'

import React, { useEffect } from 'react'
import { getRoom } from '../../services/api'
import { Header } from '../layout/header'
import ResumeCard from '../layout/resumeCard'

interface Room {
	name: string,
	participants: string[],
	tools: string[],
}

interface MainAppProps {
	userName: string,
	kolokName: string,
}

export default function MainApp({userName, kolokName}: MainAppProps) {
	const [room, setRoom] = React.useState<Room | null>()
	const [loading, setLoading] = React.useState<boolean>(true)


	useEffect(() => {
		if (!userName || !kolokName) return

		const loadRoom = async () => {
			setLoading(true)
			try {
				const room: Room = await getRoom(kolokName)
				setRoom(room)
			} catch (error) {
				console.error(`la kolok n'existe pas, gestion d'erreur ici:`, error)
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
		return (<>
			<main className="flex flex-col min-h-screen justify-center">
				<Header/>
				<div className="flex-1 flex items-center">
					<p>erreur a handle, cas ou la room n'existe pas</p>
				</div>
			</main>
		</>)
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