import { NextRequest, NextResponse } from 'next/server';
import { getStorefrontSession } from '@/lib/storefront-session/storefront-session.service';
import { createOrder } from '@/lib/order/order.service';
import { catchError, AppError } from '@/lib/errors/app-error';

export async function POST(req: NextRequest) {
    try {
        const session = await getStorefrontSession();
        if (!session) {
            throw new AppError('SESSION_NOT_FOUND', 401);
        }

        if (!session.billingDetails) {
            throw new AppError('BILLING_DETAILS_REQUIRED', 400, { message: 'Please provide billing details first' });
        }

        const body = await req.json();
        const { items } = body;

        if (!items || !items.length) {
            throw new AppError('ITEMS_REQUIRED', 400);
        }

        // Create pre-order (no stock validation, no payment)
        const orderData = {
            sessionId: session.sessionId,
            userId: session.userId,
            items: items.map((item: any) => ({
                productId: item.productId,
                productName: item.productName,
                productImage: item.productImage,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                selectedOptions: item.selectedOptions,
            })),
            totalAmount: items.reduce((sum: number, item: any) => sum + (item.unitPrice * item.quantity), 0),
            currency: 'usd',
            status: 'preorder' as const,
            billingDetails: session.billingDetails,
        };

        const order = await createOrder(orderData);

        return NextResponse.json({ orderId: order.id, success: true });
    } catch (error) {
        const { status, body } = catchError(error);
        return NextResponse.json(body, { status });
    }
}