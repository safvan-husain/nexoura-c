import { z } from 'zod';

export const StorefrontSessionMetadataSchema = z.object({
    userAgent: z.string().optional(),
    ipAddress: z.string().optional(),
});

export type StorefrontSessionMetadataInput = z.infer<typeof StorefrontSessionMetadataSchema>;

export const EnsureStorefrontSessionSchema = z.object({
    metadata: StorefrontSessionMetadataSchema.optional(),
});

export type EnsureStorefrontSessionInput = z.infer<typeof EnsureStorefrontSessionSchema>;

export const StorefrontSessionSchema = z.object({
    id: z.string(),
    sessionId: z.string(),
    status: z.enum(['active', 'revoked']),
    userId: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    expiresAt: z.string(),
    lastActiveAt: z.string(),
    metadata: z.object({
        userAgent: z.string().optional(),
        ipHash: z.string().optional(),
    }).optional(),
});

export type StorefrontSessionResponse = z.infer<typeof StorefrontSessionSchema>;
