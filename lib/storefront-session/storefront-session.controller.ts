import { EnsureStorefrontSessionSchema } from './storefront-session.schema';
import {
    ensureStorefrontSession,
    getStorefrontSession,
    revokeStorefrontSession,
} from './storefront-session.service';
import { AppError, catchError } from '@/lib/errors/app-error';

export async function handleEnsureSession(body: any) {
    try {
        const validated = EnsureStorefrontSessionSchema.parse(body);
        const session = await ensureStorefrontSession(validated);
        return { status: 200, body: session };
    } catch (err) {
        return catchError(err);
    }
}

export async function handleGetSession() {
    try {
        const session = await getStorefrontSession();
        if (!session) {
            throw new AppError(404, 'SESSION_NOT_FOUND');
        }
        return { status: 200, body: session };
    } catch (err) {
        return catchError(err);
    }
}

export async function handleRevokeSession() {
    try {
        const result = await revokeStorefrontSession();
        return { status: 200, body: result };
    } catch (err) {
        return catchError(err);
    }
}
