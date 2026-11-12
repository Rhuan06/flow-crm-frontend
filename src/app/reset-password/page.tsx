'use client';

import { useState, Suspense } from 'react';
import type { FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token de recuperação ausente ou inválido.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login?reset=true');
      } else {
        setError(data.detail || 'Não foi possível redefinir a senha.');
      }
    } catch {
      setError('Erro de conexão com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
          FlowCRM
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Crie uma nova senha para a sua conta.
        </p>
      </div>

      {!token ? (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
            Link de recuperação inválido. Solicite um novo link na tela de esqueci minha senha.
          </div>
          <p className="text-center text-sm text-gray-600">
            <Link
              href="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
              Solicitar novo link
            </Link>
          </p>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Nova Senha
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={6}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Nova Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1"
                placeholder="Repita a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'A guardar...' : 'Redefinir senha'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-sm text-gray-500">A carregar...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}