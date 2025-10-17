'use client'

import { useState } from 'react'

interface SetupKolokNameProps {
	onKolokNameSet: (name: string) => void
}

export default function SetupKolokName({onKolokNameSet}: SetupKolokNameProps) {
	const [input, setInput] = useState('')

	const handleSubmit = () => {
		onKolokNameSet(input)
	}

	return (
		<div>
			<input value={input} onChange={(e) => setInput(e.target.value)} />
			<button onClick={handleSubmit}>Valider</button>
		</div>

	)
}