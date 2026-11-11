
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Barra de Navegação Superior */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <span className="text-xl font-bold text-blue-600">
                FlowCRM
              </span>

              <nav className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Visão Geral
                </Link>

                <Link
                  href="/dashboard/clients"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Clientes
                </Link>

                <Link
                  href="/dashboard/opportunities"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Oportunidades
                </Link>
              </nav>
            </div>

            <button
              onClick={logout}
              className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-2 rounded-md transition-colors"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
