import { GET as productsGET, POST as productsPOST } from '@/app/api/products/route';
import { GET as productGET, PUT as productPUT, DELETE as productDELETE } from '@/app/api/products/[id]/route';
import { ProductModel } from '@/lib/models/product.model';

// Helper to create mock Request
function createMockRequest(method: string, body?: any, url?: string): Request {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  return new Request(url || 'http://localhost:3000', options);
}

describe('Products Integration Tests', () => {
  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const req = createMockRequest('POST', {
        name: 'E2E Product',
        slug: 'e2e-product',
        description: 'E2E test product',
        price: 29.99,
        stock: 100,
        sku: 'E2E-001',
        categories: ['test'],
        tags: ['e2e'],
      });

      const response = await productsPOST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.name).toBe('E2E Product');
      expect(body.price).toBe(29.99);
    });

    it('should return 400 for invalid data', async () => {
      const req = createMockRequest('POST', {
        name: 'Invalid Product',
        // Missing required fields
      });

      const response = await productsPOST(req);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('VALIDATION_ERROR');
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

      const req = createMockRequest('POST', {
        name: 'Second Product',
        slug: 'duplicate-slug',
        description: 'Description',
        price: 20,
        stock: 30,
        sku: 'SECOND-001',
      });

      const response = await productsPOST(req);
      const body = await response.json();

      expect(response.status).toBe(409);
      expect(body.error).toBe('PRODUCT_ALREADY_EXISTS');
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
      const req = createMockRequest('GET', undefined, 'http://localhost:3000/api/products');
      const response = await productsGET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.products).toHaveLength(3);
      expect(body.pagination.total).toBe(3);
    });

    it('should filter by search term', async () => {
      const req = createMockRequest('GET', undefined, 'http://localhost:3000/api/products?search=Product 1');
      const response = await productsGET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.products).toHaveLength(1);
      expect(body.products[0].name).toBe('Product 1');
    });

    it('should filter by category', async () => {
      const req = createMockRequest('GET', undefined, 'http://localhost:3000/api/products?category=electronics');
      const response = await productsGET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.products).toHaveLength(1);
      expect(body.products[0].categories).toContain('electronics');
    });

    it('should filter by price range', async () => {
      const req = createMockRequest('GET', undefined, 'http://localhost:3000/api/products?minPrice=15&maxPrice=25');
      const response = await productsGET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.products).toHaveLength(1);
      expect(body.products[0].price).toBe(20);
    });

    it('should filter by isActive', async () => {
      const req = createMockRequest('GET', undefined, 'http://localhost:3000/api/products?isActive=true');
      const response = await productsGET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.products).toHaveLength(2);
    });

    it('should paginate results', async () => {
      const req = createMockRequest('GET', undefined, 'http://localhost:3000/api/products?page=1&limit=2');
      const response = await productsGET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.products).toHaveLength(2);
      expect(body.pagination.pages).toBe(2);
    });

    it('should sort by price', async () => {
      const req = createMockRequest('GET', undefined, 'http://localhost:3000/api/products?sortBy=price&sortOrder=asc');
      const response = await productsGET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.products[0].price).toBe(10);
      expect(body.products[2].price).toBe(30);
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

      const req = createMockRequest('GET');
      const response = await productGET(req, { params: Promise.resolve({ id: product._id.toString() }) });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.name).toBe('Get By ID');
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const req = createMockRequest('GET');
      const response = await productGET(req, { params: Promise.resolve({ id: fakeId }) });
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toBe('PRODUCT_NOT_FOUND');
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

      const req = createMockRequest('PUT', {
        name: 'Updated Name',
        price: 15,
      });
      const response = await productPUT(req, { params: Promise.resolve({ id: product._id.toString() }) });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.name).toBe('Updated Name');
      expect(body.price).toBe(15);
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const req = createMockRequest('PUT', { name: 'Updated' });
      const response = await productPUT(req, { params: Promise.resolve({ id: fakeId }) });
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toBe('PRODUCT_NOT_FOUND');
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

      const req = createMockRequest('DELETE');
      const response = await productDELETE(req, { params: Promise.resolve({ id: product._id.toString() }) });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toBe('Product deleted successfully');

      const found = await ProductModel.findById(product._id);
      expect(found).toBeNull();
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const req = createMockRequest('DELETE');
      const response = await productDELETE(req, { params: Promise.resolve({ id: fakeId }) });
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toBe('PRODUCT_NOT_FOUND');
    });
  });
});
