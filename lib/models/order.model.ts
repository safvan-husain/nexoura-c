import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import type { BillingDetails } from '@/lib/order/billing-details.schema';

export type OrderStatus = 'preorder' | 'pending' | 'paid' | 'cancelled' | 'failed' | 'completed';

// Subdocument interface for order items
export interface IOrderItem {
    productId: Types.ObjectId;
    productName: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
    selectedOptions?: Record<string, string>;
}

// Order document interface
export interface IOrder extends Document {
    _id: Types.ObjectId;
    sessionId: string;
    userId?: Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    currency: string;
    status: OrderStatus;
    stripeSessionId?: string;
    billingDetails?: BillingDetails;
    createdAt: Date;
    updatedAt: Date;
}

// Subdocument schema for order items
const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    productImage: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    selectedOptions: { type: Schema.Types.Mixed }
}, { _id: false });

// Order schema
const OrderSchema = new Schema<IOrder>({
    sessionId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    items: { type: [OrderItemSchema], default: [] },
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'usd' },
    status: {
        type: String,
        enum: ['preorder', 'pending', 'paid', 'cancelled', 'failed', 'completed'],
        default: 'preorder',
        index: true
    },
    stripeSessionId: { type: String, unique: true, sparse: true, index: true },
    billingDetails: { type: Schema.Types.Mixed }
}, {
    timestamps: true,
    collection: 'orders'
});

// Model
let OrderModel: Model<IOrder>;

if (!(global as any).OrderModel) {
    OrderModel = mongoose.model<IOrder>('Order', OrderSchema);
    (global as any).OrderModel = OrderModel;
} else {
    OrderModel = (global as any).OrderModel;
}

export { OrderModel };

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

export function toOrder(doc: IOrder): OrderPlain {
    const order: OrderPlain = {
        id: doc._id.toString(),
        sessionId: doc.sessionId,
        userId: doc.userId?.toString(),
        items: doc.items.map((item: IOrderItem) => {
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
