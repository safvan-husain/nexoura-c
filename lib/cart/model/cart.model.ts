import 'reflect-metadata';
import * as typegoose from '@typegoose/typegoose';
import * as UserModel from '../../auth/user.model';

// Subdocument for cart items
export class CartItem {
    @typegoose.prop({ required: true, type: String })
    public productId!: string;

    @typegoose.prop({ type: () => [String], default: [] })
    public selectedVariantItemIds!: string[];

    @typegoose.prop({ required: true, min: 1, default: 1, type: Number })
    public quantity!: number;

    @typegoose.prop({ default: () => new Date(), type: Date })
    public createdAt!: Date;
}

@typegoose.modelOptions({
    schemaOptions: {
        timestamps: true,
        collection: 'carts'
    }
})
@typegoose.index({ sessionId: 1 }, { unique: true, sparse: true })
@typegoose.index({ userId: 1 }, { unique: true, sparse: true })
export class Cart {
    @typegoose.prop({ type: String })
    public sessionId?: string;

    @typegoose.prop({ ref: () => UserModel.User, type: typegoose.mongoose.Schema.Types.ObjectId })
    public userId?: typegoose.Ref<UserModel.User>;

    @typegoose.prop({ type: () => [CartItem], default: [] })
    public items!: CartItem[];

    public createdAt!: Date;
    public updatedAt!: Date;
}

if (!(global as any).CartModel) {
    (global as any).CartModel = typegoose.getModelForClass(Cart);
}
export const CartModel = (global as any).CartModel;

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

export function toCart(doc: typegoose.DocumentType<Cart>): CartPlain {
    // Defensive check: ensure items is an array (can be undefined in production)
    const items = Array.isArray(doc.items) ? doc.items : [];

    const cart: CartPlain = {
        id: (doc._id as any).toString(),
        sessionId: doc.sessionId,
        userId: doc.userId?.toString(),
        items: items.map(item => ({
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
