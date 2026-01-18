import 'server-only';

import { connectDB } from '@/lib/db/mongo-client';
import { AppError } from '@/lib/errors/app-error';
import { getStorefrontSession } from '@/lib/storefront-session';
import { StorefrontSessionPlain } from '@/lib/storefront-session/model/storefront-session.model';
import {
    Cart,
    CartModel,
    CartPlain,
    CartItem,
    toCart,
} from './model/cart.model';
import { AddToCartInput, RemoveFromCartInput, UpdateCartItemQuantityInput } from './cart.schema';
import { Types } from 'mongoose';
import { ProductModel } from '@/lib/models/product.model';
import { DocumentType } from '@typegoose/typegoose';

async function populateCart(cart: CartPlain): Promise<CartPlain> {
    // Defensive check: ensure items is an array
    if (!Array.isArray(cart.items)) {
        cart.items = [];
    }

    const productIds = cart.items.map(item => item.productId);
    if (productIds.length === 0) return cart;

    try {
        const products = await ProductModel.find({ _id: { $in: productIds } })
            .select('name slug price images')
            .lean();

        const productMap = new Map(products.map((p: any) => [p._id.toString(), p]));

        cart.items = cart.items.map(item => {
            const product: any = productMap.get(item.productId);
            if (product) {
                return {
                    ...item,
                    product: {
                        _id: product._id.toString(),
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        images: product.images?.map((img: any) => ({ url: img.url, alt: img.alt })) || []
                    }
                };
            }
            return item;
        });
    } catch (error) {
        console.error('Failed to populate cart products:', error);
        const message = error instanceof Error ? error.message : 'Failed to populate cart products';
        throw new AppError(message, 500, error);
    }

    return cart;
}

function normalizeVariantItemIds(ids: string[]): string[] {
    const unique = Array.from(new Set(ids.filter(Boolean)));
    unique.sort();
    return unique;
}

export async function getCart(session: StorefrontSessionPlain): Promise<CartPlain | null> {
    await connectDB();
    let cart: CartPlain | null = null;
    if (session.userId) {
        const userCart = await CartModel.findOne({ userId: session.userId });
        if (userCart) {
            cart = toCart(userCart);
        }
    }

    if (!cart) {
        const doc = await CartModel.findOne({ sessionId: session.sessionId });
        cart = doc ? toCart(doc) : null;
    }

    return cart ? populateCart(cart) : null;
}

async function getOrCreateCartDocument(session: StorefrontSessionPlain): Promise<DocumentType<Cart>> {
    await connectDB();
    if (session.userId) {
        const userCart = await CartModel.findOne({ userId: session.userId });
        if (userCart) return userCart;
    }

    const existing = await CartModel.findOne({ sessionId: session.sessionId });
    if (existing) {
        return existing;
    }

    const doc = await CartModel.create({
        sessionId: session.sessionId,
        userId: session.userId ? session.userId : undefined,
        items: [],
    });
    return doc;
}

export async function addItemToCart(params: AddToCartInput & { session: StorefrontSessionPlain }): Promise<CartPlain> {
    const { session, productId, selectedVariantItemIds: inputVariantIds, quantity = 1 } = params;
    const selectedVariantItemIds = normalizeVariantItemIds(inputVariantIds || []);

    const doc = await getOrCreateCartDocument(session);

    const existingIndex = doc.items.findIndex((item: CartItem) => {
        if (item.productId !== productId) return false;
        const normalizedExisting = normalizeVariantItemIds(item.selectedVariantItemIds || []);
        if (normalizedExisting.length !== selectedVariantItemIds.length) return false;
        return normalizedExisting.every((id, index) => id === selectedVariantItemIds[index]);
    });

    if (existingIndex === -1) {
        doc.items.push({
            productId,
            selectedVariantItemIds,
            quantity,
            createdAt: new Date(),
        });
    } else {
        doc.items[existingIndex].quantity += quantity;
    }

    await doc.save();
    return populateCart(toCart(doc));
}


export async function updateCartItemQuantity(params: UpdateCartItemQuantityInput & { session: StorefrontSessionPlain }): Promise<CartPlain> {
    const { session, productId, selectedVariantItemIds: inputVariantIds, quantity } = params;
    const selectedVariantItemIds = normalizeVariantItemIds(inputVariantIds || []);

    const doc = await getOrCreateCartDocument(session);

    const existingIndex = doc.items.findIndex((item: CartItem) => {
        if (item.productId !== productId) return false;
        const normalizedExisting = normalizeVariantItemIds(item.selectedVariantItemIds || []);
        if (normalizedExisting.length !== selectedVariantItemIds.length) return false;
        return normalizedExisting.every((id, index) => id === selectedVariantItemIds[index]);
    });

    if (existingIndex !== -1) {
        doc.items[existingIndex].quantity = quantity;
        await doc.save();
    }

    return populateCart(toCart(doc));
}


