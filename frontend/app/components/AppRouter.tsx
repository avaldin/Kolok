'use client';

import React, { useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import SetupKolokName from './setup/SetupKolokName';
import MainApp from './main/MainApp';
import { getRoomByUserId } from '../lib/api';
import { useToast } from './ui/Toast';
import Authentication from './auth/Authentication';

interface Room {
  name: string;
  participants: string[];
  tools: string[];
}

export default function AppRouter() {
  const [userId, setUserId] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  // Initialisation: charger userId et room associée
  useEffect(() => {
    const initialize = async () => {
      try {
        const storedUserId = storage.getUserId();

        if (!storedUserId) {
          setIsLoading(false);
          return;
        }

        setUserId(storedUserId);

        const userRoom = await getRoomByUserId(storedUserId);

        if (!userRoom) {
          setIsLoading(false);
          return;
        }
        setRoom(userRoom);
      } catch (error) {
        console.error('Erreur initialisation:', error);
        if (error instanceof Error) {
          showToast(error.message, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [showToast]);

  // Callback après authentification réussie
  const handleAuthSuccess = (id: string) => {
    storage.setUserId(id);
    setUserId(id);
  };

  // Callback après assignation d'une room
  const handleRoomSet = (roomData: Room) => {
    setRoom(roomData);
  };

  // Callback pour quitter la room (future feature)
  const handleLeaveRoom = () => {
    setRoom(null);
  };

  // États de rendu
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-peach-yellow">
        <p className="text-bistre text-lg">Initialisation...</p>
      </main>
    );
  }

  if (!userId) {
    return <Authentication onAuthSuccess={handleAuthSuccess} />;
  }

  if (!room) {
    return <SetupKolokName userId={userId} onRoomSet={handleRoomSet} />;
  }

  return <MainApp room={room} userId={userId} onLeaveRoom={handleLeaveRoom} />;
}
