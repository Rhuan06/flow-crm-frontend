
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Inter } from 'next/font/google';
import './globals.css';

import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FlowCRM',
  description: 'Sistema profissional de gestão de clientes e vendas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
