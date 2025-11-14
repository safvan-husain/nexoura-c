import { NextResponse } from 'next/server';
import { handleGetProducts, handleCreateProduct } from '@/lib/product/product.controller';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  const query = {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20'),
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
    isFeatured: searchParams.get('isFeatured') ? searchParams.get('isFeatured') === 'true' : undefined,
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
  };

  const { status, body } = await handleGetProducts(query);
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  const data = await req.json();
  // TODO: Extract adminId from JWT token in Authorization header
  const { status, body } = await handleCreateProduct(data);
  return NextResponse.json(body, { status });
}
