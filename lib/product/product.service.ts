import { ProductModel } from '@/lib/models/product.model';
import { AppError } from '@/lib/errors/app-error';
import { connectDB } from '@/lib/db/mongo-client';
import type { CreateProductInput, UpdateProductInput, ProductQueryInput } from './product.schema';

export async function createProduct(data: CreateProductInput, adminId?: string) {
  await connectDB();

  const existingProduct = await ProductModel.findOne({
    $or: [{ slug: data.slug }, { sku: data.sku }]
  });

  if (existingProduct) {
    throw new AppError(409, 'PRODUCT_ALREADY_EXISTS', {
      field: existingProduct.slug === data.slug ? 'slug' : 'sku'
    });
  }

  const product = await ProductModel.create({
    ...data,
    createdBy: adminId,
  });

  return product;
}

export async function getProducts(query: ProductQueryInput) {
  await connectDB();

  const { page, limit, search, category, minPrice, maxPrice, isActive, isFeatured, sortBy, sortOrder } = query;

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

  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  if (isFeatured !== undefined) {
    filter.isFeatured = isFeatured;
  }

  const skip = (page - 1) * limit;
  const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [products, total] = await Promise.all([
    ProductModel.find(filter)
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

  const product = await ProductModel.findById(id).lean();

  if (!product) {
    throw new AppError(404, 'PRODUCT_NOT_FOUND');
  }

  return product;
}

export async function getProductBySlug(slug: string) {
  await connectDB();

  const product = await ProductModel.findOne({ slug }).lean();

  if (!product) {
    throw new AppError(404, 'PRODUCT_NOT_FOUND');
  }

  return product;
}

export async function updateProduct(id: string, data: UpdateProductInput, adminId?: string) {
  await connectDB();

  if (data.slug || data.sku) {
    const existingProduct = await ProductModel.findOne({
      _id: { $ne: id },
      $or: [
        ...(data.slug ? [{ slug: data.slug }] : []),
        ...(data.sku ? [{ sku: data.sku }] : []),
      ]
    });

    if (existingProduct) {
      throw new AppError(409, 'PRODUCT_ALREADY_EXISTS', {
        field: existingProduct.slug === data.slug ? 'slug' : 'sku'
      });
    }
  }

  const product = await ProductModel.findByIdAndUpdate(
    id,
    { ...data, updatedBy: adminId },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new AppError(404, 'PRODUCT_NOT_FOUND');
  }

  return product;
}

export async function deleteProduct(id: string) {
  await connectDB();

  const product = await ProductModel.findByIdAndDelete(id);

  if (!product) {
    throw new AppError(404, 'PRODUCT_NOT_FOUND');
  }

  return { message: 'Product deleted successfully' };
}
