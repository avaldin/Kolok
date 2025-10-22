import { kolokNameValidator, nameValidator } from './validation'
import { storage } from './storage'

interface Room {
	name: string,
	participants: string[],
	tools: string[],
}

const API_URL = process.env.NEXT_PUBLIC_API_URL
export async function getRoom(roomName: string): Promise< Room> {
	if (!kolokNameValidator(roomName))
		throw new Error(`le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`)
	const response = await fetch(`${API_URL}/room/${encodeURIComponent(roomName)}`)
	if (!response.ok) {
		if (response.status) {
			const errorData = await response.json()
			throw new Error(errorData.message)
		}
		throw new Error(`Erreur ${response.status}`)
	}
	return response.json()
}

export async function createRoom(roomName: string): Promise< Room> {
	if (!kolokNameValidator(roomName))
		throw new Error(`le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`)
	const response = await fetch(`${API_URL}/room`, {
		method: 'POST',
		body: JSON.stringify({name: roomName}),
		headers: { 'Content-Type': 'application/json' },
	})
	if (!response.ok) {
		if (response.status === 409) {
			const errorData = await response.json()
			throw new Error(errorData.message)
		}
		throw new Error(`Erreur ${response.status}`)
	}
	return response.json()
}


export async function postItem(roomName: string, item: string) {
	if (!nameValidator(roomName))
		throw new Error(`le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`)
	const response = await fetch(`${API_URL}/shopping-list/${encodeURIComponent(roomName)}/item`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({item: item}),
	})
	if (!response.ok) {
		const errorData = await response.json()
		throw new Error(errorData.message)
	}
}

export async function joinRoom(roomName: string): Promise<void> {
	if (!kolokNameValidator(roomName))
		throw new Error(`le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`)
	const username = storage.getUserName()
	if (!username)
		throw new Error(`le nom d'utilisateur doit etre choisi avant de rejoindre une kolok`)
	if (!nameValidator(username))
		throw new Error(`le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`)
	const response = await fetch(`${API_URL}/room/${encodeURIComponent(roomName)}/participant`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({participantName: username}),
	})
	if (!response.ok) {
		if (response.status === 409) {
			const errorData = await response.json()
			throw new Error(errorData.message)
		}
		throw new Error(`Erreur ${response.status}`)
	}
}

export async function getItems(roomName: string) {
	if (!kolokNameValidator(roomName))
		throw new Error(`le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`)
	const response = await fetch(`${API_URL}/shopping-list/${encodeURIComponent(roomName)}/items`)
	if (!response.ok) {
		if (response.status === 404) {
			const errorData = await response.json()
			throw new Error(errorData.message)
		}
		throw new Error(`Erreur ${response.status}`)
	}
	const data = response.json()
	if (!data)
		throw new Error(`idk`)
	return data
}

export async function deleteItem(roomName: string, item: string) {
	if (!kolokNameValidator(roomName))
		throw new Error(`le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`)
	const response = await fetch(`${API_URL}/shopping-list/${encodeURIComponent(roomName)}/item/${encodeURIComponent(item)}`, {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json'},
	})
	if (!response.ok) {
		if (response.status === 404) {
			const errorData = await response.json()
			throw new Error(errorData.message)
		}
		throw new Error(`Erreur ${response.status}`)
	}
}

export async function quitRoom(roomName: string): Promise<void> {
	if (!roomName || !kolokNameValidator(roomName))
		throw new Error(`le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`)
	const username = storage.getUserName()
	if (!username || !nameValidator(username))
		throw new Error(`le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 20 caracteres`)
	const response = await fetch(`${API_URL}/room/${encodeURIComponent(roomName)}/participant`, {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({participantName: username}),
	})
	if (!response.ok) {
		if (response.status === 409) {
			const errorData = await response.json()
			throw new Error(errorData.message)
		}
		throw new Error(`Erreur ${response.status}`)
	}
}

export async function addTool(roomName: string, tool: string) {
	if (!kolokNameValidator(roomName))
		throw new Error(`le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`)
	const response = await fetch(`${API_URL}/${encodeURIComponent(tool)}/${encodeURIComponent(roomName)}`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
	})
	if (!response.ok) {
		const errorData = await response.json()
		throw new Error(errorData.message)
	}
}