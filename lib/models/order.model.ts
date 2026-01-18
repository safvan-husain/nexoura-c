import { Schema, model, models, Document, Types } from 'mongoose';
import { BillingDetails } from '@/lib/order/billing-details.schema';

export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'failed' | 'completed';

export interface OrderItemDocument {
    productId: Types.ObjectId;
    productName: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
    selectedOptions?: Record<string, string>;
}

export interface OrderDocument extends Document {
    sessionId: string;
    userId?: Types.ObjectId;
    items: OrderItemDocument[];
    totalAmount: number;
    currency: string;
    status: OrderStatus;
    stripeSessionId?: string;
    billingDetails?: BillingDetails;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItemDocument>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    productImage: String,
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    selectedOptions: Schema.Types.Mixed,
}, { _id: false });

const OrderSchema = new Schema<OrderDocument>(
    {
        sessionId: { type: String, required: true, index: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        items: [OrderItemSchema],
        totalAmount: { type: Number, required: true },
        currency: { type: String, required: true, default: 'usd' },
        status: {
            type: String,
            enum: ['pending', 'paid', 'cancelled', 'failed', 'completed'],
            default: 'pending',
            index: true
        },
        stripeSessionId: { type: String, unique: true, sparse: true, index: true },
        billingDetails: {
            email: String,
            firstName: String,
            lastName: String,
            country: String,
            streetAddress: String,
            city: String,
            state: String,
            phone: String,
            zip: String,
            orderNotes: String,
        },
    },
    {
        timestamps: true,
    }
);

export const OrderModel = models.Order || model<OrderDocument>('Order', OrderSchema);

export interface OrderItem {
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
    selectedOptions?: Record<string, string>;
    productSlug?: string;
    currentPrice?: number;
}

export interface Order {
    id: string;
    sessionId: string;
    userId?: string;
    items: OrderItem[];
    totalAmount: number;
    currency: string;
    status: OrderStatus;
    stripeSessionId?: string;
    billingDetails?: BillingDetails;
    createdAt: string;
    updatedAt: string;
}

export function toOrder(doc: OrderDocument): Order {
    const order: Order = {
        id: (doc._id as any).toString(),
        sessionId: doc.sessionId,
        userId: doc.userId?.toString(),
        items: doc.items.map(item => ({
            productId: item.productId.toString(),
            productName: item.productName,
            productImage: item.productImage,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            selectedOptions: item.selectedOptions,
            productSlug: (item.productId as any).slug,
            currentPrice: (item.productId as any).price,
        })),
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
