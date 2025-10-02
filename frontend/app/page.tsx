'use client'


import { Header } from '@/components/layout/header'
import ResumeCard from '@/components/layout/resumeCard'
import React, { useEffect } from 'react'
import { getParticipants } from '@/services/api'


interface ToolComponentProps {
	totalQuantity: number,
	newQuantity: number
}


export interface Tool {
	name: string
	props: ToolComponentProps
}

export default function Home() {
	const [users, setUsers] = React.useState<string[]>([])
	const [loading, setLoading] = React.useState<boolean>(true)
	const kolokName: string = 'la coloc du plaisir'
	const tools: Tool[] = [
		{ name: 'shoppingList', props: { totalQuantity: 0, newQuantity: 0 } },
		{ name: 'taches domestique', props: { totalQuantity: 0, newQuantity: 0 } },
		{ name: 'recette de cuisine', props: { totalQuantity: 0, newQuantity: 0 } }
	]
	useEffect(() => {
		const loadUsers = async () => {
			try {
				const participants = await getParticipants(kolokName)
				setUsers(participants)
			} catch (error) {
				console.error(`erreur chargement users:`, error)
			} finally {
				setLoading(false)
			}
		}
		loadUsers()
	}, [])
	if (loading) {
		return (
			<main className="flex flex-col min-h-screen justify-center">
				<Header/>
				<div className="flex-1 flex items-center">
					<div className="p-6 bg-gray-100 rounded-lg animate-pulse">
						<div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
						<div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
						<div className="h-4 bg-gray-300 rounded w-32"></div>
					</div>
				</div>
			</main>
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
					<ResumeCard kolokName={kolokName} users={users} tools={tools}/>
				</div>
			</main>
		</>
	)
}
