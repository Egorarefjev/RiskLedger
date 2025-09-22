const API_URL = String(import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function APIRequest(
    method: string,
    endpoint: string,
    body?: any,
    extraHeaders?: any,
) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', ...extraHeaders };
    const token = localStorage.getItem('token');

    if (token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
        method,
        headers,
        credentials: 'include'
    };

    if (body !== undefined && body !== null) {
        options.body = JSON.stringify(body);
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
