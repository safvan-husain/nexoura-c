import { NextRequest, NextResponse } from 'next/server';
import * as tagService from './tag.service';
import { CreateTagSchema, UpdateTagSchema } from './tag.schema';
import { AppError } from '@/lib/errors/app-error';

export async function handleGetTags() {
    try {
        const tags = await tagService.getTags();
        return NextResponse.json(tags);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to fetch tags' },
            { status: error.statusCode || 500 }
        );
    }
}

export async function handleCreateTag(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = CreateTagSchema.parse(body);
        const tag = await tagService.createTag(validatedData);
        return NextResponse.json(tag, { status: 201 });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
        }
        return NextResponse.json(
            { error: error.message || 'Failed to create tag' },
            { status: error.statusCode || 500 }
        );
    }
}

export async function handleGetTag(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const tag = await tagService.getTagById(id);
        return NextResponse.json(tag);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to fetch tag' },
            { status: error.statusCode || 500 }
        );
    }
}

export async function handleUpdateTag(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const validatedData = UpdateTagSchema.parse(body);
        const tag = await tagService.updateTag(id, validatedData);
        return NextResponse.json(tag);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
        }
        return NextResponse.json(
            { error: error.message || 'Failed to update tag' },
            { status: error.statusCode || 500 }
        );
    }
}

export async function handleDeleteTag(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await tagService.deleteTag(id);
        return NextResponse.json({ message: 'Tag deleted successfully' });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to delete tag' },
            { status: error.statusCode || 500 }
        );
    }
}
