'use client'


import { Header } from './components/layout/header'
import ResumeCard from './components/layout/resumeCard'
import React, { useEffect } from 'react'
import { getRoom } from './services/api'

interface Room {
	name: string,
	participants: string[],
	tools: string[],
}

export default function Home() {
	const [room, setRoom] = React.useState<Room>()
	const [loading, setLoading] = React.useState<boolean>(true)
	const kolokName: string = 'la coloc du plaisir'

	useEffect(() => {
		const loadRoom = async () => {
			try {
				const room: Room = await getRoom(kolokName)
				console.log(room.tools)
				setRoom(room)
			} catch (error) {
				console.error(`erreur chargement users:`, error)
			} finally {
				setLoading(false)
			}
		}
		loadRoom()
	}, [])

	if (loading || !room) {
		return (
			<>
				<main className="flex flex-col min-h-screen justify-center">
					<Header/>
					<div className="flex-1 flex items-center">
						<ResumeCard name={'          '} participants={['       ', '   ', '   ']} tools={['       ', '   ', '   ']}/> // attention ici
					</div>
				</main>
			</>
		)
	}
	// return (
	// 	<>
	// 		<main className="flex flex-col min-h-screen justify-center">
	// 			<Header/>
	// 			<div className="flex-1 flex items-center">
	// 				<ResumeCard kolokName={kolokName} users={users} tools={tools}/>
	// 			</div>
	// 		</main>
	// 	</>
	// )

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
