import { z } from 'zod';

export const BillingDetailsSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    country: z.string().min(1, 'Country is required'),
    streetAddress: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    phone: z.string().min(1, 'Phone number is required'),
    zip: z.string().optional(),
    orderNotes: z.string().optional(),
});

export type BillingDetails = z.infer<typeof BillingDetailsSchema>;
