'use client'

import { useState } from 'react'
import { nameValidator } from '../../lib/validation'

interface SetupNameProps {
	onNameSet: (name: string) => void
}

export default function SetupName({onNameSet}: SetupNameProps) {
	const [input, setInput] = useState('')

	const handleSubmit = () => {
		if (nameValidator(input.trim()))
			onNameSet(input.trim())
		else {
			setInput('')
			//error popup
		}

	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSubmit()
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-peach-yellow p-4">
			<div className="w-full max-w-md bg-brown-sugar rounded-2xl border-4 border-bistre p-8 shadow-md">
				<h1 className="text-3xl font-extrabold text-bistre text-center mb-6">
					Bienvenue sur KoloK
				</h1>

				<div className="space-y-4">
					<label className="block">
						<span className="text-lg font-semibold text-bistre mb-2 block">
							Quel est votre prénom ?
						</span>
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Entrez votre prénom..."
							className="w-full px-4 py-3 rounded-md border-2 border-bistre bg-cadet-gray text-bistre placeholder-bistre/60 focus:outline-none focus:ring-2 focus:ring-atomic-tangerine"
						/>
					</label>

					<button
						onClick={handleSubmit}
						disabled={!nameValidator(input.trim())}
						className="w-full px-6 py-3 rounded-md border-2 border-bistre bg-atomic-tangerine text-bistre font-semibold hover:bg-atomic-tangerine/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Valider
					</button>
				</div>
			</div>
		</main>
	)
}

