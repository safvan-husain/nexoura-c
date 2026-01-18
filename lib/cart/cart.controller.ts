import 'server-only';

import { getStorefrontSession } from '@/lib/storefront-session';
import { AppError } from '@/lib/errors/app-error';
import {
    getCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    clearCart,
} from './cart.service';
import {
    AddToCartSchema,
    UpdateCartItemQuantitySchema,
    RemoveFromCartSchema,
} from './cart.schema';

export async function handleGetCart() {
    const session = await getStorefrontSession();
    if (!session) {
        throw new AppError('UNAUTHORIZED', 401);
    }
    const cart = await getCart(session);
    return { status: 200, body: cart || { items: [] } };
}

import { ZodError } from 'zod';

export async function handleAddToCart(data: unknown) {
    const session = await getStorefrontSession();
    if (!session) {
        throw new AppError('UNAUTHORIZED', 401);
    }
    const input = AddToCartSchema.parse(data);
    const cart = await addItemToCart({ ...input, session });
    return { status: 200, body: cart };
}

export async function handleUpdateCartItemQuantity(data: any) {
    const session = await getStorefrontSession();
    if (!session) {
        throw new AppError('UNAUTHORIZED', 401);
    }
    const input = UpdateCartItemQuantitySchema.parse(data);
    const cart = await updateCartItemQuantity({ ...input, session });
    return { status: 200, body: cart };
}

export async function handleRemoveFromCart(data: any) {
    const session = await getStorefrontSession();
    if (!session) {
        throw new AppError('UNAUTHORIZED', 401);
    }
    const input = RemoveFromCartSchema.parse(data);
    const cart = await removeItemFromCart({ ...input, session });
    return { status: 200, body: cart };
}

export async function handleClearCart() {
    const session = await getStorefrontSession();
    if (!session) {
        throw new AppError('UNAUTHORIZED', 401);
    }
    const cart = await clearCart(session);
    return { status: 200, body: cart };
}
