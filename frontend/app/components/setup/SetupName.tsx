'use client'

import { useState } from 'react'

interface SetupNameProps {
	onNameSet: (name: string) => void
}

export default function SetupName({onNameSet}: SetupNameProps) {
	const [input, setInput] = useState('')

	const handleSubmit = () => {
		onNameSet(input)
	}

	return (
		<div>
			<input value={input} onChange={(e) => setInput(e.target.value)} />
			<button onClick={handleSubmit}>Valider</button>
		</div>

	)
}

