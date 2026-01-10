import { NextResponse } from 'next/server';
import { handleGetProducts, handleCreateProduct } from '@/lib/product/product.controller';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query: any = {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20'),
    sortBy: (searchParams.get('sortBy') || 'createdAt') as 'name' | 'price' | 'createdAt',
    sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
  };

  // Only add optional params if they exist
  if (searchParams.get('search')) query.search = searchParams.get('search');
  if (searchParams.get('minPrice')) query.minPrice = parseFloat(searchParams.get('minPrice')!);
  if (searchParams.get('maxPrice')) query.maxPrice = parseFloat(searchParams.get('maxPrice')!);
  if (searchParams.get('status')) query.status = searchParams.get('status') as 'draft' | 'published' | 'archived';
  if (searchParams.get('minStock')) query.minStock = parseInt(searchParams.get('minStock')!);
  if (searchParams.get('maxStock')) query.maxStock = parseInt(searchParams.get('maxStock')!);

  const { status, body } = await handleGetProducts(query);
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  const data = await req.json();
  const { status, body } = await handleCreateProduct(data);
  return NextResponse.json(body, { status });
}
