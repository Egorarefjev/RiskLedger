import { APIRequest } from './index';
import { API_ENDPOINTS } from './endpoints';

export async function getIMDG() {
    return APIRequest('GET', API_ENDPOINTS.IMDG);
}