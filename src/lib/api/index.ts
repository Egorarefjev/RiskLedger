const API_URL = String(import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
// import { getToken } from '../services/authService.js';

export async function APIRequest(method: string, body: any, endpoint: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = '';

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options: RequestInit = {
        method,
        headers,
        credentials: 'include'
    };

    if (body !== undefined && body !== null) {
        options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const res = await fetch(`${API_URL}${endpoint}`, options);

    if (!res.ok) {
        let message = `Ошибка: ${res.status}`;
        try {
            const err = await res.json();
            if (err?.message) message = err.message;
        } catch {}
        throw new Error(message);
    }

    if (res.status === 204) return undefined;

    return res.json();
}
