import { api, setToken } from './api';

export async function login(username: string, password: string) {
    const data = await api('/api/Auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
    setToken(data.token, data.expiresAt);
    return data;
}
