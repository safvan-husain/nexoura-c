import { NextResponse } from 'next/server';
import { handleGetCategoryBySlug } from '@/lib/category/category.controller';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { status, body } = await handleGetCategoryBySlug(slug);
  return NextResponse.json(body, { status });
}
