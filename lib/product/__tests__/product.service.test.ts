import {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from '../product.service';
import { ProductModel } from '@/lib/models/product.model';
import { AppError } from '@/lib/errors/app-error';

describe('Product Service', () => {
  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const productData = {
        name: 'New Product',
        slug: 'new-product-service',
        description: 'A new product',
        price: 29.99,
        stock: 100,
      };

      const product = await createProduct(productData as any);

      expect(product.name).toBe(productData.name);
      expect(product.slug).toBe(productData.slug);
      expect(product.price).toBe(productData.price);
    });

    it('should create a product with variants successfully', async () => {
      const productData = {
        name: 'Variant Product',
        slug: 'variant-product',
        description: 'A product with variants',
        price: 49.99,
        stock: 50,
        hasColors: true,
        colors: ['Red', 'Blue'],
        hasSizes: true,
        sizes: ['S', 'M', 'L'],
      };

      const product = await createProduct(productData as any);

      expect(product.hasColors).toBe(true);
      expect(product.colors).toContain('Red');
      expect(product.colors).toContain('Blue');
      expect(product.hasSizes).toBe(true);
      expect(product.sizes).toContain('S');
    });

    it('should throw error for duplicate slug', async () => {
      await createProduct({
        name: 'Product 1',
        slug: 'duplicate-slug',
        description: 'Description',
        price: 10,
        stock: 50,
      } as any);

      await expect(
        createProduct({
          name: 'Product 2',
          slug: 'duplicate-slug',
          description: 'Description',
          price: 20,
          stock: 30,
        } as any)
      ).rejects.toMatchObject({
        statusCode: 409,
        message: 'PRODUCT_ALREADY_EXISTS',
      });
    });
  });

  describe('getProducts', () => {
    beforeEach(async () => {
      await ProductModel.create([
        {
          name: 'Product A',
          slug: 'product-a',
          description: 'Description A',
          price: 10,
          status: 'published',
          stock: 50,
        },
        {
          name: 'Product B',
          slug: 'product-b',
          description: 'Description B',
          price: 20,
          status: 'published',
          stock: 30,
        },
        {
          name: 'Product C',
          slug: 'product-c',
          description: 'Description C',
          price: 30,
          status: 'archived',
          stock: 0,
        },
      ]);
    });

    it('should get all products with default pagination', async () => {
      const result = await getProducts({
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.products).toHaveLength(3);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.pages).toBe(1);
    });

    it('should filter by search term', async () => {
      const result = await getProducts({
        page: 1,
        limit: 20,
        search: 'Product A',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.products).toHaveLength(1);
      expect(result.products[0].name).toBe('Product A');
    });

    it('should filter by price range', async () => {
      const result = await getProducts({
        page: 1,
        limit: 20,
        minPrice: 15,
        maxPrice: 25,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.products).toHaveLength(1);
      expect(result.products[0].price).toBe(20);
    });

    it('should filter by status', async () => {
      const result = await getProducts({
        page: 1,
        limit: 20,
        status: 'published',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.products).toHaveLength(2);
    });

    it('should paginate results', async () => {
      const result = await getProducts({
        page: 1,
        limit: 2,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.products).toHaveLength(2);
      expect(result.pagination.pages).toBe(2);
    });

    it('should sort by price ascending', async () => {
      const result = await getProducts({
        page: 1,
        limit: 20,
        sortBy: 'price',
        sortOrder: 'asc',
      });

      expect(result.products[0].price).toBe(10);
      expect(result.products[2].price).toBe(30);
    });
  });

  describe('getProductById', () => {
    it('should get product by id', async () => {
      const created = await ProductModel.create({
        name: 'Test Product',
        slug: 'test-product-by-id',
        description: 'Description',
        price: 10,
        stock: 50,
      });

      const product = await getProductById(created._id.toString());

      expect(product.name).toBe('Test Product');
    });

    it('should throw error for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      await expect(getProductById(fakeId)).rejects.toMatchObject({
        statusCode: 404,
        message: 'PRODUCT_NOT_FOUND',
      });
    });
  });

  describe('getProductBySlug', () => {
    it('should get product by slug', async () => {
      await ProductModel.create({
        name: 'Slug Product',
        slug: 'slug-product-test',
        description: 'Description',
        price: 10,
        stock: 50,
      });

      const product = await getProductBySlug('slug-product-test');

      expect(product.name).toBe('Slug Product');
    });

    it('should throw error for non-existent slug', async () => {
      await expect(getProductBySlug('non-existent')).rejects.toMatchObject({
        statusCode: 404,
        message: 'PRODUCT_NOT_FOUND',
      });
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const created = await ProductModel.create({
        name: 'Original Name',
        slug: 'original-slug',
        description: 'Description',
        price: 10,
        stock: 50,
      });

      const updated = await updateProduct(created._id.toString(), {
        name: 'Updated Name',
        price: 15,
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.price).toBe(15);
      expect(updated.slug).toBe('original-slug');
    });

    it('should throw error for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      await expect(
        updateProduct(fakeId, { name: 'Updated' })
      ).rejects.toMatchObject({
        statusCode: 404,
        message: 'PRODUCT_NOT_FOUND',
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      const created = await ProductModel.create({
        name: 'To Delete',
        slug: 'to-delete-slug',
        description: 'Description',
        price: 10,
        stock: 50,
      });

      const result = await deleteProduct(created._id.toString());

      expect(result.message).toBe('Product deleted successfully');

      const found = await ProductModel.findById(created._id);
      expect(found).toBeNull();
    });

    it('should throw error for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      await expect(deleteProduct(fakeId)).rejects.toMatchObject({
        statusCode: 404,
        message: 'PRODUCT_NOT_FOUND',
      });
    });
  });
});
