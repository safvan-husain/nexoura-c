import { NextResponse } from 'next/server';
import { 
  handleGetCategoryById, 
  handleUpdateCategory, 
  handleDeleteCategory 
} from '@/lib/category/category.controller';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status, body } = await handleGetCategoryById(id);
  return NextResponse.json(body, { status });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();
  const { status, body } = await handleUpdateCategory(id, data);
  return NextResponse.json(body, { status });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const replacementCategoryId = searchParams.get('replacementCategoryId') || undefined;
  
  const { status, body } = await handleDeleteCategory(id, { replacementCategoryId });
  return NextResponse.json(body, { status });
}
