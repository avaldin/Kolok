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

  // Premier useEffect: initialiser userId depuis storage
  useEffect(() => {
    const storedUserId = storage.getUserId();
    if (storedUserId) {
      setUserId(storedUserId);
    }
    setIsLoading(false);
  }, []);

  // Deuxième useEffect: charger la room quand userId change
  useEffect(() => {
    if (!userId) return;

    const loadRoom = async () => {
      try {
        console.log(userId);
        const userRoom = await getRoomByUserId(userId);
        if (userRoom) {
          setRoom(userRoom);
        }
      } catch (error) {
        console.error('Erreur chargement room:', error);
        if (error instanceof Error) {
          showToast(error.message, 'error');
        }
      }
    };

    loadRoom();
  }, [userId]);

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
