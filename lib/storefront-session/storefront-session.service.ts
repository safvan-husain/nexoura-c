import 'server-only';
import { connection } from 'next/server';

import { createHash, randomBytes } from 'node:crypto';
import { connectDB } from '@/lib/db/mongo-client';
import { AppError } from '@/lib/errors/app-error';
import {
    StorefrontSession,
    StorefrontSessionModel,
    StorefrontSessionMetadata,
    buildStorefrontSessionDocument,
    toStorefrontSession,
} from './model/storefront-session.model';
import {
    EnsureStorefrontSessionInput,
    StorefrontSessionMetadataInput,
} from './storefront-session.schema';
import {
    getCurrentStorefrontSessionToken,
    revokeStorefrontSessionCookie,
    setStorefrontSessionCookie,
} from './session-token';

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function computeExpiry() {
    return new Date(Date.now() + SESSION_DURATION_MS);
}

function normalizeMetadata(metadata?: StorefrontSessionMetadataInput): StorefrontSessionMetadata | undefined {
    if (!metadata) {
        return undefined;
    }

    const normalized: StorefrontSessionMetadata = {};
    if (metadata.userAgent) {
        normalized.userAgent = metadata.userAgent;
    }
    if (metadata.ipAddress) {
        normalized.ipHash = createHash('sha256').update(metadata.ipAddress).digest('hex');
    }

    return Object.keys(normalized).length ? normalized : undefined;
}

async function findActiveSession(sessionId: string) {
    await connectDB();
    const doc = await StorefrontSessionModel.findOne({ sessionId });
    if (!doc) {
        throw new AppError('SESSION_NOT_FOUND', 404);
    }
    if (doc.status !== 'active') {
        throw new AppError('SESSION_REVOKED', 401);
    }
    if (doc.expiresAt.getTime() <= Date.now()) {
        await StorefrontSessionModel.updateOne(
            { sessionId },
            { $set: { status: 'revoked', updatedAt: new Date() } }
        );
        throw new AppError('SESSION_EXPIRED', 401);
    }
    return doc;
}

async function updateActivity(
    sessionId: string,
    doc: any,
    metadata?: StorefrontSessionMetadataInput
) {
    const now = new Date();
    const expiresAt = computeExpiry();
    const metadataUpdate = normalizeMetadata(metadata);

    const updateDoc: any = {
        updatedAt: now,
        lastActiveAt: now,
        expiresAt,
    };

    if (metadataUpdate) {
        updateDoc.metadata = { ...(doc.metadata ?? {}), ...metadataUpdate };
    }

    const updated = await StorefrontSessionModel.findOneAndUpdate(
        { sessionId },
        { $set: updateDoc },
        { new: true }
    );

    if (!updated) {
        throw new AppError('SESSION_UPDATE_FAILED', 500);
    }
    return updated;
}

export async function createStorefrontSession(
    sessionId: string,
    metadata?: StorefrontSessionMetadataInput,
    setCookie: boolean = false
): Promise<StorefrontSession> {
    await connectDB();
    const expiresAt = computeExpiry();
    const docData = buildStorefrontSessionDocument(sessionId, expiresAt, normalizeMetadata(metadata));

    const doc = await StorefrontSessionModel.create(docData);
    const storefrontSession = toStorefrontSession(doc);

    if (setCookie) {
        await setStorefrontSessionCookie(storefrontSession.sessionId);
    }
    return storefrontSession;
}

export async function touchStorefrontSession(
    sessionId: string,
    metadata?: StorefrontSessionMetadataInput,
    setCookie: boolean = false
): Promise<StorefrontSession> {
    const doc = await findActiveSession(sessionId);
    const updated = await updateActivity(sessionId, doc, metadata);
    const storefrontSession = toStorefrontSession(updated);

    if (setCookie) {
        await setStorefrontSessionCookie(storefrontSession.sessionId);
    }
    return storefrontSession;
}

export async function ensureStorefrontSession(
    input?: EnsureStorefrontSessionInput
): Promise<StorefrontSession> {
    await connection();
    const payload = input?.metadata;
    const token = await getCurrentStorefrontSessionToken();
    if (!token) {
        return createStorefrontSession(randomBytes(16).toString('hex'), payload, true);
    }

    try {
        return await touchStorefrontSession(token.sessionId, payload, true);
    } catch (err) {
        if (
            err instanceof AppError &&
            ['SESSION_NOT_FOUND', 'SESSION_REVOKED', 'SESSION_EXPIRED'].includes(err.message)
        ) {
            return createStorefrontSession(token.sessionId, payload, true);
        }
        throw err;
    }
}

export async function getStorefrontSession(): Promise<StorefrontSession | null> {
    await connection();
    const token = await getCurrentStorefrontSessionToken();
    if (!token) {
        return null;
    }
    try {
        const doc = await findActiveSession(token.sessionId);
        return toStorefrontSession(doc);
    } catch (err) {
        if (err instanceof AppError) {
            await revokeStorefrontSessionCookie();
            return null;
        }
        throw err;
    }
}

export async function revokeStorefrontSession(sessionId?: string) {
    await connectDB();
    let targetId = sessionId;
    if (!targetId) {
        const token = await getCurrentStorefrontSessionToken();
        targetId = token?.sessionId;
    }

    if (targetId) {
        await StorefrontSessionModel.updateOne(
            { sessionId: targetId },
            { $set: { status: 'revoked', updatedAt: new Date() } }
        );
    }

    await revokeStorefrontSessionCookie();

    return { success: Boolean(targetId) };
}

export async function getStorefrontSessionId(): Promise<string | null> {
    const token = await getCurrentStorefrontSessionToken();
    return token?.sessionId ?? null;
}

export async function getStorefrontSessionBySessionId(sessionId: string): Promise<StorefrontSession | null> {
    await connectDB();
    const doc = await StorefrontSessionModel.findOne({ sessionId });
    return doc ? toStorefrontSession(doc) : null;
}

export async function bindSessionToUser(sessionId: string, userId: string): Promise<void> {
    await connectDB();
    const result = await StorefrontSessionModel.updateOne(
        { sessionId },
        { $set: { userId: userId, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
        throw new AppError('SESSION_NOT_FOUND', 404);
    }
}

export async function unbindSession(sessionId: string): Promise<void> {
    await connectDB();
    const result = await StorefrontSessionModel.updateOne(
        { sessionId },
        {
            $unset: { userId: "" },
            $set: { updatedAt: new Date() }
        }
    );

    if (result.matchedCount === 0) {
        throw new AppError('SESSION_NOT_FOUND', 404);
    }
}
