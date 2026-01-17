import { NextRequest, NextResponse } from 'next/server';
import { LoginSchema } from '@/lib/auth/auth.schema';
import { loginUser } from '@/lib/auth/auth.service';
import { bindSessionToUser, getStorefrontSessionId } from '@/lib/storefront-session';
import { mergeWishlists } from '@/lib/wishlist/wishlist.service';
import { catchError, AppError } from '@/lib/errors/app-error';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = LoginSchema.parse(body);

        const sessionId = await getStorefrontSessionId();
        if (!sessionId) {
            throw new AppError('SESSION_REQUIRED', 400);
        }

        const user = await loginUser(email, password);

        // Bind session to user
        await bindSessionToUser(sessionId, user.id);

        // Merge guest wishlist into user account
        await mergeWishlists(sessionId, user.id);

        return NextResponse.json(user, { status: 200 });
    } catch (err) {
        const result = catchError(err);
        return NextResponse.json(result.body, { status: result.status });
    }
}
