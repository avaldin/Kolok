'use client';

import { useState } from 'react';
import { kolokNameValidator } from '../../lib/validation';
import { createRoom, getRoom, joinRoom } from '../../lib/api';
import { useToast } from '../ui/Toast';

interface Room {
  name: string;
  participants: string[];
  tools: string[];
}

interface SetupKolokNameProps {
  userId: string;
  onRoomSet: (room: Room) => void;
}

export default function SetupKolokName({
  userId,
  onRoomSet,
}: SetupKolokNameProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleJoin = async () => {
    setLoading(true);
    try {
      // Rejoindre la room (backend vérifie si elle existe)
      await joinRoom(userId, input.trim());

      // Récupérer les données complètes de la room
      const roomData = await getRoom(input.trim());

      // Passer les données au callback
      onRoomSet(roomData);
    } catch (e) {
      if (e instanceof Error) showToast(e.message, 'error');
      setInput('');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      // Créer la room
      await createRoom(input.trim());

      // Rejoindre la room créée
      await joinRoom(userId, input.trim());

      // Récupérer les données complètes de la room
      const roomData = await getRoom(input.trim());

      // Passer les données au callback
      onRoomSet(roomData);
    } catch (e) {
      if (e instanceof Error) showToast(e.message, 'error');
      setInput('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void handleJoin();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-peach-yellow p-4">
      <div className="w-full max-w-md bg-brown-sugar rounded-2xl border-4 border-bistre p-8 shadow-md">
        <h1 className="text-3xl font-extrabold text-bistre text-center mb-6">
          Rejoindre une KoloK
        </h1>

        <div className="space-y-4">
          <label className="block">
            <span className="text-lg font-semibold text-bistre mb-2 block">
              Nom de votre colocation
            </span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nom de la colocation..."
              className="w-full px-4 py-3 rounded-md border-2 border-bistre bg-cadet-gray text-bistre placeholder-bistre/60 focus:outline-none focus:ring-2 focus:ring-atomic-tangerine"
            />
            {error && (
              <p className="mt-2 text-sm text-red-700 font-semibold">{error}</p>
            )}
          </label>

          <div className="flex gap-3">
            <button
              onClick={void handleJoin}
              disabled={!kolokNameValidator(input) || loading}
              className="flex-1 px-6 py-3 rounded-md border-2 border-bistre bg-atomic-tangerine text-bistre font-semibold hover:bg-atomic-tangerine/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Chargement...' : 'Rejoindre'}
            </button>

            <button
              onClick={void handleCreate()}
              disabled={!kolokNameValidator(input) || loading}
              className="flex-1 px-6 py-3 rounded-md border-2 border-bistre bg-atomic-tangerine text-bistre font-semibold hover:bg-atomic-tangerine/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Chargement...' : 'Créer'}
            </button>
          </div>

          <p className="text-sm text-bistre/70 text-center mt-4">
            Le nom doit contenir entre 3 et 25 caractères (lettres et espaces
            uniquement)
          </p>
        </div>
      </div>
    </main>
  );
}
