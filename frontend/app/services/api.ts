interface Room {
	name: string,
	participants: string[],
	tools: string[],
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function getRoom(roomName: string): Promise<Room> {
	if (
		!roomName ||
		roomName.trim().length < 3 ||
		roomName.trim().length > 25 ||
		/[^a-z ]/i.test(roomName)
	)
		throw new Error(`Le nom doit avoir une taille entre 3 et 25, et doit être composé uniquement de lettre`)
	const response = await fetch(`${API_URL}/room/${roomName}`)
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

export async function postItem(roomName: string, items: string) {
	console.log(roomName, items)

	if (
		!roomName ||
		roomName.trim().length < 3 ||
		roomName.trim().length > 25 ||
		/[^a-z ]/i.test(roomName)
	)
		throw new Error(`Le nom doit avoir une taille entre 3 et 25, et doit être composé uniquement de lettre`)
	const response = await fetch(`${API_URL}/shopping-list/${roomName}/items`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({items: items}),
	})
	if (!response.ok) {
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
	const response = await fetch(`${API_URL}/shopping-list/${roomName}/items`)
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
	const response = await fetch(`${API_URL}/shopping-list/${roomName}/items/${item}`, {
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