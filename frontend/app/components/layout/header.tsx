'use client';

import { OptionButton } from '../ui/optionButton';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Lire userId au montage du composant
    setUserId(localStorage.getItem('userId'));

    // Écouter les changements de userId via event custom
    const handleUserIdChange = (e: Event) => {
      const customEvent = e as CustomEvent<string | null>;
      setUserId(customEvent.detail);
    };

    window.addEventListener('userIdChanged', handleUserIdChange);

    return () => {
      window.removeEventListener('userIdChanged', handleUserIdChange);
    };
  }, []);

  return (
    <header className="bg-bistre w-full shadow-2xl flex justify-center">
      <div id="appName" className="justify-between px-6 w-full flex max-w-7xl">
        <Link href="/">
          <h1 className="text-3xl sm:text-4xl font-bold text-cadet-gray cursor-pointer hover:text-cadet-gray/80 transition">
            KoloK
          </h1>
        </Link>
        {userId && <OptionButton userId={userId} />}
      </div>
    </header>
  );
};

export { Header };
