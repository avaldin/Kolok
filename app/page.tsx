'use client'


import { Header } from '@/components/layout/header'
import ResumeCard from '@/components/layout/resumeCard'
import React from 'react'


interface ToolComponentProps {
	totalQuantity: number,
	newQuantity: number
}


export interface Tool {
	name: string
	props: ToolComponentProps
}

export default function Home() {
	const kolokName: string = 'Coloc Du Plaisir'
	const users: string[] = ['emmy', 'antoine', 'alan']
	const tools: Tool[] = [
		{ name: 'shoppingList', props: { totalQuantity: 0, newQuantity: 0 } },
		{ name: 'taches domestique', props: { totalQuantity: 0, newQuantity: 0 } },
		{ name: 'recette de cuisine', props: { totalQuantity: 0, newQuantity: 0 } }
	]


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
