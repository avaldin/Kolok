import { kolokNameValidator, nameValidator } from './validation';

interface Room {
  name: string;
  participants: string[];
  tools: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const room = (await response.json()) as Room;
  return room;
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
  const room = (await response.json()) as Room;
  return room;
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

export async function postItem(roomName: string, item: string) {
  if (!nameValidator(roomName))
    throw new Error(
      `le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`,
    );
  const response = await fetch(
    `${API_URL}/shopping-list/${encodeURIComponent(roomName)}/item`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: item }),
    },
  );
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

  const response = await fetch(`${API_URL}/user/join-room`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: userId, roomName }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message: string };
    throw new Error(errorData.message || 'Erreur lors du join de la room');
  }
}

export async function getItems(roomName: string) {
  if (!kolokNameValidator(roomName))
    throw new Error(
      `le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`,
    );
  const response = await fetch(
    `${API_URL}/shopping-list/${encodeURIComponent(roomName)}/items`,
  );
  if (!response.ok) {
    if (response.status === 404) {
      const errorData = (await response.json()) as { message: string };
      throw new Error(errorData.message);
    }
    throw new Error(`Erreur ${response.status}`);
  }
  const items = (await response.json()) as string[];
  return items;
}

export async function deleteItem(roomName: string, item: string) {
  if (!kolokNameValidator(roomName))
    throw new Error(
      `le nom doit contenir seulemet des lettres, des espaces, les caracteres suivants [' - _], et doit contenir entre 5 et 25 caracteres`,
    );
  const response = await fetch(
    `${API_URL}/shopping-list/${encodeURIComponent(roomName)}/item/${encodeURIComponent(item)}`,
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

// TODO: Cette fonction nécessite une refonte pour utiliser userId au lieu de userName
// depuis le localStorage. L'endpoint backend attend le participantName mais on n'a plus
// accès au userName côté frontend. Solution possible: utiliser DELETE /user/leave-room
// avec userId uniquement
export async function quitRoom(userId: string): Promise<void> {
  const response = await fetch(`${API_URL}/user/leave-room`, {
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
  subscription: PushSubscription,
) {
  console.log(subscription.options);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ URL: subscription }),
    },
  );
  if (!response.ok) {
    console.log(`error during subscription to backend`);

    const error = (await response.json()) as { message: string };
    throw new Error(error.message);
  }
}

export async function sendUnsubscriptionToBackend(
  subscription: PushSubscription,
) {
  console.log(subscription);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ URL: subscription }),
    },
  );
  if (!response.ok) {
    console.log(`error during subscription to backend`);
    const error = (await response.json()) as { message: string };
    throw new Error(error.message);
  }
}

export async function registerUser(email: string, name: string): Promise<void> {
  const response = await fetch(`${API_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });
  if (!response.ok) {
    const errorData = (await response.json()) as { message: string };
    throw new Error(
      errorData.message || 'Erreur lors de la création du compte',
    );
  }
}

export async function loginUser(email: string): Promise<void> {
  const response = await fetch(`${API_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const errorData = (await response.json()) as { message: string };
    throw new Error(errorData.message || 'Erreur lors de la connexion');
  }
}

export async function verifyEmail(email: string, code: string) {
  const response = await fetch(`${API_URL}/user/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  if (!response.ok) {
    const errorData = (await response.json()) as { message: string };
    throw new Error(errorData.message || 'Code invalide');
  }
  const { userId } = (await response.json()) as { userId: string };
}

export async function resendVerificationCode(email: string): Promise<void> {
  const response = await fetch(`${API_URL}/user/resend-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const errorData = (await response.json()) as { message: string };
    throw new Error(errorData.message || "Erreur lors de l'envoi du code");
  }
}
