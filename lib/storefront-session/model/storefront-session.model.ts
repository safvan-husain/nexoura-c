import 'reflect-metadata';
import * as typegoose from '@typegoose/typegoose';
import type { BillingDetails } from '@/lib/order/billing-details.schema';
import * as UserModel from '../../auth/user.model';

// Subdocument for session metadata
export class StorefrontSessionMetadata {
    @typegoose.prop({ type: String })
    public userAgent?: string;

    @typegoose.prop({ type: String })
    public ipHash?: string;
}

@typegoose.modelOptions({
    schemaOptions: {
        timestamps: true,
        collection: 'storefrontsessions'
    }
})
export class StorefrontSession {
    @typegoose.prop({ required: true, unique: true, type: String })
    public sessionId!: string;

    @typegoose.prop({ enum: ['active', 'revoked'], default: 'active', type: String })
    public status!: 'active' | 'revoked';

    @typegoose.prop({ ref: () => UserModel.User, type: typegoose.mongoose.Schema.Types.ObjectId })
    public userId?: typegoose.Ref<UserModel.User>;

    @typegoose.prop({ required: true, index: { expires: 0 }, type: Date })
    public expiresAt!: Date;

    @typegoose.prop({ required: true, type: Date })
    public lastActiveAt!: Date;

    @typegoose.prop({ type: () => StorefrontSessionMetadata })
    public metadata?: StorefrontSessionMetadata;

    @typegoose.prop({ type: () => Object })
    public billingDetails?: BillingDetails;

    public createdAt!: Date;
    public updatedAt!: Date;
}

if (!(global as any).StorefrontSessionModel) {
    (global as any).StorefrontSessionModel = typegoose.getModelForClass(StorefrontSession);
}
export const StorefrontSessionModel = (global as any).StorefrontSessionModel;

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

export function toStorefrontSession(doc: typegoose.DocumentType<StorefrontSession>): StorefrontSessionPlain {
    const session: StorefrontSessionPlain = {
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
    metadata?: StorefrontSessionMetadataPlain
): Partial<typegoose.DocumentType<StorefrontSession>> {
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
