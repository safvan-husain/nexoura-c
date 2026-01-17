import { AddToWishlistSchema, RemoveFromWishlistSchema } from './wishlist.schema';
import {
    addItemToWishlist,
    removeItemFromWishlist,
    clearWishlist,
    getWishlist,
} from './wishlist.service';
import { getStorefrontSession } from '@/lib/storefront-session';
import { catchError, AppError } from '@/lib/errors/app-error';

export async function handleGetWishlist() {
    try {
        const session = await getStorefrontSession();
        if (!session) {
            return { status: 200, body: { items: [] } };
        }
        const wishlist = await getWishlist(session);
        return { status: 200, body: wishlist || { items: [] } };
    } catch (err) {
        return catchError(err);
    }
}

export async function handleAddToWishlist(body: any) {
    try {
        const session = await getStorefrontSession();
        if (!session) {
            throw new AppError('SESSION_REQUIRED', 401);
        }
        const validated = AddToWishlistSchema.parse(body);
        const wishlist = await addItemToWishlist({ ...validated, session });
        return { status: 200, body: wishlist };
    } catch (err) {
        return catchError(err);
    }
}

export async function handleRemoveFromWishlist(body: any) {
    try {
        const session = await getStorefrontSession();
        if (!session) {
            throw new AppError('SESSION_REQUIRED', 401);
        }
        const validated = RemoveFromWishlistSchema.parse(body);
        const wishlist = await removeItemFromWishlist({ ...validated, session });
        return { status: 200, body: wishlist };
    } catch (err) {
        return catchError(err);
    }
}

export async function handleClearWishlist() {
    try {
        const session = await getStorefrontSession();
        if (!session) {
            throw new AppError('SESSION_REQUIRED', 401);
        }
        const wishlist = await clearWishlist(session);
        return { status: 200, body: wishlist };
    } catch (err) {
        return catchError(err);
    }
}
