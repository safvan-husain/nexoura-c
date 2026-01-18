import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import type { BillingDetails } from '@/lib/order/billing-details.schema';

// Subdocument interface for session metadata
export interface IStorefrontSessionMetadata {
    userAgent?: string;
    ipHash?: string;
}

// StorefrontSession document interface
export interface IStorefrontSession extends Document {
    _id: Types.ObjectId;
    sessionId: string;
    status: 'active' | 'revoked';
    userId?: Types.ObjectId;
    expiresAt: Date;
    lastActiveAt: Date;
    metadata?: IStorefrontSessionMetadata;
    billingDetails?: BillingDetails;
    createdAt: Date;
    updatedAt: Date;
}

// Subdocument schema for session metadata
const StorefrontSessionMetadataSchema = new Schema<IStorefrontSessionMetadata>({
    userAgent: { type: String },
    ipHash: { type: String }
}, { _id: false });

// StorefrontSession schema
const StorefrontSessionSchema = new Schema<IStorefrontSession>({
    sessionId: { type: String, required: true, unique: true },
    status: {
        type: String,
        enum: ['active', 'revoked'],
        default: 'active'
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    lastActiveAt: { type: Date, required: true },
    metadata: { type: StorefrontSessionMetadataSchema },
    billingDetails: { type: Schema.Types.Mixed }
}, {
    timestamps: true,
    collection: 'storefrontsessions'
});

// Model
let StorefrontSessionModel: Model<IStorefrontSession>;

if (!(global as any).StorefrontSessionModel) {
    StorefrontSessionModel = mongoose.model<IStorefrontSession>('StorefrontSession', StorefrontSessionSchema);
    (global as any).StorefrontSessionModel = StorefrontSessionModel;
} else {
    StorefrontSessionModel = (global as any).StorefrontSessionModel;
}

export { StorefrontSessionModel };

// Plain object interfaces for serialization
export interface StorefrontSessionMetadataPlain {
    userAgent?: string;
    ipHash?: string;
}

export interface StorefrontSessionPlain {
    id: string;
    sessionId: string;
    status: 'active' | 'revoked';
    userId?: string;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
    lastActiveAt: string;
    metadata?: StorefrontSessionMetadataPlain;
    billingDetails?: BillingDetails;
}

export function toStorefrontSession(doc: IStorefrontSession): StorefrontSessionPlain {
    const session: StorefrontSessionPlain = {
        id: doc._id.toString(),
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
    metadata?: StorefrontSessionMetadataPlain
): Partial<IStorefrontSession> {
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
