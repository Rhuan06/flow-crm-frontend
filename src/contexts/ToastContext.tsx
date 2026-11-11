
'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Container de exibição dos Toasts */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg text-white text-sm font-medium flex justify-between items-center transition-all animate-bounce-once ${
              toast.type === 'success'
                ? 'bg-emerald-600'
                : toast.type === 'error'
                  ? 'bg-rose-600'
                  : 'bg-blue-600'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }

  return context;
}