export async function removeItemFromCart(params: RemoveFromCartInput & { session: StorefrontSessionPlain }): Promise<CartPlain> {
    const { session, productId, selectedVariantItemIds: inputVariantIds } = params;
    const selectedVariantItemIds = normalizeVariantItemIds(inputVariantIds || []);

    const doc = await getOrCreateCartDocument(session);

    doc.items = (doc.items as any).filter((item: CartItem) => {
        if (item.productId !== productId) return true;
        const normalizedExisting = normalizeVariantItemIds(item.selectedVariantItemIds || []);
        const isSame =
            normalizedExisting.length === selectedVariantItemIds.length &&
            normalizedExisting.every((id, index) => id === selectedVariantItemIds[index]);
        return !isSame;
    });

    await doc.save();
    return populateCart(toCart(doc));
}

export async function clearCart(session: StorefrontSessionPlain): Promise<CartPlain> {
    const doc = await getOrCreateCartDocument(session);
    doc.items = [];
    await doc.save();
    return populateCart(toCart(doc));
}


export async function mergeCarts(sessionId: string, userId: string): Promise<CartPlain> {
    await connectDB();

    const session = await CartModel.db.startSession();
    try {
        let result: CartPlain | null = null;
        await session.withTransaction(async () => {
            // 1. Find the guest cart
            const guestCart = await CartModel.findOne({ sessionId }).session(session);

            // 2. Find the user's existing cart
            let userCart = await CartModel.findOne({ userId }).session(session);

            // Case A: No guest cart to merge
            if (!guestCart) {
                if (!userCart) {
                    userCart = (await CartModel.create([{ userId, items: [] }], { session }))[0];
                }
                result = toCart(userCart);
                return;
            }

            // Case B: No user cart yet, convert guest cart to user cart
            if (!userCart) {
                const updatedGuestCart = await CartModel.findOneAndUpdate(
                    { _id: guestCart._id },
                    {
                        $set: { userId },
                        $unset: { sessionId: "" }
                    },
                    { new: true, session }
                );

                if (updatedGuestCart) {
                    result = toCart(updatedGuestCart);
                    return;
                }

                // Fallback if convert failed (unlikely in transaction)
                userCart = (await CartModel.create([{ userId, items: [] }], { session }))[0];
            }

            // Case C: Both exist, merge them
            // Defensive check: ensure items arrays exist
            const userItems = Array.isArray(userCart.items) ? userCart.items : [];
            const guestItems = Array.isArray(guestCart.items) ? guestCart.items : [];

            const mergedItems = userItems.map((item: CartItem) => ({
                productId: item.productId,
                selectedVariantItemIds: [...(item.selectedVariantItemIds || [])],
                quantity: item.quantity,
                createdAt: item.createdAt,
            }));

            for (const guestItem of guestItems) {
                const existingIndex = mergedItems.findIndex((i: any) =>
                    i.productId === guestItem.productId &&
                    normalizeVariantItemIds(i.selectedVariantItemIds).join(',') === normalizeVariantItemIds(guestItem.selectedVariantItemIds || []).join(',')
                );

                if (existingIndex === -1) {
                    mergedItems.push({
                        productId: guestItem.productId,
                        selectedVariantItemIds: [...(guestItem.selectedVariantItemIds || [])],
                        quantity: guestItem.quantity,
                        createdAt: guestItem.createdAt,
                    });
                } else {
                    mergedItems[existingIndex].quantity += guestItem.quantity;
                }
            }


            await CartModel.updateOne(
                { _id: userCart._id },
                { $set: { items: mergedItems } },
                { session }
            );

            await CartModel.deleteOne({ _id: guestCart._id }, { session });

            const finalUserCart = await CartModel.findOne({ userId }).session(session);
            if (!finalUserCart) {
                throw new AppError('Failed to retrieve merged cart', 500);
            }
            result = toCart(finalUserCart);
        });

        if (!result) {
            throw new AppError('Merge operation failed', 500);
        }
        return populateCart(result);
    } catch (error) {
        console.error('Merge cart error:', error);
        throw error;
    } finally {
        await session.endSession();
    }
}

export async function getCartForCurrentSession(): Promise<CartPlain | null> {
    const session = await getStorefrontSession();
    if (!session) {
        return null;
    }
    return getCart(session);
}
