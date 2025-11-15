import { NextResponse } from 'next/server';
import { handleCreateCategory, handleGetCategories } from '@/lib/category/category.controller';

export async function POST(req: Request) {
  const data = await req.json();
  const { status, body } = await handleCreateCategory(data);
  return NextResponse.json(body, { status });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  const queryData = {
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    search: searchParams.get('search') || undefined,
    isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
    parent: searchParams.get('parent') || undefined,
    sortBy: searchParams.get('sortBy') || 'sortOrder',
    sortOrder: searchParams.get('sortOrder') || 'asc',
  };

  const { status, body } = await handleGetCategories(queryData);
  return NextResponse.json(body, { status });
}
