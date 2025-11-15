import { 
  CreateCategorySchema, 
  UpdateCategorySchema, 
  DeleteCategorySchema,
  CategoryQuerySchema 
} from './category.schema';
import { 
  createCategory, 
  getCategories, 
  getCategoryById, 
  getCategoryBySlug,
  updateCategory, 
  deleteCategory 
} from './category.service';
import { AppError } from '@/lib/errors/app-error';

export async function handleCreateCategory(input: unknown) {
  const parsed = CreateCategorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: 'VALIDATION_ERROR', details: parsed.error.errors }
    };
  }

  try {
    const result = await createCategory(parsed.data);
    return { status: 201, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.statusCode, body: { error: err.message, details: err.error } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}

export async function handleGetCategories(input: unknown) {
  const parsed = CategoryQuerySchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: 'VALIDATION_ERROR', details: parsed.error.errors }
    };
  }

  try {
    const result = await getCategories(parsed.data);
    return { status: 200, body: result };
  } catch (err) {
    console.error('Error in handleGetCategories:', err);
    if (err instanceof AppError) {
      return { status: err.statusCode, body: { error: err.message, details: err.error } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR', message: err instanceof Error ? err.message : 'Unknown error' } };
  }
}

export async function handleGetCategoryById(id: string) {
  try {
    const result = await getCategoryById(id);
    return { status: 200, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.statusCode, body: { error: err.message, details: err.error } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}

export async function handleGetCategoryBySlug(slug: string) {
  try {
    const result = await getCategoryBySlug(slug);
    return { status: 200, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.statusCode, body: { error: err.message, details: err.error } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}

export async function handleUpdateCategory(id: string, input: unknown) {
  const parsed = UpdateCategorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: 'VALIDATION_ERROR', details: parsed.error.errors }
    };
  }

  try {
    const result = await updateCategory(id, parsed.data);
    return { status: 200, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.statusCode, body: { error: err.message, details: err.error } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}

export async function handleDeleteCategory(id: string, input: unknown) {
  const parsed = DeleteCategorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: 'VALIDATION_ERROR', details: parsed.error.errors }
    };
  }

  try {
    const result = await deleteCategory(id, parsed.data.replacementCategoryId);
    return { status: 200, body: result };
  } catch (err) {
    if (err instanceof AppError) {
      return { status: err.statusCode, body: { error: err.message, details: err.error } };
    }
    return { status: 500, body: { error: 'INTERNAL_SERVER_ERROR' } };
  }
}
