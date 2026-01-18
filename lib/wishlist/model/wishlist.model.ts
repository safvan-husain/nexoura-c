import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// Subdocument interface for wishlist items
export interface IWishlistItem {
    productId: string;
    selectedVariantItemIds: string[];
    createdAt: Date;
}

// Wishlist document interface
export interface IWishlist extends Document {
    _id: Types.ObjectId;
    sessionId?: string;
    userId?: Types.ObjectId;
    items: IWishlistItem[];
    createdAt: Date;
    updatedAt: Date;
}

// Subdocument schema for wishlist items
const WishlistItemSchema = new Schema<IWishlistItem>({
    productId: { type: String, required: true },
    selectedVariantItemIds: { type: [String], default: [] },
    createdAt: { type: Date, default: () => new Date() }
}, { _id: false });

// Wishlist schema
const WishlistSchema = new Schema<IWishlist>({
    sessionId: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: { type: [WishlistItemSchema], default: [] }
}, {
    timestamps: true,
    collection: 'wishlists'
});

// Indexes
WishlistSchema.index({ sessionId: 1 }, { unique: true, sparse: true });
WishlistSchema.index({ userId: 1 }, { unique: true, sparse: true });

// Model
let WishlistModel: Model<IWishlist>;

if (!(global as any).WishlistModel) {
    WishlistModel = mongoose.model<IWishlist>('Wishlist', WishlistSchema);
    (global as any).WishlistModel = WishlistModel;
} else {
    WishlistModel = (global as any).WishlistModel;
}

export { WishlistModel };

// Plain object interfaces for serialization
export interface WishlistItemPlain {
    productId: string;
    selectedVariantItemIds: string[];
    createdAt: string;
}

export interface WishlistPlain {
    id: string;
    sessionId?: string;
    userId?: string;
    items: WishlistItemPlain[];
    createdAt: string;
    updatedAt: string;
}

export function toWishlist(doc: IWishlist): WishlistPlain {
    // Defensive check: ensure items is an array (can be undefined in production)
    const items = Array.isArray(doc.items) ? doc.items : [];

    const wishlist: WishlistPlain = {
        id: doc._id.toString(),
        sessionId: doc.sessionId,
        userId: doc.userId?.toString(),
        items: items.map((item: IWishlistItem) => ({
            productId: item.productId,
            selectedVariantItemIds: item.selectedVariantItemIds || [],
            createdAt: item.createdAt.toISOString(),
        })),
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
    };

    return JSON.parse(JSON.stringify(wishlist));
}
