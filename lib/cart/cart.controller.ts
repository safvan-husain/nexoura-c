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
    try {
        const session = await getStorefrontSession();
        if (!session) {
            throw new AppError('UNAUTHORIZED', 401);
        }
        const cart = await getCart(session);
        return { status: 200, body: cart || { items: [] } };
    } catch (error) {
        if (error instanceof AppError) {
            return { status: error.statusCode, body: { message: error.message } };
        }
        return { status: 500, body: { message: 'Internal Server Error' } };
    }
}

import { ZodError } from 'zod';

export async function handleAddToCart(data: unknown) {
    try {
        const session = await getStorefrontSession();
        if (!session) {
            throw new AppError('UNAUTHORIZED', 401);
        }
        const input = AddToCartSchema.parse(data);
        const cart = await addItemToCart({ ...input, session });
        return { status: 200, body: cart };
    } catch (error) {
        if (error instanceof ZodError) {
            return { status: 400, body: { message: 'Validation failed', errors: error.issues } };
        }
        if (error instanceof AppError) {
            return { status: error.statusCode, body: { message: error.message } };
        }
        return { status: 500, body: { message: 'Internal Server Error' } };
    }
}

export async function handleUpdateCartItemQuantity(data: any) {
    try {
        const session = await getStorefrontSession();
        if (!session) {
            throw new AppError('UNAUTHORIZED', 401);
        }
        const input = UpdateCartItemQuantitySchema.parse(data);
        const cart = await updateCartItemQuantity({ ...input, session });
        return { status: 200, body: cart };
    } catch (error) {
        if (error instanceof ZodError) {
            return { status: 400, body: { message: 'Validation failed', errors: error.issues } };
        }
        if (error instanceof AppError) {
            return { status: error.statusCode, body: { message: error.message } };
        }
        return { status: 500, body: { message: 'Internal Server Error' } };
    }
}

export async function handleRemoveFromCart(data: any) {
    try {
        const session = await getStorefrontSession();
        if (!session) {
            throw new AppError('UNAUTHORIZED', 401);
        }
        const input = RemoveFromCartSchema.parse(data);
        const cart = await removeItemFromCart({ ...input, session });
        return { status: 200, body: cart };
    } catch (error) {
        if (error instanceof ZodError) {
            return { status: 400, body: { message: 'Validation failed', errors: error.issues } };
        }
        if (error instanceof AppError) {
            return { status: error.statusCode, body: { message: error.message } };
        }
        return { status: 500, body: { message: 'Internal Server Error' } };
    }
}

export async function handleClearCart() {
    try {
        const session = await getStorefrontSession();
        if (!session) {
            throw new AppError('UNAUTHORIZED', 401);
        }
        const cart = await clearCart(session);
        return { status: 200, body: cart };
    } catch (error) {
        if (error instanceof AppError) {
            return { status: error.statusCode, body: { message: error.message } };
        }
        return { status: 500, body: { message: 'Internal Server Error' } };
    }
}
