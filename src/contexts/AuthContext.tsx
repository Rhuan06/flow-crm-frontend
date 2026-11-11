
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import type { ReactNode } from 'react';

import { User } from '@/types';
import { apiFetch } from '@/services/api';
import { useRouter } from 'next/navigation';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Contexto iniciado como undefined
const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('flowcrm_token');

      if (token) {
        try {
          const userData = await apiFetch<User>('/auth/me');
          setUser(userData);
        } catch (error) {
          console.error('Token inválido ou expirado', error);
          localStorage.removeItem('flowcrm_token');
        }
      }

      setIsLoading(false);
    }

    loadUser();
  }, []);

  async function login(email: string, password: string) {
    const params = new URLSearchParams();

    params.append('username', email);
    params.append('password', password);

    const response = await apiFetch<{ access_token: string }>('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    localStorage.setItem('flowcrm_token', response.access_token);

    // Tenta buscar o usuário, limpando tudo se falhar
    try {
      const userData = await apiFetch<User>('/auth/me');

      setUser(userData);
      router.push('/dashboard');
    } catch (error) {
      localStorage.removeItem('flowcrm_token');
      setUser(null);

      throw error;
    }
  }

  function logout() {
    localStorage.removeItem('flowcrm_token');

    setUser(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado com validação do contexto
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }

  return context;
}
