import 'reflect-metadata';
import * as typegoose from '@typegoose/typegoose';
import * as UserModel from '../../auth/user.model';

// Subdocument for wishlist items
export class WishlistItem {
    @typegoose.prop({ required: true, type: String })
    public productId!: string;

    @typegoose.prop({ type: () => [String], default: [] })
    public selectedVariantItemIds!: string[];

    @typegoose.prop({ default: () => new Date(), type: Date })
    public createdAt!: Date;
}

@typegoose.modelOptions({
    schemaOptions: {
        timestamps: true,
        collection: 'wishlists'
    }
})
@typegoose.index({ sessionId: 1 }, { unique: true, sparse: true })
@typegoose.index({ userId: 1 }, { unique: true, sparse: true })
export class Wishlist {
    @typegoose.prop({ index: true, type: String })
    public sessionId?: string;

    @typegoose.prop({ ref: () => UserModel.User, index: true, type: typegoose.mongoose.Schema.Types.ObjectId })
    public userId?: typegoose.Ref<UserModel.User>;

    @typegoose.prop({ type: () => [WishlistItem], default: [] })
    public items!: WishlistItem[];

    public createdAt!: Date;
    public updatedAt!: Date;
}

if (!(global as any).WishlistModel) {
    (global as any).WishlistModel = typegoose.getModelForClass(Wishlist);
}
export const WishlistModel = (global as any).WishlistModel;

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

export function toWishlist(doc: typegoose.DocumentType<Wishlist>): WishlistPlain {
    const wishlist: WishlistPlain = {
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
