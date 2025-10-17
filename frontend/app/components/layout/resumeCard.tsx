'use client'

import Link from 'next/link'

interface Room {
	name: string,
	participants: string[],
	tools: string[],
}


const ResumeCard = ({ name, participants, tools }: Room) => {
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

				<div className="bg-atomic-tangerine rounded-xl p-4 shadow space-y-2">
					<h3 className="text-xl font-semibold text-bistre mb-2">Outils</h3>
					<ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{tools.map((tool, index) => (
							<li key={index}>
								<Link href={`/${encodeURIComponent(name)}/tools/${tool}`}>
									<div
										className="cursor-pointer bg-peach-yellow hover:bg-peach-yellow/90 transition text-center py-2 rounded-md border border-bistre text-bistre font-medium">
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