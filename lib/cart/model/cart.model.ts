import { Schema, model, models, Document, Types } from 'mongoose';

export interface CartItemDocument {
    productId: string;
    selectedVariantItemIds: string[];
    quantity: number;
    createdAt: Date;
}

export interface CartDocument extends Document {
    sessionId?: string;
    userId?: Types.ObjectId;
    items: CartItemDocument[];
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema = new Schema<CartItemDocument>(
    {
        productId: { type: String, required: true },
        selectedVariantItemIds: { type: [String], default: [] },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const CartSchema = new Schema<CartDocument>(
    {
        sessionId: { type: String },
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        items: [CartItemSchema],
    },
    {
        timestamps: true,
    }
);

// Unique sparse indexes to ensure one cart per session and one cart per user
CartSchema.index({ sessionId: 1 }, { unique: true, sparse: true });
CartSchema.index({ userId: 1 }, { unique: true, sparse: true });

export const CartModel = models.Cart || model<CartDocument>('Cart', CartSchema);

export interface CartItem {
    productId: string;
    selectedVariantItemIds: string[];
    quantity: number;
    createdAt: string;
}

export interface Cart {
    id: string;
    sessionId?: string;
    userId?: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export function toCart(doc: CartDocument): Cart {
    const cart: Cart = {
        id: (doc._id as any).toString(),
        sessionId: doc.sessionId,
        userId: doc.userId?.toString(),
        items: doc.items.map(item => ({
            productId: item.productId,
            selectedVariantItemIds: item.selectedVariantItemIds,
            quantity: item.quantity,
            createdAt: item.createdAt.toISOString(),
        })),
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
    };

    return JSON.parse(JSON.stringify(cart));
}
