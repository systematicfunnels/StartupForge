const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
  }
}

async function fetchWithAuth(path: string, options: RequestInit = {}, token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = 'An error occurred';
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new ApiError(message, res.status);
  }

  // Handle empty responses (e.g. 204)
  if (res.status === 204) return null;

  return res.json();
}

// ── Auth ───────────────────────────────────────────────────────────────────────
export const authApi = {
  sync: (token: string) =>
    fetchWithAuth('/api/auth/sync', { method: 'POST' }, token),

  me: (token: string) =>
    fetchWithAuth('/api/auth/me', {}, token),
};

// ── Projects ───────────────────────────────────────────────────────────────────
export const projectsApi = {
  list: (token: string) =>
    fetchWithAuth('/api/projects', {}, token),

  get: (id: string, token: string) =>
    fetchWithAuth(`/api/projects/${id}`, {}, token),

  create: (data: { idea: string; targetAudience?: string; problem?: string; title?: string }, token: string) =>
    fetchWithAuth('/api/projects', { method: 'POST', body: JSON.stringify(data) }, token),

  delete: (id: string, token: string) =>
    fetchWithAuth(`/api/projects/${id}`, { method: 'DELETE' }, token),

  exportMarkdown: (id: string, token: string) =>
    fetch(`${API_URL}/api/projects/${id}/export?format=markdown`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// ── Generation ─────────────────────────────────────────────────────────────────
export const generateApi = {
  start: (projectId: string, token: string) =>
    fetchWithAuth(`/api/generate/${projectId}/start`, { method: 'POST' }, token),

  regenerateStep: (projectId: string, step: number, token: string) =>
    fetchWithAuth(`/api/generate/${projectId}/step/${step}`, { method: 'POST' }, token),

  // Returns an EventSource for SSE streaming
  statusStream: (projectId: string, token: string): EventSource => {
    return new EventSource(
      `${API_URL}/api/generate/${projectId}/status?token=${token}`
    );
  },
};

// ── Billing ────────────────────────────────────────────────────────────────────
export const billingApi = {
  checkout: (plan: string, token: string) =>
    fetchWithAuth('/api/billing/checkout', { method: 'POST', body: JSON.stringify({ plan }) }, token),

  portal: (token: string) =>
    fetchWithAuth('/api/billing/portal', { method: 'POST' }, token),
};

export { ApiError };
