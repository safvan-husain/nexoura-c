import { NextRequest, NextResponse } from 'next/server';
import { getStorefrontSession, updateSessionBillingDetails } from '@/lib/storefront-session/storefront-session.service';
import { BillingDetailsSchema } from '@/lib/order/billing-details.schema';
import { catchError } from '@/lib/errors/app-error';

export async function POST(req: NextRequest) {
    try {
        const session = await getStorefrontSession();
        if (!session) {
            return NextResponse.json({ error: 'SESSION_NOT_FOUND', message: 'No active session' }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = BillingDetailsSchema.parse(body);

        const updatedSession = await updateSessionBillingDetails(session.sessionId, validatedData);

        return NextResponse.json(updatedSession);
    } catch (error) {
        const { status, body } = catchError(error);
        return NextResponse.json(body, { status });
    }
}
