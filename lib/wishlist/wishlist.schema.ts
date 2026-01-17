import { z } from 'zod';

export const WishlistItemSchema = z.object({
    productId: z.string(),
    selectedVariantItemIds: z.array(z.string()).default([]),
});

export const AddToWishlistSchema = WishlistItemSchema;
export type AddToWishlistInput = z.infer<typeof AddToWishlistSchema>;

export const RemoveFromWishlistSchema = WishlistItemSchema;
export type RemoveFromWishlistInput = z.infer<typeof RemoveFromWishlistSchema>;
