import 'server-only';

import { connectDB } from '@/lib/db/mongo-client';
import { AppError } from '@/lib/errors/app-error';
import { getStorefrontSession } from '@/lib/storefront-session';
import { StorefrontSessionPlain } from '@/lib/storefront-session/model/storefront-session.model';
import {
    Wishlist,
    WishlistModel,
    WishlistPlain,
    WishlistItem,
    toWishlist,
} from './model/wishlist.model';
import { AddToWishlistInput, RemoveFromWishlistInput } from './wishlist.schema';
import { Types } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';

function normalizeVariantItemIds(ids: string[]): string[] {
    const unique = Array.from(new Set(ids.filter(Boolean)));
    unique.sort();
    return unique;
}

export async function getWishlist(session: StorefrontSessionPlain): Promise<WishlistPlain | null> {
    await connectDB();
    if (session.userId) {
        const userList = await WishlistModel.findOne({ userId: session.userId });
        if (userList) return toWishlist(userList);
    }
    const doc = await WishlistModel.findOne({ sessionId: session.sessionId });
    return doc ? toWishlist(doc) : null;
}

async function getOrCreateWishlistDocument(session: StorefrontSessionPlain): Promise<DocumentType<Wishlist>> {
    await connectDB();
    if (session.userId) {
        const userList = await WishlistModel.findOne({ userId: session.userId });
        if (userList) return userList;
    }

    const existing = await WishlistModel.findOne({ sessionId: session.sessionId });
    if (existing) {
        return existing;
    }

    const doc = await WishlistModel.create({
        sessionId: session.sessionId,
        userId: session.userId ? session.userId : undefined,
        items: [],
    });
    return doc;
}

export async function addItemToWishlist(params: AddToWishlistInput & { session: StorefrontSessionPlain }): Promise<WishlistPlain> {
    const { session, productId, selectedVariantItemIds: inputVariantIds } = params;
    const selectedVariantItemIds = normalizeVariantItemIds(inputVariantIds || []);

    const doc = await getOrCreateWishlistDocument(session);

    const existingIndex = doc.items.findIndex(item => {
        if (item.productId !== productId) return false;
        const normalizedExisting = normalizeVariantItemIds(item.selectedVariantItemIds || []);
        if (normalizedExisting.length !== selectedVariantItemIds.length) return false;
        return normalizedExisting.every((id, index) => id === selectedVariantItemIds[index]);
    });

    if (existingIndex === -1) {
        doc.items.push({
            productId,
            selectedVariantItemIds,
            createdAt: new Date(),
        });
    }

    await doc.save();
    return toWishlist(doc);
}

export async function removeItemFromWishlist(params: RemoveFromWishlistInput & { session: StorefrontSessionPlain }): Promise<WishlistPlain> {
    const { session, productId, selectedVariantItemIds: inputVariantIds } = params;
    const selectedVariantItemIds = normalizeVariantItemIds(inputVariantIds || []);

    const doc = await getOrCreateWishlistDocument(session);

    doc.items = (doc.items as any).filter((item: WishlistItem) => {
        if (item.productId !== productId) return true;
        const normalizedExisting = normalizeVariantItemIds(item.selectedVariantItemIds || []);
        const isSame =
            normalizedExisting.length === selectedVariantItemIds.length &&
            normalizedExisting.every((id, index) => id === selectedVariantItemIds[index]);
        return !isSame;
    });

    await doc.save();
    return toWishlist(doc);
}

export async function clearWishlist(session: StorefrontSessionPlain): Promise<WishlistPlain> {
    const doc = await getOrCreateWishlistDocument(session);
    doc.items = [];
    await doc.save();
    return toWishlist(doc);
}

export async function mergeWishlists(sessionId: string, userId: string): Promise<WishlistPlain> {
    await connectDB();
    const guestWishlist = await WishlistModel.findOne({ sessionId });
    const userWishlist = await WishlistModel.findOne({ userId });

    if (!guestWishlist) {
        if (userWishlist) return toWishlist(userWishlist);
        const doc = await WishlistModel.create({
            userId,
            items: [],
        });
        return toWishlist(doc);
    }

    if (!userWishlist) {
        guestWishlist.userId = new Types.ObjectId(userId);
        guestWishlist.sessionId = undefined; // Clear sessionId as it's now a user wishlist
        await guestWishlist.save();
        return toWishlist(guestWishlist);
    }

    // Merge items
    const mergedItems = [...userWishlist.items];

    for (const guestItem of guestWishlist.items) {
        const existingIndex = mergedItems.findIndex(i =>
            i.productId === guestItem.productId &&
            normalizeVariantItemIds(i.selectedVariantItemIds).join(',') === normalizeVariantItemIds(guestItem.selectedVariantItemIds).join(',')
        );

        if (existingIndex === -1) {
            mergedItems.push(guestItem);
        }
    }

    userWishlist.items = mergedItems;
    await userWishlist.save();

    await WishlistModel.deleteOne({ _id: guestWishlist._id });

    return toWishlist(userWishlist);
}

export async function getWishlistForCurrentSession(): Promise<WishlistPlain | null> {
    const session = await getStorefrontSession();
    if (!session) {
        return null;
    }
    return getWishlist(session);
}
