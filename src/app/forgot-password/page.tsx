'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.');
        setEmail('');
      } else {
        setError(data.detail || 'Não foi possível processar a solicitação.');
      }
    } catch {
      setError('Erro de conexão com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            FlowCRM
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Informe o seu e-mail para receber o link de recuperação de senha.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-md text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Endereço de E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'A enviar...' : 'Enviar link de recuperação'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Lembrou-se da senha?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
              Voltar ao login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}