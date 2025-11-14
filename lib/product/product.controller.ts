import { CreateProductSchema, UpdateProductSchema, ProductQuerySchema } from './product.schema';
import { createProduct, getProducts, getProductById, getProductBySlug, updateProduct, deleteProduct } from './product.service';
import { AppError } from '@/lib/errors/app-error';

export async function handleCreateProduct(input: unknown, adminId?: string) {
  const parsed = CreateProductSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: 'VALIDATION_ERROR', details: parsed.error.errors }
    };
  }

  try {
    const result = await createProduct(parsed.data, adminId);
    return { status: 201, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.status, body: { error: err.code, details: err.details } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}

export async function handleGetProducts(query: unknown) {
  const parsed = ProductQuerySchema.safeParse(query);
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: 'VALIDATION_ERROR', details: parsed.error.errors }
    };
  }

  try {
    const result = await getProducts(parsed.data);
    return { status: 200, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.status, body: { error: err.code, details: err.details } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}

export async function handleGetProductById(id: string) {
  try {
    const result = await getProductById(id);
    return { status: 200, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.status, body: { error: err.code, details: err.details } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}

export async function handleGetProductBySlug(slug: string) {
  try {
    const result = await getProductBySlug(slug);
    return { status: 200, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.status, body: { error: err.code, details: err.details } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}

export async function handleUpdateProduct(id: string, input: unknown, adminId?: string) {
  const parsed = UpdateProductSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: 'VALIDATION_ERROR', details: parsed.error.errors }
    };
  }

  try {
    const result = await updateProduct(id, parsed.data, adminId);
    return { status: 200, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.status, body: { error: err.code, details: err.details } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}

export async function handleDeleteProduct(id: string) {
  try {
    const result = await deleteProduct(id);
    return { status: 200, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.status, body: { error: err.code, details: err.details } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}
