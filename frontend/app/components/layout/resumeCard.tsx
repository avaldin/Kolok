'use client'

import Link from 'next/link'
import { Plus, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { addTool } from '../../lib/api'
import { useToast } from '../ui/Toast'

interface Room {
	name: string,
	participants: string[],
	tools: string[],
}

// Liste hardcodée de tous les outils possibles
const ALL_AVAILABLE_TOOLS = [
	'shopping-list',
	'calendar',
	'tasks',
	'expenses',
	'notes',
]

const ResumeCard = ({ name, participants, tools }: Room) => {
	const [showAddTool, setShowAddTool] = useState(false)
	const [currentTools, setCurrentTools] = useState<string[]>(tools)
	const { showToast } = useToast()
	const dropdownRef = useRef<HTMLDivElement>(null)

	const availableTools = ALL_AVAILABLE_TOOLS.filter(tool => !currentTools.includes(tool))

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowAddTool(false)
			}
		}

		if (showAddTool) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [showAddTool])

	const handleAddTool = async (toolName: string) => {
		try {
			await addTool(name, toolName)
			setCurrentTools([...currentTools, toolName])
			setShowAddTool(false)
			showToast(`L'outil "${toolName}" a été ajouté avec succès`, 'success')
		} catch (e) {
			if (e instanceof Error)
				showToast(e.message, 'error')
		}
	}

	return (
		<div
			className="w-5/6 max-w-2xl mx-auto my-6 p-6 rounded-2xl bg-brown-sugar border-4 border-bistre shadow-md flex flex-col space-y-6">
			<h2 className="text-2xl font-extrabold text-bistre">{name}</h2>

			<div className="flex flex-col sm:flex-row sm:justify-between gap-6">

				<div className="flex-1 bg-atomic-tangerine rounded-xl p-4 shadow space-y-2">
					<h3 className="text-lg font-semibold text-bistre mb-2">Colocataires</h3>
					<ul className="space-y-2">
						{
							participants.map((user, index) => (
							<li key={index} className="flex items-center text-bistre space-x-3">
								<span className="w-3 h-3 bg-bistre rounded-full flex-shrink-0"/>
								<span className="text-md">{user}</span>
							</li>
						))}
					</ul>
				</div>

				<div className="bg-atomic-tangerine rounded-xl p-4 shadow space-y-2 relative">
					<div className="flex items-center justify-between mb-2 gap-4">
						<h3 className="text-xl font-semibold text-bistre">Outils</h3>
						{availableTools.length > 0 && (
							<div className="relative" ref={dropdownRef}>
								<button
									onClick={() => setShowAddTool(!showAddTool)}
									className="p-1 bg-peach-yellow hover:bg-cadet-gray transition rounded-md border border-bistre"
									aria-label="Ajouter un outil"
								>
									{showAddTool ? <X size={20} className="text-bistre" /> : <Plus size={20} className="text-bistre" />}
								</button>

								{showAddTool && (
									<div className="absolute top-full right-0 mt-2 p-3 bg-brown-sugar rounded-lg border-2 border-bistre shadow-lg z-10 min-w-[200px]">
										<h4 className="text-sm font-semibold text-bistre mb-2">Outils disponibles :</h4>
										<ul className="space-y-2">
											{availableTools.map((tool, index) => (
												<li key={index}>
													<button
														onClick={() => handleAddTool(tool)}
														className="w-full text-left px-3 py-2 bg-peach-yellow hover:bg-cadet-gray transition rounded-md border border-bistre text-bistre font-medium"
													>
														{tool}
													</button>
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>

					<ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{currentTools.map((tool, index) => (
							<li key={index}>
								<Link href={`/tools/${tool}`}>
									<div
										className="cursor-pointer bg-peach-yellow hover:bg-peach-yellow/90 transition text-center py-2 px-2 rounded-md border border-bistre text-bistre font-medium">
										{tool}
									</div>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}

export default ResumeCard