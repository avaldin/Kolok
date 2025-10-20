'use client'

import React, { useEffect, useState } from 'react'
import { storage } from '../lib/storage'
import SetupName from './setup/SetupName'
import SetupKolokName from './setup/SetupKolokName'
import MainApp from './main/MainApp'
import { getRoom } from '../services/api'

export default function AppRouter() {
	const [userName, setUserName] = useState<string | null>()
	const [kolokName, setKolokName] = useState<string | null>()
	const [isInitialized, setIsInitialized] = useState<boolean>(false)

	useEffect(() => {
		const userName = storage.getUserName()
		const kolok = storage.getKolokName()

		setUserName(userName)
		const setKolokNameIfExists = async () => {
			if (kolok && await getRoom(kolok))
				setKolokName(kolok)
			else {
				setKolokName('')
				storage.setKolokName('')
			}
			setIsInitialized(true)
		}
		setKolokNameIfExists()
	}, [])

	if (!isInitialized) {
		return (
			<main className="flex min-h-screen items-center justify-center">
				<p>Initialisation...</p>
			</main>
		)
	}

	if (!userName) {
		return <SetupName
			onNameSet={(name: string) => {
				storage.setUserName(name)
				setUserName(name)
			}}
		/>
	}


	if (!kolokName) {
		return <SetupKolokName
			onKolokNameSet={(name: string) => {
				storage.setKolokName(name)
				setKolokName(name)
			}}
		/>
	}

	return <MainApp
		userName={userName}
		kolokName={kolokName}
		clearKolokNameAction={() => {
			storage.setKolokName('')
			setKolokName('')
		}}
	/>
}