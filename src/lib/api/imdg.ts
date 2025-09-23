import { API_ENDPOINTS } from './endpoints';
import { APIRequest } from './index';
import type { ImdgRecord } from './models';

type Qs = string | URLSearchParams;

function toSuffix(qs: Qs = ''): string {
    if (typeof qs === 'string') return qs.startsWith('?') ? qs.slice(1) : qs;
    return qs.toString();
}

export function getIMDG(qs: Qs = ''): Promise<ImdgRecord[]> {
    const suffix = toSuffix(qs);
    const endpoint = suffix ? `${API_ENDPOINTS.IMDG}?${suffix}` : API_ENDPOINTS.IMDG;
    return APIRequest('GET', endpoint);
}

export function getIMDGCount(qs: Qs = ''): Promise<number> {
    const suffix = toSuffix(qs);
    const endpoint = suffix ? `${API_ENDPOINTS.IMDG_COUNT}?${suffix}` : API_ENDPOINTS.IMDG_COUNT;
    return APIRequest('GET', endpoint).then(res => res);
}


