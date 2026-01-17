import { Schema, model, models, Document, Types } from 'mongoose';

export interface WishlistItemDocument {
    productId: string;
    selectedVariantItemIds: string[];
    createdAt: Date;
}

export interface WishlistDocument extends Document {
    sessionId?: string;
    userId?: Types.ObjectId;
    items: WishlistItemDocument[];
    createdAt: Date;
    updatedAt: Date;
}

const WishlistItemSchema = new Schema<WishlistItemDocument>(
    {
        productId: { type: String, required: true },
        selectedVariantItemIds: { type: [String], default: [] },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const WishlistSchema = new Schema<WishlistDocument>(
    {
        sessionId: { type: String, index: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        items: [WishlistItemSchema],
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure one wishlist per session/user
WishlistSchema.index({ sessionId: 1 }, { unique: true, sparse: true });
WishlistSchema.index({ userId: 1 }, { unique: true, sparse: true });

export const WishlistModel = models.Wishlist || model<WishlistDocument>('Wishlist', WishlistSchema);

export interface WishlistItem {
    productId: string;
    selectedVariantItemIds: string[];
    createdAt: string;
}

export interface Wishlist {
    id: string;
    sessionId?: string;
    userId?: string;
    items: WishlistItem[];
    createdAt: string;
    updatedAt: string;
}

export function toWishlist(doc: WishlistDocument): Wishlist {
    const wishlist: Wishlist = {
        id: (doc._id as any).toString(),
        sessionId: doc.sessionId,
        userId: doc.userId?.toString(),
        items: doc.items.map(item => ({
            productId: item.productId,
            selectedVariantItemIds: item.selectedVariantItemIds,
            createdAt: item.createdAt.toISOString(),
        })),
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
    };

    return JSON.parse(JSON.stringify(wishlist));
}
