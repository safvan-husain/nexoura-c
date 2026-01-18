import { Schema, model, models, Document, Types } from 'mongoose';
import { BillingDetails } from '@/lib/order/billing-details.schema';

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
    billingDetails?: BillingDetails;
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
        billingDetails: {
            email: String,
            firstName: String,
            lastName: String,
            country: String,
            streetAddress: String,
            city: String,
            state: String,
            phone: String,
            zip: String,
            orderNotes: String,
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
    billingDetails?: BillingDetails;
}

export function toStorefrontSession(doc: StorefrontSessionDocument): StorefrontSession {
    const session: StorefrontSession = {
        id: (doc._id as any).toString(),
        sessionId: doc.sessionId,
        status: doc.status,
        userId: doc.userId?.toString(),
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
        expiresAt: doc.expiresAt.toISOString(),
        lastActiveAt: doc.lastActiveAt.toISOString(),
        billingDetails: doc.billingDetails || undefined,
    };

    if (doc.metadata) {
        session.metadata = {
            userAgent: doc.metadata.userAgent || undefined,
            ipHash: doc.metadata.ipHash || undefined,
        };
    }

    // Use JSON stringify/parse to ensure absolute plainness and removal of undefined/toJSON
    return JSON.parse(JSON.stringify(session));
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
