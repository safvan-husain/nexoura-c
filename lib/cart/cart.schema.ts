import { z } from 'zod';

export const AddToCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    selectedVariantItemIds: z.array(z.string()).optional(),
    quantity: z.number().int('Quantity must be a whole number').min(1, 'Quantity must be at least 1').default(1),
});

export const UpdateCartItemQuantitySchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    selectedVariantItemIds: z.array(z.string()).optional(),
    quantity: z.number().int('Quantity must be a whole number').min(1, 'Quantity must be at least 1'),
});

export const RemoveFromCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    selectedVariantItemIds: z.array(z.string()).optional(),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemQuantityInput = z.infer<typeof UpdateCartItemQuantitySchema>;
export type RemoveFromCartInput = z.infer<typeof RemoveFromCartSchema>;
