import { ProductModel } from '@/lib/models/product.model';
import { CategoryModel } from '@/lib/models/category.model';
import { AppError } from '@/lib/errors/app-error';
import { connectDB } from '@/lib/db/mongo-client';
import type { CreateProductInput, UpdateProductInput, ProductQueryInput } from './product.schema';

export async function createProduct(data: CreateProductInput) {
  await connectDB();

  const existingProduct = await ProductModel.findOne({ slug: data.slug });

  if (existingProduct) {
    throw new AppError('PRODUCT_ALREADY_EXISTS', 409, {
      field: 'slug'
    });
  }

  // Validate categories exist
  if (data.categories && data.categories.length > 0) {
    const categoriesCount = await CategoryModel.countDocuments({
      _id: { $in: data.categories }
    });
    if (categoriesCount !== data.categories.length) {
      throw new AppError('INVALID_CATEGORIES', 400, {
        message: 'One or more category IDs are invalid'
      });
    }
  }

  // Check for duplicate SKUs in variants
  const variantSkus = data.variants.map(v => v.sku);
  const duplicateSku = await ProductModel.findOne({
    'variants.sku': { $in: variantSkus }
  });

  if (duplicateSku) {
    throw new AppError('VARIANT_SKU_ALREADY_EXISTS', 409, {
      field: 'sku'
    });
  }

  const product = await ProductModel.create(data);

  return product;
}

export async function getProducts(query: ProductQueryInput) {
  await connectDB();

  const { page, limit, search, category, minPrice, maxPrice, status, sortBy, sortOrder } = query;

  const filter: any = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  if (category) {
    filter.categories = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  if (status !== undefined) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;
  const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [products, total] = await Promise.all([
    ProductModel.find(filter)
      .populate('categories', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    ProductModel.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getProductById(id: string) {
  await connectDB();

  const product = await ProductModel.findById(id)
    .populate('categories', 'name slug')
    .lean();

  if (!product) {
    throw new AppError('PRODUCT_NOT_FOUND', 404);
  }

  return product;
}

export async function getProductBySlug(slug: string) {
  await connectDB();

  const product = await ProductModel.findOne({ slug })
    .populate('categories', 'name slug')
    .lean();

  if (!product) {
    throw new AppError('PRODUCT_NOT_FOUND', 404);
  }

  return product;
}

export async function updateProduct(id: string, data: UpdateProductInput) {
  await connectDB();

  if (data.slug) {
    const existingProduct = await ProductModel.findOne({
      _id: { $ne: id },
      slug: data.slug
    });

    if (existingProduct) {
      throw new AppError('PRODUCT_ALREADY_EXISTS', 409, {
        field: 'slug'
      });
    }
  }

  // Validate categories exist if being updated
  if (data.categories && data.categories.length > 0) {
    const categoriesCount = await CategoryModel.countDocuments({
      _id: { $in: data.categories }
    });
    if (categoriesCount !== data.categories.length) {
      throw new AppError('INVALID_CATEGORIES', 400, {
        message: 'One or more category IDs are invalid'
      });
    }
  }

  // Check for duplicate SKUs in variants if variants are being updated
  if (data.variants) {
    const variantSkus = data.variants.map(v => v.sku);
    const duplicateSku = await ProductModel.findOne({
      _id: { $ne: id },
      'variants.sku': { $in: variantSkus }
    });

    if (duplicateSku) {
      throw new AppError('VARIANT_SKU_ALREADY_EXISTS', 409, {
        field: 'sku'
      });
    }
  }

  const product = await ProductModel.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  ).populate('categories', 'name slug');

  if (!product) {
    throw new AppError('PRODUCT_NOT_FOUND', 404);
  }

  return product;
}

export async function deleteProduct(id: string) {
  await connectDB();

  const product = await ProductModel.findByIdAndDelete(id);

  if (!product) {
    throw new AppError('PRODUCT_NOT_FOUND', 404);
  }

  return { message: 'Product deleted successfully' };
}
