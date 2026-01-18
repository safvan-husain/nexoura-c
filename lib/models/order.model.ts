import 'reflect-metadata';
import * as typegoose from '@typegoose/typegoose';
import type { BillingDetails } from '@/lib/order/billing-details.schema';
import { Product } from './product.model';
import * as UserModel from '../auth/user.model';

export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'failed' | 'completed';

// Subdocument for order items
export class OrderItem {
    @typegoose.prop({ ref: () => Product, required: true, type: typegoose.mongoose.Schema.Types.ObjectId })
    public productId!: typegoose.Ref<Product>;

    @typegoose.prop({ required: true, type: String })
    public productName!: string;

    @typegoose.prop({ type: String })
    public productImage?: string;

    @typegoose.prop({ required: true, min: 1, type: Number })
    public quantity!: number;

    @typegoose.prop({ required: true, type: Number })
    public unitPrice!: number;

    @typegoose.prop({ type: typegoose.mongoose.Schema.Types.Mixed })
    public selectedOptions?: Record<string, string>;
}

@typegoose.modelOptions({
    schemaOptions: {
        timestamps: true,
        collection: 'orders'
    }
})
export class Order {
    @typegoose.prop({ required: true, index: true, type: String })
    public sessionId!: string;

    @typegoose.prop({ ref: () => UserModel.User, index: true, type: typegoose.mongoose.Schema.Types.ObjectId })
    public userId?: typegoose.Ref<UserModel.User>;

    @typegoose.prop({ type: () => [OrderItem], default: [] })
    public items!: OrderItem[];

    @typegoose.prop({ required: true, type: Number })
    public totalAmount!: number;

    @typegoose.prop({ required: true, default: 'usd', type: String })
    public currency!: string;

    @typegoose.prop({
        enum: ['pending', 'paid', 'cancelled', 'failed', 'completed'],
        default: 'pending',
        index: true,
        type: String
    })
    public status!: OrderStatus;

    @typegoose.prop({ unique: true, sparse: true, index: true, type: String })
    public stripeSessionId?: string;

    @typegoose.prop({ type: () => Object })
    public billingDetails?: BillingDetails;

    public createdAt!: Date;
    public updatedAt!: Date;
}

if (!(global as any).OrderModel) {
    (global as any).OrderModel = typegoose.getModelForClass(Order);
}
export const OrderModel = (global as any).OrderModel;

// Plain object interfaces for serialization
export interface OrderItemPlain {
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
    selectedOptions?: Record<string, string>;
    productSlug?: string;
    currentPrice?: number;
}

export interface OrderPlain {
    id: string;
    sessionId: string;
    userId?: string;
    items: OrderItemPlain[];
    totalAmount: number;
    currency: string;
    status: OrderStatus;
    stripeSessionId?: string;
    billingDetails?: BillingDetails;
    createdAt: string;
    updatedAt: string;
}

export function toOrder(doc: typegoose.DocumentType<Order>): OrderPlain {
    const order: OrderPlain = {
        id: (doc._id as any).toString(),
        sessionId: doc.sessionId,
        userId: doc.userId?.toString(),
        items: doc.items.map(item => {
            // Check if productId is populated (object) or just an ObjectId
            const isPopulated = typeof item.productId === 'object' && item.productId !== null;

            return {
                productId: item.productId.toString(),
                productName: item.productName,
                productImage: item.productImage,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                selectedOptions: item.selectedOptions,
                productSlug: isPopulated ? (item.productId as any).slug : undefined,
                currentPrice: isPopulated ? (item.productId as any).price : undefined,
            };
        }),
        totalAmount: doc.totalAmount,
        currency: doc.currency,
        status: doc.status,
        stripeSessionId: doc.stripeSessionId,
        billingDetails: doc.billingDetails,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
    };

    return JSON.parse(JSON.stringify(order));
}
