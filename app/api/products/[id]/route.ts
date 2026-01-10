import { NextResponse } from 'next/server';
import { handleGetProductById, handleUpdateProduct, handleDeleteProduct } from '@/lib/product/product.controller';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status, body } = await handleGetProductById(id);
  return NextResponse.json(body, {
    status,
    headers: { 'x-request-method': 'GET' }
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();
  const { status, body } = await handleUpdateProduct(id, data);
  return NextResponse.json(body, {
    status,
    headers: { 'x-request-method': 'PUT' }
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status, body } = await handleDeleteProduct(id);
  return NextResponse.json(body, {
    status,
    headers: { 'x-request-method': 'DELETE' }
  });
}
