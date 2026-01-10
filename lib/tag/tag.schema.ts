import { z } from 'zod';

export const CreateTagSchema = z.object({
    name: z.string().min(1, 'Tag name is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
    description: z.string().optional(),
});

export const UpdateTagSchema = CreateTagSchema.partial();

export type CreateTagInput = z.infer<typeof CreateTagSchema>;
export type UpdateTagInput = z.infer<typeof UpdateTagSchema>;
