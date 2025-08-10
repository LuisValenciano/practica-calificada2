export function getToken() {
    return localStorage.getItem('authToken') ?? '';
}
export function setToken(t: string, exp?: string) {
    localStorage.setItem('authToken', t);
    if (exp) localStorage.setItem('tokenExpiry', exp);
}
export async function api(path: string, init: RequestInit = {}) {
    const base = import.meta.env.VITE_API_URL;
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(init.headers as any),
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${base}${path}`, { ...init, headers });
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
}
