import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStorefrontSession } from '@/lib/storefront-session/storefront-session.service';
import { createOrder } from '@/lib/order/order.service';
import { catchError, AppError } from '@/lib/errors/app-error';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any, // Match a stable version or use default
});

export async function POST(req: NextRequest) {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new AppError('STRIPE_KEY_MISSING', 500, { message: 'Stripe secret key is not configured' });
        }

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

        // 1. Create PENDING order
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
            status: 'pending' as const,
            billingDetails: session.billingDetails,
        };

        const order = await createOrder(orderData);

        // 2. Create Stripe Checkout Session
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.productName,
                        images: item.productImage ? [item.productImage] : [],
                    },
                    unit_amount: Math.round(item.unitPrice * 100),
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout/cancel`,
            client_reference_id: order.id,
            metadata: {
                orderId: order.id,
                sessionId: session.sessionId,
            },
        });

        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        const { status, body } = catchError(error);
        return NextResponse.json(body, { status });
    }
}
