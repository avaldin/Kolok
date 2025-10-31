'use client';

import { useEffect, useRef, useState } from 'react';

interface VerificationCodeProps {
  email: string;
  onSuccess: (userId: string) => void;
  onBack: () => void;
}

export default function VerificationCode({
  email,
  onSuccess,
  onBack,
}: VerificationCodeProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = async (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newCode.every((digit) => digit !== '')) {
      await submitCode(newCode.join(''));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Retour arrière : effacer et revenir au champ précédent
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Flèche gauche
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Flèche droite
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    // Vérifier que c'est bien 6 chiffres
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();

      // Soumettre automatiquement
      await submitCode(pastedData);
    }
  };

  const submitCode = async (codeString: string) => {
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/user/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: codeString,
        }),
      });
      if (!response.ok) {
        const errorData = (await response.json()) as { message: string };
        console.log(errorData);
        throw new Error(errorData.message || 'Code invalide');
      }
      const { id } = (await response.json()) as { id: string };
      onSuccess(id);
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : 'Code invalide');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeString = code.join('');

    if (codeString.length !== 6) {
      setError('Veuillez entrer un code à 6 chiffres');
      return;
    }

    await submitCode(codeString);
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/user/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du code");
      }

      // Afficher un message de succès temporaire
      setError('');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'envoi du code",
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-peach-yellow flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-brown-sugar rounded-lg shadow-lg p-8">
          <button
            onClick={onBack}
            className="mb-4 text-bistre/70 hover:text-bistre flex items-center gap-2 transition-colors"
          >
            <span>←</span> Retour
          </button>

          <h1 className="text-3xl font-bold text-bistre mb-2 text-center">
            Vérification
          </h1>

          <p className="text-bistre/70 text-center mb-8">
            Entrez le code à 6 chiffres envoyé à<br />
            <span className="font-semibold text-bistre">{email}</span>
          </p>

          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            className="space-y-6"
          >
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    handleChange(index, e.target.value);
                  }}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => {
                    handlePaste(e);
                  }}
                  className="w-12 h-14 text-center text-2xl font-bold bg-cadet-gray/30 border-2 border-bistre/20 rounded-lg text-bistre focus:outline-none focus:border-atomic-tangerine transition-colors"
                  disabled={loading}
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/50 rounded-lg p-3 text-red-700 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.some((digit) => digit === '')}
              className="w-full bg-atomic-tangerine hover:bg-atomic-tangerine/90 text-bistre font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                handleResendCode();
              }}
              disabled={resendLoading}
              className="text-bistre/70 hover:text-bistre underline transition-colors disabled:opacity-50"
            >
              {resendLoading ? 'Envoi en cours...' : 'Renvoyer le code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
