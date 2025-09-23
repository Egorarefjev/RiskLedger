export function encodeJsonBase64Url(value: unknown): string {
    const json = JSON.stringify(value);

    const b64 =
        typeof window !== 'undefined' && typeof window.btoa === 'function'
            ? window.btoa(unescape(encodeURIComponent(json)))
            : Buffer.from(json, 'utf8').toString('base64');

    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
