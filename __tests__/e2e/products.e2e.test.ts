import request from 'supertest';
import { ProductModel } from '@/lib/models/product.model';

const API_URL = 'http://localhost:3000';

describe('Products E2E Tests', () => {
  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const response = await request(API_URL)
        .post('/api/products')
        .send({
          name: 'E2E Product',
          slug: 'e2e-product',
          description: 'E2E test product',
          price: 29.99,
          stock: 100,
          sku: 'E2E-001',
          categories: ['test'],
          tags: ['e2e'],
        })
        .expect(201);

      expect(response.body.name).toBe('E2E Product');
      expect(response.body.price).toBe(29.99);
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(API_URL)
        .post('/api/products')
        .send({
          name: 'Invalid Product',
          // Missing required fields
        })
        .expect(400);

      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 409 for duplicate slug', async () => {
      await ProductModel.create({
        name: 'First Product',
        slug: 'duplicate-slug',
        description: 'Description',
        price: 10,
        stock: 50,
        sku: 'FIRST-001',
      });

      const response = await request(API_URL)
        .post('/api/products')
        .send({
          name: 'Second Product',
          slug: 'duplicate-slug',
          description: 'Description',
          price: 20,
          stock: 30,
          sku: 'SECOND-001',
        })
        .expect(409);

      expect(response.body.error).toBe('PRODUCT_ALREADY_EXISTS');
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      await ProductModel.create([
        {
          name: 'Product 1',
          slug: 'product-1',
          description: 'Description 1',
          price: 10,
          stock: 50,
          sku: 'PROD-001',
          categories: ['electronics'],
          isActive: true,
        },
        {
          name: 'Product 2',
          slug: 'product-2',
          description: 'Description 2',
          price: 20,
          stock: 30,
          sku: 'PROD-002',
          categories: ['clothing'],
          isActive: true,
        },
        {
          name: 'Product 3',
          slug: 'product-3',
          description: 'Description 3',
          price: 30,
          stock: 0,
          sku: 'PROD-003',
          isActive: false,
        },
      ]);
    });

    it('should get all products', async () => {
      const response = await request(API_URL)
        .get('/api/products')
        .expect(200);

      expect(response.body.products).toHaveLength(3);
      expect(response.body.pagination.total).toBe(3);
    });

    it('should filter by search term', async () => {
      const response = await request(API_URL)
        .get('/api/products?search=Product 1')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].name).toBe('Product 1');
    });

    it('should filter by category', async () => {
      const response = await request(API_URL)
        .get('/api/products?category=electronics')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].categories).toContain('electronics');
    });

    it('should filter by price range', async () => {
      const response = await request(API_URL)
        .get('/api/products?minPrice=15&maxPrice=25')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].price).toBe(20);
    });

    it('should filter by isActive', async () => {
      const response = await request(API_URL)
        .get('/api/products?isActive=true')
        .expect(200);

      expect(response.body.products).toHaveLength(2);
    });

    it('should paginate results', async () => {
      const response = await request(API_URL)
        .get('/api/products?page=1&limit=2')
        .expect(200);

      expect(response.body.products).toHaveLength(2);
      expect(response.body.pagination.pages).toBe(2);
    });

    it('should sort by price', async () => {
      const response = await request(API_URL)
        .get('/api/products?sortBy=price&sortOrder=asc')
        .expect(200);

      expect(response.body.products[0].price).toBe(10);
      expect(response.body.products[2].price).toBe(30);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get product by id', async () => {
      const product = await ProductModel.create({
        name: 'Get By ID',
        slug: 'get-by-id',
        description: 'Description',
        price: 10,
        stock: 50,
        sku: 'GET-001',
      });

      const response = await request(API_URL)
        .get(`/api/products/${product._id}`)
        .expect(200);

      expect(response.body.name).toBe('Get By ID');
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(API_URL)
        .get(`/api/products/${fakeId}`)
        .expect(404);

      expect(response.body.error).toBe('PRODUCT_NOT_FOUND');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update product', async () => {
      const product = await ProductModel.create({
        name: 'Original Name',
        slug: 'original-slug',
        description: 'Description',
        price: 10,
        stock: 50,
        sku: 'UPDATE-001',
      });

      const response = await request(API_URL)
        .put(`/api/products/${product._id}`)
        .send({
          name: 'Updated Name',
          price: 15,
        })
        .expect(200);

      expect(response.body.name).toBe('Updated Name');
      expect(response.body.price).toBe(15);
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(API_URL)
        .put(`/api/products/${fakeId}`)
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.error).toBe('PRODUCT_NOT_FOUND');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product', async () => {
      const product = await ProductModel.create({
        name: 'To Delete',
        slug: 'to-delete',
        description: 'Description',
        price: 10,
        stock: 50,
        sku: 'DELETE-001',
      });

      const response = await request(API_URL)
        .delete(`/api/products/${product._id}`)
        .expect(200);

      expect(response.body.message).toBe('Product deleted successfully');

      const found = await ProductModel.findById(product._id);
      expect(found).toBeNull();
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(API_URL)
        .delete(`/api/products/${fakeId}`)
        .expect(404);

      expect(response.body.error).toBe('PRODUCT_NOT_FOUND');
    });
  });
});
