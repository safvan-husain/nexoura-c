import { NextResponse } from 'next/server';
import { revokeStorefrontSession, getStorefrontSessionId } from '@/lib/storefront-session';
import { catchError } from '@/lib/errors/app-error';

export async function POST() {
    try {
        const sessionId = await getStorefrontSessionId();
        await revokeStorefrontSession(sessionId || undefined);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        const result = catchError(err);
        return NextResponse.json(result.body, { status: result.status });
    }
}
