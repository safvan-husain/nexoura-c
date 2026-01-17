import { Schema, model, models, Document, Types } from 'mongoose';

export interface StorefrontSessionMetadata {
    userAgent?: string;
    ipHash?: string;
}

export interface StorefrontSessionDocument extends Document {
    sessionId: string;
    status: 'active' | 'revoked';
    userId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    lastActiveAt: Date;
    metadata?: StorefrontSessionMetadata;
}

const StorefrontSessionSchema = new Schema<StorefrontSessionDocument>(
    {
        sessionId: { type: String, required: true, unique: true },
        status: { type: String, enum: ['active', 'revoked'], default: 'active' },
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        expiresAt: { type: Date, required: true, index: { expires: 0 } },
        lastActiveAt: { type: Date, required: true },
        metadata: {
            userAgent: String,
            ipHash: String,
        },
    },
    {
        timestamps: true,
    }
);

export const StorefrontSessionModel = models.StorefrontSession || model<StorefrontSessionDocument>('StorefrontSession', StorefrontSessionSchema);

export interface StorefrontSession {
    id: string;
    sessionId: string;
    status: 'active' | 'revoked';
    userId?: string;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
    lastActiveAt: string;
    metadata?: StorefrontSessionMetadata;
}

export function toStorefrontSession(doc: StorefrontSessionDocument): StorefrontSession {
    return {
        id: (doc._id as any).toString(),
        sessionId: doc.sessionId,
        status: doc.status,
        userId: doc.userId?.toString(),
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
        expiresAt: doc.expiresAt.toISOString(),
        lastActiveAt: doc.lastActiveAt.toISOString(),
        metadata: doc.metadata,
    };
}

export function buildStorefrontSessionDocument(
    sessionId: string,
    expiresAt: Date,
    metadata?: StorefrontSessionMetadata
): Partial<StorefrontSessionDocument> {
    const now = new Date();
    return {
        sessionId,
        status: 'active',
        createdAt: now,
        updatedAt: now,
        expiresAt,
        lastActiveAt: now,
        metadata,
    };
}
