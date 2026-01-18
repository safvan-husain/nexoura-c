import 'server-only';
import { OrderModel, Order, toOrder, OrderStatus, OrderItem, OrderPlain } from '@/lib/models/order.model';
import { CreateOrderInput } from './order.schema';
import { AppError } from '@/lib/errors/app-error';
import { connectDB } from '@/lib/db/mongo-client';
import { decrementStock } from '@/lib/product/product.service';
import { DocumentType } from '@typegoose/typegoose';

export async function createOrder(data: CreateOrderInput): Promise<OrderPlain> {
    await connectDB();

    const doc = new OrderModel(data);
    await doc.save();

    return toOrder(doc);
}

export async function getOrderById(id: string): Promise<OrderPlain | null> {
    await connectDB();
    const doc = await OrderModel.findById(id).populate({
        path: 'items.productId',
        select: 'slug price name images'
    });
    return doc ? toOrder(doc) : null;
}

export async function getOrderByStripeSessionId(stripeSessionId: string): Promise<OrderPlain | null> {
    await connectDB();
    const doc = await OrderModel.findOne({ stripeSessionId });
    return doc ? toOrder(doc) : null;
}

export async function updateOrderStatus(id: string, status: OrderStatus, stripeSessionId?: string): Promise<OrderPlain> {
    await connectDB();

    const order = await OrderModel.findById(id);

    if (!order) {
        throw new AppError('ORDER_NOT_FOUND', 404, { id });
    }

    // Check if we are transitioning to PAID for the first time
    if (status === 'paid' && order.status !== 'paid') {
        console.log(`[OrderService] Order ${id} paid. Decrementing stock.`);
        await decrementStock(order.items.map((item: OrderItem) => ({
            productId: item.productId.toString(),
            quantity: item.quantity
        })));
    }

    order.status = status;
    if (stripeSessionId) {
        order.stripeSessionId = stripeSessionId;
    }

    await order.save();

    return toOrder(order);
}

export async function listOrders(params: {
    userId?: string;
    sessionId?: string;
    status?: OrderStatus;
    page?: number;
    limit?: number;
}): Promise<{ orders: OrderPlain[]; total: number }> {
    await connectDB();

    const query: any = {};
    // if userId is present, query for user orders else query for session orders
    if (params.userId) {
        query.userId = params.userId;
    } else if (params.sessionId) {
        query.sessionId = params.sessionId;
    }
    if (params.status) query.status = params.status;

    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
        OrderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        OrderModel.countDocuments(query),
    ]);

    return {
        orders: docs.map(toOrder),
        total,
    };
}
