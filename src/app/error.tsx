'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Futuramente, o erro poderá ser enviado para serviços como Sentry ou Datadog.
    console.error('Erro global capturado:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-4 border border-gray-200">
        <div className="text-red-500 mb-2 flex justify-center">
          <svg
            className="w-16 h-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900">
          Ocorreu um erro inesperado
        </h2>

        <p className="text-gray-600 text-sm">
          A aplicação encontrou um problema ao tentar carregar esta página.
        </p>

        <div className="pt-4">
          <button
            onClick={() => reset()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}