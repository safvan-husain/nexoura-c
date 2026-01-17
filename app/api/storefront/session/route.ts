import { NextRequest, NextResponse } from 'next/server';
import {
    handleEnsureSession,
    handleGetSession,
    handleRevokeSession,
} from '@/lib/storefront-session/storefront-session.controller';

export async function GET() {
    const result = await handleGetSession();
    return NextResponse.json(result.body, { status: result.status });
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const result = await handleEnsureSession(body);
    return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE() {
    const result = await handleRevokeSession();
    return NextResponse.json(result.body, { status: result.status });
}
