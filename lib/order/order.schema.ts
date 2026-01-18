import { z } from 'zod';
import { BillingDetailsSchema } from './billing-details.schema';

export const OrderItemSchema = z.object({
    productId: z.string().min(1),
    productName: z.string().min(1),
    productImage: z.string().optional(),
    quantity: z.number().int().min(1),
    unitPrice: z.number().min(0),
    selectedOptions: z.record(z.string(), z.string()).optional(),
});

export const CreateOrderSchema = z.object({
    sessionId: z.string().min(1),
    userId: z.string().optional(),
    items: z.array(OrderItemSchema).min(1),
    totalAmount: z.number().min(0),
    currency: z.string().default('usd'),
    status: z.enum(['pending', 'paid', 'cancelled', 'failed', 'completed']).default('pending'),
    billingDetails: BillingDetailsSchema.optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type OrderItemDto = z.infer<typeof OrderItemSchema>;
