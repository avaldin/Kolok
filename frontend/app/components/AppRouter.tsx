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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  useEffect(() => {
    const storedUserId = storage.getUserId();
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const loadRoom = async () => {
      try {
        const userRoom = await getRoomByUserId(userId);
        if (userRoom) {
          setRoom(userRoom);
        }
      } catch (error) {
        console.error('Erreur chargement room:', error);
        setUserId(null);
        if (error instanceof Error) {
          showToast(error.message, 'error');
        }
      }
    };

    setIsLoading(true);
    loadRoom().then(() => setIsLoading(false));
  }, [userId]);

  const handleAuthSuccess = (id: string) => {
    storage.setUserId(id);
    setUserId(id);
  };

  const handleRoomSet = (roomData: Room) => {
    setRoom(roomData);
  };

  const handleLeaveRoom = () => {
    setRoom(null);
  };

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
