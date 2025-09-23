import { API_ENDPOINTS } from './endpoints';
import { APIRequest } from './index';

export function getIMDG(qs: string | URLSearchParams = '') {
    const suffix =
        typeof qs === 'string'
            ? (qs.startsWith('?') ? qs.slice(1) : qs)
            : qs.toString();

    const endpoint = suffix
        ? `${API_ENDPOINTS.IMDG}?${suffix}`
        : API_ENDPOINTS.IMDG;

    return APIRequest('GET', endpoint);
}

export function getIMDGCount(qs: string | URLSearchParams = '') {
    const suffix =
        typeof qs === 'string'
            ? (qs.startsWith('?') ? qs.slice(1) : qs)
            : qs.toString();

    const endpoint = suffix
        ? `${API_ENDPOINTS.IMDG_COUNT}?${suffix}`
        : API_ENDPOINTS.IMDG_COUNT;

    return APIRequest('GET', endpoint);
}