/**
 * Безопасное Base64: работает и в браузере (btoa), и в SSR/Node (globalThis.Buffer).
 * Корректно кодирует нелатинские символы.
 */
export function toBase64(input: string): string {
    if (typeof input !== 'string') {
        throw new Error('toBase64: expected string');
    }

    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
        // encodeURIComponent + unescape — чтобы не сломаться на UTF-8
        return window.btoa(unescape(encodeURIComponent(input)));
    }

    const Buf = (globalThis as any).Buffer;
    if (Buf?.from) {
        return Buf.from(input, 'utf8').toString('base64');
    }

    throw new Error('toBase64: no encoder available in this environment');
}

export function toBase64Url(input: string): string {
    return toBase64(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
