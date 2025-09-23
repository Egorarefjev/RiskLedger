import { APIRequest } from './index';
import { API_ENDPOINTS } from './endpoints';


export async function login(username: string, password: string) {
    const basicAuth = btoa(`${username}:${password}`);
    return APIRequest('GET', API_ENDPOINTS.AUTHENTICATION, null, {
        Authorization: `Basic ${basicAuth}`
    });
}

export async function refreshToken() {
    return APIRequest('GET', API_ENDPOINTS.REFRESH);
}

export function logout() {
    try {
        localStorage.removeItem('token');
    } catch {
        console.error('Could not remove token');
    }
}

