import { NextResponse } from 'next/server';
import { 
  handleGetCategoryById, 
  handleUpdateCategory, 
  handleDeleteCategory 
} from '@/lib/category/category.controller';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status, body } = await handleGetCategoryById(params.id);
  return NextResponse.json(body, { status });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const { status, body } = await handleUpdateCategory(params.id, data);
  return NextResponse.json(body, { status });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json().catch(() => ({}));
  const { status, body } = await handleDeleteCategory(params.id, data);
  return NextResponse.json(body, { status });
}
