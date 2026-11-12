'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        router.push('/login?registered=true');
      } else {
        const data = await response.json();
        setError(data.detail || 'Erro ao criar conta. Verifique os dados.');
      }
    } catch {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-blue-600">FlowCRM</span>
          <h1 className="text-xl font-bold text-gray-800 mt-3">Criar Conta</h1>
          <p className="text-gray-500 text-sm mt-1">Comece a gerir os seus clientes e oportunidades</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Seu Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold p-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 mt-2"
          >
            {loading ? 'A criar conta...' : 'Cadastrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Faça Login
          </Link>
        </p>
      </div>
    </div>
  );
}