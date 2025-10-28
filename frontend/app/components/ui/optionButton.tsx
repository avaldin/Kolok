'use client';

import { Bell, LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { storage } from '../../lib/storage';
import { quitRoom } from '../../lib/api';
import { useToast } from './Toast';
import { useServiceWorker } from '../../lib/hooks';

interface OptionButtonProps {
  userId: string;
}

function OptionButton({ userId }: OptionButtonProps) {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // TODO: Implémenter le changement de nom (modifier User.name côté backend)
  const handleChangeName = () => {
    showToast('Fonctionnalité à implémenter: changer de nom', 'info');
  };

  // TODO: Implémenter le changement de kolok (quitter la room actuelle)
  const handleChangeKolok = async () => {
    try {
      await quitRoom(userId);
      window.location.reload();
    } catch (e) {
      if (e instanceof Error) showToast(e.message, 'error');
    }
  };

  const handleLogout = () => {
    storage.clearUserId();
    window.location.reload();
  };

  const { isSupported, subscribeToNotifications, unSubscribeToNotifications } =
    useServiceWorker();

  const switchNotification = async (enabled: boolean) => {
    if (enabled === true) {
      if (!isSupported) {
        showToast(`Votre support ne gere pas les notifictions.`, `error`);
      }
      try {
        await subscribeToNotifications();
      } catch (e) {
        if (e instanceof Error) showToast(e.message, 'error');
      }
    } else {
      try {
        await unSubscribeToNotifications();
      } catch (e) {
        if (e instanceof Error) showToast(e.message, 'error');
      }
    }
  };

  const handleToggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    void switchNotification(newState);
  };

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center m-1 p-1 bg-brown-sugar rounded-md shadow-amber-200 hover:bg-atomic-tangerine transition-colors"
        aria-label="Options"
      >
        <Settings />
      </button>

      <div
        className={`absolute right-0 top-full mt-1 bg-brown-sugar rounded-md shadow-lg overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ minWidth: '200px' }}
      >
        <div className="flex flex-col p-2 gap-2">
          <button
            onClick={handleToggleNotifications}
            className={`flex items-center justify-between px-4 py-2 rounded-md transition-colors text-bistre font-medium ${
              notificationsEnabled
                ? 'bg-peach-yellow hover:bg-atomic-tangerine'
                : 'bg-atomic-tangerine hover:bg-peach-yellow'
            }`}
          >
            <div className="flex items-center mx-2 gap-2">
              <Bell size={18} />
              Notifications
            </div>
            <div
              className={`w-10 h-5 rounded-full transition-colors ${
                notificationsEnabled ? 'bg-bistre' : 'bg-cadet-gray'
              } relative`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-peach-yellow transition-transform ${
                  notificationsEnabled ? 'left-5' : 'left-0.5'
                }`}
              />
            </div>
          </button>
          <button
            onClick={handleChangeName}
            className="flex items-center gap-2 px-4 py-2 bg-atomic-tangerine rounded-md hover:bg-peach-yellow transition-colors text-bistre font-medium"
          >
            <User size={18} />
            Changer de nom
          </button>
          <button
            onClick={() => void handleChangeKolok()}
            className="flex items-center gap-2 px-4 py-2 bg-atomic-tangerine rounded-md hover:bg-peach-yellow transition-colors text-bistre font-medium"
          >
            <LogOut size={18} />
            Quitter la kolok
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/80 rounded-md hover:bg-red-500 transition-colors text-bistre font-medium"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
export { OptionButton };
