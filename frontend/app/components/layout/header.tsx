import { OptionButton } from '../ui/optionButton';
import React from 'react';

interface HeaderProps {
  userId: string;
}

const Header = ({ userId }: HeaderProps) => {
  return (
    <header className="bg-bistre w-full shadow-2xl flex justify-center">
      <div id="appName" className="justify-between px-6 w-full flex max-w-7xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-cadet-gray">
          KoloK
        </h1>
        <OptionButton userId={userId} />
      </div>
    </header>
  );
};

export { Header };
