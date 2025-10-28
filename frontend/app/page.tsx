'use client';

import dynamic from 'next/dynamic';
import { useServiceWorker } from './lib/hooks';
import { useToast } from './lib/toast';

const AppRouter = dynamic(() => import('./components/AppRouter'), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen items-center justify-center">
      <p>chargement...</p>
    </main>
  ),
});

export default function Home() {
  const { showToast } = useToast();

  try {
    useServiceWorker();
  } catch (e) {
    if (e instanceof Error) showToast(e.message, 'error');
  }

  return <AppRouter />;
}
