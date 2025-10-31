import { kolokNameValidator } from './validation';

interface Room {
  name: string;
  participants: string[];
  tools: string[];
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Récupère la room associée à un utilisateur
 * @param userId - ID de l'utilisateur
 * @returns Room complète ou null si l'utilisateur n'a pas de room
 */
export async function getRoomByUserId(userId: string): Promise<Room | null> {
  const response = await fetch(`${API_URL}/room/byUserId/${userId}`);

  if (response.status === 404) {
    // Utilisateur n'a pas de room
    return null;
  }

  if (!response.ok) {
    const errorData = (await response.json()) as { message: string };
    throw new Error(
      errorData.message || 'Erreur lors de la récupération de la room',
    );
  }
  return (await response.json()) as Room;
}

export async function getRoom(roomName: string): Promise<Room> {
  if (!kolokNameValidator(roomName))
    throw new Error(
      `le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`,
    );
  const response = await fetch(
    `${API_URL}/room/${encodeURIComponent(roomName)}`,
  );
  if (!response.ok) {
    if (response.status) {
      const errorData = (await response.json()) as { message: string };
      throw new Error(errorData.message);
    }
    throw new Error(`Erreur ${response.status}`);
  }
  return (await response.json()) as Room;
}

export async function createRoom(roomName: string) {
  if (!kolokNameValidator(roomName))
    throw new Error(
      `le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`,
    );
  const response = await fetch(`${API_URL}/room`, {
    method: 'POST',
    body: JSON.stringify({ name: roomName }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    if (response.status === 409) {
      const errorData = (await response.json()) as { message: string };
      throw new Error(errorData.message);
    }
    throw new Error(`Erreur ${response.status}`);
  }
}

export async function postItem(userId: string, item: string) {
  const response = await fetch(`${API_URL}/shopping-list/item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item: item, userId: userId }),
  });
  if (!response.ok) {
    const errorData = (await response.json()) as { message: string };
    throw new Error(errorData.message);
  }
}

export async function joinRoom(
  userId: string,
  roomName: string,
): Promise<void> {
  if (!kolokNameValidator(roomName))
    throw new Error(
      `le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`,
    );

  const response = await fetch(`${API_URL}/room/join-room`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: userId, roomName: roomName }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message: string };
    throw new Error(errorData.message || 'Erreur lors du join de la room');
  }
}

export async function getItems(userId: string) {
  const response = await fetch(`${API_URL}/shopping-list/${userId}/items`);
  if (!response.ok) {
    if (response.status === 404) {
      const errorData = (await response.json()) as { message: string };
      throw new Error(errorData.message);
    }
    throw new Error(`Erreur ${response.status}`);
  }
  return (await response.json()) as string[];
}

export async function deleteItem(userId: string, item: string) {
  const response = await fetch(
    `${API_URL}/shopping-list/${userId}/item/${encodeURIComponent(item)}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (!response.ok) {
    if (response.status === 404) {
      const errorData = (await response.json()) as { message: string };
      throw new Error(errorData.message);
    }
    throw new Error(`Erreur ${response.status}`);
  }
}

export async function quitRoom(userId: string): Promise<void> {
  const response = await fetch(`${API_URL}/room/leave-room`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: userId }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message: string };
    throw new Error(errorData.message || 'Erreur lors de la déconnexion');
  }
}

export async function addTool(roomName: string, tool: string) {
  if (!kolokNameValidator(roomName))
    throw new Error(
      `le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`,
    );
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(tool)}/${encodeURIComponent(roomName)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (!response.ok) {
    const errorData = (await response.json()) as { message: string };
    throw new Error(errorData.message);
  }
}

export async function sendSubscriptionToBackend(
  userId: string,
  subscription: { url: string; p256dh: string; auth: string },
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionDto: subscription, userId }),
    },
  );
  if (!response.ok) {
    console.log(`error during subscription to backend`);

    const error = (await response.json()) as { message: string };
    throw new Error(error.message);
  }
}

export async function sendUnsubscriptionToBackend(userId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId }),
    },
  );
  if (!response.ok) {
    console.log(`error during subscription to backend`);
    const error = (await response.json()) as { message: string };
    throw new Error(error.message);
  }
}
