import { NextRequest, NextResponse } from 'next/server';
import {
    handleAddToWishlist,
    handleClearWishlist,
    handleGetWishlist,
    handleRemoveFromWishlist,
} from '@/lib/wishlist/wishlist.controller';

export async function GET() {
    const result = await handleGetWishlist();
    return NextResponse.json(result.body, { status: result.status });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const result = await handleAddToWishlist(body);
    return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const result = await handleRemoveFromWishlist(body);
    return NextResponse.json(result.body, { status: result.status });
}

export async function PATCH() {
    const result = await handleClearWishlist();
    return NextResponse.json(result.body, { status: result.status });
}
