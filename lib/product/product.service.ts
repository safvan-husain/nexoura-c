import { ProductModel } from '@/lib/models/product.model';
import { TagModel } from '@/lib/models/tag.model';
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

  console.log('[ProductService] Creating product in DB:', JSON.stringify(data, null, 2));
  const product = await ProductModel.create(data);

  return product;
}

export async function getProducts(query: ProductQueryInput) {
  await connectDB();

  const { page, limit, search, minPrice, maxPrice, status, minStock, maxStock, sortBy, sortOrder, tag } = query;

  const filter: any = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  if (status !== undefined) {
    filter.status = status;
  }

  if (minStock !== undefined || maxStock !== undefined) {
    filter.stock = {};
    if (minStock !== undefined) filter.stock.$gte = minStock;
    if (maxStock !== undefined) filter.stock.$lte = maxStock;
  }

  if (tag && tag !== 'all') {
    const tagDoc = await TagModel.findOne({ slug: tag });
    if (tagDoc) {
      filter.tags = tagDoc._id;
    } else {
      // If tag doesn't exist and it's not 'all', return no products
      return {
        products: [],
        pagination: { page, limit, total: 0, pages: 0 }
      };
    }
  }

  const skip = (page - 1) * limit;
  const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const products = await ProductModel.find(filter)
    .populate('tags')
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await ProductModel.countDocuments(filter);

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

  const product = await ProductModel.findById(id).populate('tags').lean();

  if (!product) {
    throw new AppError('PRODUCT_NOT_FOUND', 404);
  }

  return product;
}

export async function getProductBySlug(slug: string) {
  await connectDB();

  const product = await ProductModel.findOne({ slug }).lean();

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

  console.log('[ProductService] Updating product', id, 'in DB with data:', JSON.stringify(data, null, 2));
  const product = await ProductModel.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );

  // Verification step requested by user
  const verification = await ProductModel.findById(id).lean();
  console.log('[ProductService] Re-fetched product from DB after update:', JSON.stringify(verification, null, 2));

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

export async function validateStock(items: { productId: string; quantity: number }[]) {
  await connectDB();

  for (const item of items) {
    const product = await ProductModel.findById(item.productId);
    if (!product) {
      throw new AppError('PRODUCT_NOT_FOUND', 404, { productId: item.productId });
    }
    if (product.stock < item.quantity) {
      throw new AppError('INSUFFICIENT_STOCK', 409, {
        message: `Product "${product.name}" has only ${product.stock} items left in stock (requested: ${item.quantity})`,
        productId: item.productId,
        available: product.stock,
        requested: item.quantity
      });
    }
  }
}

export async function decrementStock(items: { productId: string; quantity: number }[]) {
  await connectDB();

  console.log('[ProductService] Decrementing stock for items:', JSON.stringify(items));

  const operations = items.map(item => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { stock: -item.quantity } }
    }
  }));

  if (operations.length > 0) {
    await ProductModel.bulkWrite(operations);
  }
}

