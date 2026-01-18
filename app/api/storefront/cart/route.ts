import { NextRequest, NextResponse } from 'next/server';
import {
    handleGetCart,
    handleAddToCart,
    handleUpdateCartItemQuantity,
    handleRemoveFromCart,
    handleClearCart,
} from '@/lib/cart/cart.controller';
import { catchError } from '@/lib/errors/app-error';

export async function GET() {
    try {
        const result = await handleGetCart();
        return NextResponse.json(result.body, { status: result.status });
    } catch (err) {
        const result = catchError(err);
        return NextResponse.json(result.body, { status: result.status });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await handleAddToCart(body);
        return NextResponse.json(result.body, { status: result.status });
    } catch (err) {
        const result = catchError(err);
        return NextResponse.json(result.body, { status: result.status });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await handleUpdateCartItemQuantity(body);
        return NextResponse.json(result.body, { status: result.status });
    } catch (err) {
        const result = catchError(err);
        return NextResponse.json(result.body, { status: result.status });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');
        const selectedVariantItemIds = searchParams.getAll('selectedVariantItemIds');

        if (productId) {
            const result = await handleRemoveFromCart({ productId, selectedVariantItemIds });
            return NextResponse.json(result.body, { status: result.status });
        } else {
            const result = await handleClearCart();
            return NextResponse.json(result.body, { status: result.status });
        }
    } catch (err) {
        const result = catchError(err);
        return NextResponse.json(result.body, { status: result.status });
    }
}
