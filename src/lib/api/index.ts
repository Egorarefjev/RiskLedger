import { refreshToken } from './auth';
const API_URL = String(import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function APIRequest(
    method: string,
    endpoint: string,
    body?: any,
    extraHeaders?: any,) {
    let isRefreshed = false;
    const headers: Record<string, string> = { ...extraHeaders };
    const token = localStorage.getItem('token');

    if (token && !('Token' in headers)) {
        headers['Token'] = token;
    }

    const options: RequestInit = {
        method,
        headers,
        credentials: 'include'
    };
    if (body !== undefined && body !== null && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);

    }

    let res = await fetch(`${API_URL}${endpoint}`, options);

    if (res.status === 401 && !isRefreshed) {
        const newToken = await refreshToken();
        localStorage.setItem('token', newToken.access.token);

        isRefreshed = true;
        res = await fetch(`${API_URL}${endpoint}`, options);
    }

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
