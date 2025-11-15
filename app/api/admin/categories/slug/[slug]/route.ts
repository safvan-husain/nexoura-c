import { NextResponse } from 'next/server';
import { handleGetCategoryBySlug } from '@/lib/category/category.controller';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { status, body } = await handleGetCategoryBySlug(params.slug);
  return NextResponse.json(body, { status });
}
