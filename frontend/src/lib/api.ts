const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) return fetchWithAuth(path, options);
    logout();
    throw new ApiError(401, 'Session expirée');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.message || 'Erreur serveur');
  }

  return res.json();
}

async function refreshToken(): Promise<boolean> {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) return false;
  
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) return false;
    const { data } = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    return true;
  } catch {
    return false;
  }
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
}

export const api = {
  get: (path: string) => fetchWithAuth(path),
  post: (path: string, body: unknown) => fetchWithAuth(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: unknown) => fetchWithAuth(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path: string) => fetchWithAuth(path, { method: 'DELETE' }),
};