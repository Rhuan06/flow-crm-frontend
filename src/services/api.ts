const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

export async function apiFetch<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    // Recupera o token de autenticação do localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('flowcrm_token') : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
    // Trata erros de autenticação (401 Unauthorized)
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('flowcrm_token');
      window.location.href = '/login';
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Erro na requisição: ${response.status}`);
  }

  // Se a resposta for 204 (No Content), não tenta converter para JSON
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

