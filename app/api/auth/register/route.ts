import { NextRequest, NextResponse } from 'next/server';
import { RegisterSchema } from '@/lib/auth/auth.schema';
import { registerUser } from '@/lib/auth/auth.service';
import { bindSessionToUser, ensureStorefrontSession } from '@/lib/storefront-session';
import { mergeWishlists } from '@/lib/wishlist/wishlist.service';
import { mergeCarts } from '@/lib/cart/cart.service';
import { catchError, AppError } from '@/lib/errors/app-error';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = RegisterSchema.parse(body);

        const session = await ensureStorefrontSession();
        const sessionId = session.sessionId;

        const user = await registerUser(email, password);

        // Bind session to new user
        await bindSessionToUser(sessionId, user.id);

        // Merge guest wishlist into user account
        await mergeWishlists(sessionId, user.id);

        // Merge guest cart into user account
        await mergeCarts(sessionId, user.id);

        return NextResponse.json(user, { status: 201 });
    } catch (err) {
        const result = catchError(err);
        return NextResponse.json(result.body, {
            status: result.status,
            headers: { 'x-request-method': 'POST' }
        });
    }
}
