import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// Subdocument interface for cart items
export interface ICartItem {
    productId: string;
    selectedVariantItemIds: string[];
    quantity: number;
    createdAt: Date;
}

// Cart document interface
export interface ICart extends Document {
    _id: Types.ObjectId;
    sessionId?: string;
    userId?: Types.ObjectId;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

// Subdocument schema for cart items
const CartItemSchema = new Schema<ICartItem>({
    productId: { type: String, required: true },
    selectedVariantItemIds: { type: [String], default: [] },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    createdAt: { type: Date, default: () => new Date() }
}, { _id: false });

// Cart schema
const CartSchema = new Schema<ICart>({
    sessionId: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: { type: [CartItemSchema], default: [] }
}, {
    timestamps: true,
    collection: 'carts'
});

// Indexes
CartSchema.index({ sessionId: 1 }, { unique: true, sparse: true });
CartSchema.index({ userId: 1 }, { unique: true, sparse: true });

// Model
let CartModel: Model<ICart>;

if (!(global as any).CartModel) {
    CartModel = mongoose.model<ICart>('Cart', CartSchema);
    (global as any).CartModel = CartModel;
} else {
    CartModel = (global as any).CartModel;
}

export { CartModel };

// Plain object interfaces for serialization
export interface CartProduct {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: { url: string; alt?: string }[];
}

export interface CartItemPlain {
    productId: string;
    product?: CartProduct;
    selectedVariantItemIds: string[];
    quantity: number;
    createdAt: string;
}

export interface CartPlain {
    id: string;
    sessionId?: string;
    userId?: string;
    items: CartItemPlain[];
    createdAt: string;
    updatedAt: string;
}

export function toCart(doc: ICart): CartPlain {
    // Defensive check: ensure items is an array (can be undefined in production)
    const items = Array.isArray(doc.items) ? doc.items : [];

    const cart: CartPlain = {
        id: doc._id.toString(),
        sessionId: doc.sessionId,
        userId: doc.userId?.toString(),
        items: items.map((item: ICartItem) => ({
            productId: item.productId,
            selectedVariantItemIds: item.selectedVariantItemIds || [],
            quantity: item.quantity,
            createdAt: item.createdAt.toISOString(),
        })),
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
    };

    return JSON.parse(JSON.stringify(cart));
}
