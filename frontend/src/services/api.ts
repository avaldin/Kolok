const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function getParticipants(roomName: string) {
	console.log(`sssss`)
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
	const data = await response.json()
	console.log(data.participants)
	return data.participants
}