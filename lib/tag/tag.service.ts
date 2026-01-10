import { TagModel } from '@/lib/models/tag.model';
import { AppError } from '@/lib/errors/app-error';
import { connectDB } from '@/lib/db/mongo-client';
import type { CreateTagInput, UpdateTagInput } from './tag.schema';

export async function createTag(data: CreateTagInput) {
    await connectDB();

    const existingTag = await TagModel.findOne({ slug: data.slug });

    if (existingTag) {
        throw new AppError('TAG_ALREADY_EXISTS', 409, {
            field: 'slug'
        });
    }

    const tag = await TagModel.create(data);

    return tag;
}

export async function getTags() {
    await connectDB();
    return await TagModel.find().sort({ name: 1 }).lean();
}

export async function getTagById(id: string) {
    await connectDB();

    const tag = await TagModel.findById(id).lean();

    if (!tag) {
        throw new AppError('TAG_NOT_FOUND', 404);
    }

    return tag;
}

export async function getTagBySlug(slug: string) {
    await connectDB();

    const tag = await TagModel.findOne({ slug }).lean();

    if (!tag) {
        throw new AppError('TAG_NOT_FOUND', 404);
    }

    return tag;
}

export async function updateTag(id: string, data: UpdateTagInput) {
    await connectDB();

    if (data.slug) {
        const existingTag = await TagModel.findOne({
            _id: { $ne: id },
            slug: data.slug
        });

        if (existingTag) {
            throw new AppError('TAG_ALREADY_EXISTS', 409, {
                field: 'slug'
            });
        }
    }

    const tag = await TagModel.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    );

    if (!tag) {
        throw new AppError('TAG_NOT_FOUND', 404);
    }

    return tag;
}

export async function deleteTag(id: string) {
    await connectDB();

    const tag = await TagModel.findByIdAndDelete(id);

    if (!tag) {
        throw new AppError('TAG_NOT_FOUND', 404);
    }

    return { message: 'Tag deleted successfully' };
}
