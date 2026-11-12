'use client';

import { useState, Suspense } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('[object Object]')) {
          setError('Dados inválidos. Verifique as informações fornecidas.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Falha ao autenticar. Verifique as suas credenciais.');
      }
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
          Aceda à sua conta para gerir clientes e vendas.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {registered && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-md text-center">
            Conta criada com sucesso! Faça login para continuar.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="rounded-md shadow-sm space-y-4">
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Palavra-passe
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {isSubmitting ? 'A entrar...' : 'Entrar no sistema'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Ainda não tem uma conta?{' '}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-sm text-gray-500">A carregar...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}