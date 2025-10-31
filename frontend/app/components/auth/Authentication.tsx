'use client';

import { useState } from 'react';
import VerificationCode from './VerificationCode';

type AuthMode = 'login' | 'register';
type AuthStep = 'form' | 'verification';

interface AuthenticationProps {
  onAuthSuccess: (userId: string) => void;
}

export default function Authentication({ onAuthSuccess }: AuthenticationProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<AuthStep>('form');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = mode === 'login' ? '/user/login' : '/user/register';

      const body = mode === 'login' ? { email } : { email, name };
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message: string };

        throw new Error(errorData.message || 'Une erreur est survenue');
      }
      setStep('verification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (userId: string) => {
    onAuthSuccess(userId);
  };

  const handleBackToForm = () => {
    setStep('form');
    setError('');
  };

  if (step === 'verification') {
    return (
      <VerificationCode
        email={email}
        onSuccess={handleVerificationSuccess}
        onBack={handleBackToForm}
      />
    );
  }

  return (
    <div className="min-h-screen bg-peach-yellow flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-brown-sugar rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-bistre mb-6 text-center">
            Kolok
          </h1>

          {/* Tabs */}
          <div className="flex mb-6 bg-bistre/10 rounded-lg p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-atomic-tangerine text-bistre font-semibold'
                  : 'text-bistre/70 hover:text-bistre'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-atomic-tangerine text-bistre font-semibold'
                  : 'text-bistre/70 hover:text-bistre'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            className="space-y-4"
          >
            {mode === 'register' && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-bistre font-medium mb-2"
                >
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-cadet-gray/30 border-2 border-bistre/20 rounded-lg text-bistre placeholder-bistre/50 focus:outline-none focus:border-atomic-tangerine transition-colors"
                  placeholder="Votre nom"
                  required
                  minLength={3}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-bistre font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-cadet-gray/30 border-2 border-bistre/20 rounded-lg text-bistre placeholder-bistre/50 focus:outline-none focus:border-atomic-tangerine transition-colors"
                placeholder="votre@email.com"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/50 rounded-lg p-3 text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-atomic-tangerine hover:bg-atomic-tangerine/90 text-bistre font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Chargement...'
                : mode === 'login'
                  ? 'Se connecter'
                  : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-6 text-center text-bistre/70 text-sm">
            {mode === 'login'
              ? 'Un code de vérification sera envoyé à votre adresse email'
              : 'Vous recevrez un code de vérification par email'}
          </p>
        </div>
      </div>
    </div>
  );
}
