import 'server-only';
import { OrderModel, OrderDocument, Order, toOrder, OrderStatus } from '@/lib/models/order.model';
import { CreateOrderInput } from './order.schema';
import { AppError } from '@/lib/errors/app-error';
import { connectDB } from '@/lib/db/mongo-client';

export async function createOrder(data: CreateOrderInput): Promise<Order> {
    await connectDB();

    const doc = new OrderModel(data);
    await doc.save();

    return toOrder(doc);
}

export async function getOrderById(id: string): Promise<Order | null> {
    await connectDB();
    const doc = await OrderModel.findById(id);
    return doc ? toOrder(doc) : null;
}

export async function getOrderByStripeSessionId(stripeSessionId: string): Promise<Order | null> {
    await connectDB();
    const doc = await OrderModel.findOne({ stripeSessionId });
    return doc ? toOrder(doc) : null;
}

export async function updateOrderStatus(id: string, status: OrderStatus, stripeSessionId?: string): Promise<Order> {
    await connectDB();

    const update: any = { status };
    if (stripeSessionId) {
        update.stripeSessionId = stripeSessionId;
    }

    const doc = await OrderModel.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true }
    );

    if (!doc) {
        throw new AppError('ORDER_NOT_FOUND', 404, { id });
    }

    return toOrder(doc);
}

export async function listOrders(params: {
    userId?: string;
    sessionId?: string;
    status?: OrderStatus;
    page?: number;
    limit?: number;
}): Promise<{ orders: Order[]; total: number }> {
    await connectDB();

    const query: any = {};
    if (params.userId) query.userId = params.userId;
    if (params.sessionId) query.sessionId = params.sessionId;
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
