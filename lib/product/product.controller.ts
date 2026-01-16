import { CreateProductSchema, UpdateProductSchema, ProductQuerySchema } from './product.schema';
import { createProduct, getProducts, getProductById, getProductBySlug, updateProduct, deleteProduct } from './product.service';
import { catchError } from '@/lib/errors/app-error';

export async function handleCreateProduct(input: unknown) {
  try {
    console.log('[ProductController] Creating product with input:', JSON.stringify(input, null, 2));
    const parsed = CreateProductSchema.parse(input);
    console.log('[ProductController] Parsed create input:', JSON.stringify(parsed, null, 2));
    const result = await createProduct(parsed);
    return { status: 201, body: result };
  } catch (err) {
    return catchError(err);
  }
}

export async function handleGetProducts(query: unknown) {
  try {
    const parsed = ProductQuerySchema.parse(query);
    const result = await getProducts(parsed);
    return { status: 200, body: result };
  } catch (err) {
    console.error('Error in handleGetProducts:', err);
    return catchError(err);
  }
}

export async function handleGetProductById(id: string) {
  try {
    const result = await getProductById(id);
    return { status: 200, body: result };
  } catch (err) {
    return catchError(err);
  }
}

export async function handleGetProductBySlug(slug: string) {
  try {
    const result = await getProductBySlug(slug);
    return { status: 200, body: result };
  } catch (err) {
    return catchError(err);
  }
}

export async function handleUpdateProduct(id: string, input: unknown) {
  try {
    console.log('[ProductController] Updating product', id, 'with input:', JSON.stringify(input, null, 2));
    const parsed = UpdateProductSchema.parse(input);
    console.log('[ProductController] Parsed update input:', JSON.stringify(parsed, null, 2));
    const result = await updateProduct(id, parsed);
    return { status: 200, body: result };
  } catch (err) {
    return catchError(err);
  }
}

export async function handleDeleteProduct(id: string) {
  try {
    const result = await deleteProduct(id);
    return { status: 200, body: result };
  } catch (err) {
    return catchError(err);
  }
}
