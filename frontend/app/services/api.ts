import { kolokNameValidator, nameValidator } from '../lib/validation'
import { storage } from '../lib/storage'

interface Room {
	name: string,
	participants: string[],
	tools: string[],
}

const API_URL = process.env.NEXT_PUBLIC_API_URL
export async function getRoom(roomName: string): Promise< Room | null> {
	if (!kolokNameValidator(roomName))
		return null
	const response = await fetch(`${API_URL}/room/${encodeURIComponent(roomName)}`)
	if (!response.ok) {
		if (response.status === 404) {
			return null
		}
		throw new Error(`Erreur ${response.status}`)
	}
	const data = response.json()
	if (!data)
		throw new Error(`idk`)
	return data
}

export async function createRoom(roomName: string): Promise< Room | null> {
	if (!kolokNameValidator(roomName))
		return null //popup
	const response = await fetch(`${API_URL}/room`, {
		method: 'POST',
		body: JSON.stringify({name: roomName}),
		headers: { 'Content-Type': 'application/json' },
	})
	if (!response.ok) {
		if (response.status === 409) {
			return null //popup
		}
		throw new Error(`Erreur ${response.status}`)
	}
	const data = response.json()
	if (!data)
		throw new Error(`idk`)
	return data
}


export async function postItem(roomName: string, item: string) {
	if (
		!roomName ||
		roomName.trim().length < 3 ||
		roomName.trim().length > 25 ||
		/[^a-z ]/i.test(roomName)
	)
		throw new Error(`Le nom doit avoir une taille entre 3 et 25, et doit être composé uniquement de lettre`)
	const response = await fetch(`${API_URL}/shopping-list/${encodeURIComponent(roomName)}/item`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({item: item}),
	})
	if (!response.ok) {
		throw new Error(`Erreur ${response.status}`)
	}
}

export async function joinRoom(roomName: string): Promise<void> {
	if (!kolokNameValidator(roomName))
		return //popup
	const username = storage.getUserName()
	console.log(username, roomName)
	if (!username || !nameValidator(username))
		return //popup
	const response = await fetch(`${API_URL}/room/${encodeURIComponent(roomName)}/participant`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({participantName: username}),
	})
	if (!response.ok) {
		if (response.status === 409) {
			console.log('error')
			return   //popup
		}
		throw new Error(`Erreur ${response.status}`)
	}
}

export async function getItems(roomName: string) {
	if (
		!roomName ||
		roomName.trim().length < 3 ||
		roomName.trim().length > 25 ||
		/[^a-z ]/i.test(roomName)
	)
		throw new Error(`Le nom doit avoir une taille entre 3 et 25, et doit être composé uniquement de lettre`)
	const response = await fetch(`${API_URL}/shopping-list/${encodeURIComponent(roomName)}/items`)
	if (!response.ok) {
		if (response.status === 404) {
			throw new Error(`La room "${roomName}" n'existe pas`)
		}
		throw new Error(`Erreur ${response.status}`)
	}
	const data = response.json()
	if (!data)
		throw new Error(`idk`)
	return data
}

export async function deleteItem(roomName: string, item: string) {
	if (
		!roomName ||
		roomName.trim().length < 3 ||
		roomName.trim().length > 25 ||
		/[^a-z ]/i.test(roomName)
	)
		throw new Error(`Le nom doit avoir une taille entre 3 et 25, et doit être composé uniquement de lettre`)
	const response = await fetch(`${API_URL}/shopping-list/${encodeURIComponent(roomName)}/item/${encodeURIComponent(item)}`, {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json'},
	})
	if (!response.ok) {
		if (response.status === 404) {
			throw new Error(`La room "${roomName}" n'existe pas`)
		}
		throw new Error(`Erreur ${response.status}`)
	}
}

export async function quitRoom(roomName: string | null): Promise<void> {
	if (!roomName || !kolokNameValidator(roomName))
		return //popup
	const username = storage.getUserName()
	console.log(username, roomName)
	if (!username || !nameValidator(username))
		return //popup
	const response = await fetch(`${API_URL}/room/${encodeURIComponent(roomName)}/participant`, {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({participantName: username}),
	})
	if (!response.ok) {
		if (response.status === 409) {
			console.log('error')
			return   //popup
		}
		throw new Error(`Erreur ${response.status}`)
	}
}

export async function addTool(roomName: string, tool: string) {
	if (!kolokNameValidator(roomName))
		return // popup
	const response = await fetch(`${API_URL}/${encodeURIComponent(tool)}/${encodeURIComponent(roomName)}`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
	})
	if (!response.ok) {
		throw new Error(`Erreur ${response.status}`)
	}
}