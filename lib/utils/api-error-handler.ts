// lib/utils/api-error-handler.ts

export class HandledApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'HandledApiError';
    }
}

export interface ApiErrorDetails {
    status: number;
    body: any;
    url: string;
    method: string;
}

/**
 * Normalizes and displays API errors in a toast.
 * Used in client-side components when a fetch request fails.
 */
export async function handleApiError(
    response: Response,
    showToast: (message: string, type: 'error', details?: any) => void
): Promise<never> {
    let body;
    try {
        body = await response.json();
    } catch {
        body = { error: 'Failed to parse error response' };
    }

    const details: ApiErrorDetails = {
        status: response.status,
        body,
        url: response.url,
        method: response.headers.get('x-request-method') || 'UNKNOWN',
    };

    const message = body.message || body.error || `Request failed with status ${response.status}`;

    console.log('[handleApiError] Details:', details);

    showToast(message, 'error', details);

    throw new HandledApiError(message);
}
