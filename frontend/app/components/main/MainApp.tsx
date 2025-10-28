'use client';

import { Header } from '../layout/header';
import ResumeCard from '../layout/resumeCard';

interface Room {
  name: string;
  participants: string[];
  tools: string[];
}

interface MainAppProps {
  room: Room;
  userId: string;
  onLeaveRoom: () => void;
}

export default function MainApp({ room, userId, onLeaveRoom }: MainAppProps) {
  return (
    <>
      <main className="flex flex-col min-h-screen justify-center">
        <Header userId={userId} />
        <div className="flex-1 flex items-center">
          <ResumeCard
            name={room.name}
            participants={room.participants}
            tools={room.tools}
          />
        </div>
      </main>
    </>
  );
}
