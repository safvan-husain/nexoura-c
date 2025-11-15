import { CategoryModel } from '@/lib/models/category.model';
import { ProductModel } from '@/lib/models/product.model';
import { AppError } from '@/lib/errors/app-error';
import { connectDB } from '@/lib/db/mongo-client';
import type { CreateCategoryInput, UpdateCategoryInput, CategoryQueryInput } from './category.schema';
import mongoose from 'mongoose';

export async function createCategory(data: CreateCategoryInput) {
  await connectDB();

  const existingCategory = await CategoryModel.findOne({ slug: data.slug });

  if (existingCategory) {
    throw new AppError('CATEGORY_ALREADY_EXISTS', 409, { field: 'slug' });
  }

  if (data.parent) {
    const parentCategory = await CategoryModel.findById(data.parent);
    if (!parentCategory) {
      throw new AppError('PARENT_CATEGORY_NOT_FOUND', 404);
    }
  }

  const category = await CategoryModel.create(data);

  return category;
}

export async function getCategories(query: CategoryQueryInput) {
  await connectDB();

  const { page, limit, search, isActive, parent, sortBy, sortOrder } = query;

  const filter: any = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  if (parent !== undefined) {
    filter.parent = parent === 'null' ? null : parent;
  }

  const skip = (page - 1) * limit;
  const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [categories, total] = await Promise.all([
    CategoryModel.find(filter)
      .populate('parent', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    CategoryModel.countDocuments(filter),
  ]);

  return {
    categories,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getCategoryById(id: string) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('INVALID_CATEGORY_ID', 400);
  }

  const category = await CategoryModel.findById(id)
    .populate('parent', 'name slug')
    .lean();

  if (!category) {
    throw new AppError('CATEGORY_NOT_FOUND', 404);
  }

  return category;
}

export async function getCategoryBySlug(slug: string) {
  await connectDB();

  const category = await CategoryModel.findOne({ slug })
    .populate('parent', 'name slug')
    .lean();

  if (!category) {
    throw new AppError('CATEGORY_NOT_FOUND', 404);
  }

  return category;
}

export async function updateCategory(id: string, data: UpdateCategoryInput) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('INVALID_CATEGORY_ID', 400);
  }

  if (data.slug) {
    const existingCategory = await CategoryModel.findOne({
      _id: { $ne: id },
      slug: data.slug
    });

    if (existingCategory) {
      throw new AppError('CATEGORY_ALREADY_EXISTS', 409, { field: 'slug' });
    }
  }

  if (data.parent) {
    if (data.parent === id) {
      throw new AppError('CATEGORY_CANNOT_BE_ITS_OWN_PARENT', 400);
    }

    const parentCategory = await CategoryModel.findById(data.parent);
    if (!parentCategory) {
      throw new AppError('PARENT_CATEGORY_NOT_FOUND', 404);
    }
  }

  const category = await CategoryModel.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  ).populate('parent', 'name slug');

  if (!category) {
    throw new AppError('CATEGORY_NOT_FOUND', 404);
  }

  return category;
}

export async function deleteCategory(id: string, replacementCategoryId?: string) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('INVALID_CATEGORY_ID', 400);
  }

  const category = await CategoryModel.findById(id);

  if (!category) {
    throw new AppError('CATEGORY_NOT_FOUND', 404);
  }

  // Check if any products are using this category
  const productsUsingCategory = await ProductModel.countDocuments({
    categories: id
  });

  if (productsUsingCategory > 0) {
    if (!replacementCategoryId) {
      throw new AppError('CATEGORY_IN_USE', 400, {
        productsCount: productsUsingCategory,
        message: 'Category is being used by products. Provide a replacement category ID to proceed.'
      });
    }

    // Validate replacement category
    if (!mongoose.Types.ObjectId.isValid(replacementCategoryId)) {
      throw new AppError('INVALID_REPLACEMENT_CATEGORY_ID', 400);
    }

    if (replacementCategoryId === id) {
      throw new AppError('REPLACEMENT_CATEGORY_CANNOT_BE_SAME', 400);
    }

    const replacementCategory = await CategoryModel.findById(replacementCategoryId);
    if (!replacementCategory) {
      throw new AppError('REPLACEMENT_CATEGORY_NOT_FOUND', 404);
    }

    // Replace category in all products
    await ProductModel.updateMany(
      { categories: id },
      { 
        $set: { 'categories.$[elem]': replacementCategoryId }
      },
      {
        arrayFilters: [{ 'elem': id }]
      }
    );
  }

  // Check if any categories have this as parent
  const childCategories = await CategoryModel.countDocuments({ parent: id });
  if (childCategories > 0) {
    // Set parent to null for child categories
    await CategoryModel.updateMany(
      { parent: id },
      { $set: { parent: null } }
    );
  }

  await CategoryModel.findByIdAndDelete(id);

  return { 
    message: 'Category deleted successfully',
    productsUpdated: productsUsingCategory
  };
}
