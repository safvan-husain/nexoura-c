import { CreateProductSchema, UpdateProductSchema, ProductQuerySchema } from './product.schema';
import { createProduct, getProducts, getProductById, getProductBySlug, updateProduct, deleteProduct } from './product.service';
import { catchError } from '@/lib/errors/app-error';

export async function handleCreateProduct(input: unknown) {
  try {
    const parsed = CreateProductSchema.parse(input);
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
    const parsed = UpdateProductSchema.parse(input);
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
