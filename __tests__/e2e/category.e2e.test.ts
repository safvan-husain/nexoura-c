import { POST as createCategoryPOST, GET as getCategoriesGET } from '@/app/api/admin/categories/route';
import { 
  GET as getCategoryByIdGET, 
  PUT as updateCategoryPUT, 
  DELETE as deleteCategoryDELETE 
} from '@/app/api/admin/categories/[id]/route';
import { CategoryModel } from '@/lib/models/category.model';
import { ProductModel } from '@/lib/models/product.model';

function createMockRequest(body: any, method: string = 'POST'): Request {
  return new Request('http://localhost:3000', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function createMockGetRequest(url: string): Request {
  return new Request(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('Category Integration Tests', () => {
  describe('POST /api/admin/categories', () => {
    it('should create a new category', async () => {
      const req = createMockRequest({
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
        isActive: true,
        sortOrder: 1,
      });

      const response = await createCategoryPOST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.name).toBe('Electronics');
      expect(body.slug).toBe('electronics');
      expect(body._id).toBeDefined();
    });

    it('should return 400 for invalid slug format', async () => {
      const req = createMockRequest({
        name: 'Test Category',
        slug: 'Invalid Slug!',
        description: 'Test',
      });

      const response = await createCategoryPOST(req);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 409 for duplicate slug', async () => {
      await CategoryModel.create({
        name: 'Existing',
        slug: 'existing-category',
      });

      const req = createMockRequest({
        name: 'New Category',
        slug: 'existing-category',
      });

      const response = await createCategoryPOST(req);
      const body = await response.json();

      expect(response.status).toBe(409);
      expect(body.error).toBe('CATEGORY_ALREADY_EXISTS');
    });

    it('should create category with parent', async () => {
      const parent = await CategoryModel.create({
        name: 'Parent Category',
        slug: 'parent-category',
      });

      const req = createMockRequest({
        name: 'Child Category',
        slug: 'child-category',
        parent: parent._id.toString(),
      });

      const response = await createCategoryPOST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.parent).toBe(parent._id.toString());
    });

    it('should return 404 for invalid parent category', async () => {
      const req = createMockRequest({
        name: 'Child Category',
        slug: 'child-category',
        parent: '507f1f77bcf86cd799439011',
      });

      const response = await createCategoryPOST(req);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toBe('PARENT_CATEGORY_NOT_FOUND');
    });
  });

  describe('GET /api/admin/categories', () => {
    beforeEach(async () => {
      await CategoryModel.create([
        { name: 'Category 1', slug: 'category-1', sortOrder: 1 },
        { name: 'Category 2', slug: 'category-2', sortOrder: 2 },
        { name: 'Category 3', slug: 'category-3', sortOrder: 3, isActive: false },
      ]);
    });

    it('should get all categories with pagination', async () => {
      const req = createMockGetRequest('http://localhost:3000/api/admin/categories?page=1&limit=10');

      const response = await getCategoriesGET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.categories).toHaveLength(3);
      expect(body.pagination.total).toBe(3);
    });

    it('should filter categories by isActive', async () => {
      const req = createMockGetRequest('http://localhost:3000/api/admin/categories?isActive=true');

      const response = await getCategoriesGET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.categories).toHaveLength(2);
    });

    it('should search categories by name', async () => {
      const req = createMockGetRequest('http://localhost:3000/api/admin/categories?search=Category 1');

      const response = await getCategoriesGET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.categories.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/admin/categories/[id]', () => {
    it('should get category by id', async () => {
      const category = await CategoryModel.create({
        name: 'Test Category',
        slug: 'test-category',
      });

      const response = await getCategoryByIdGET(
        new Request('http://localhost:3000'),
        { params: { id: category._id.toString() } }
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.name).toBe('Test Category');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await getCategoryByIdGET(
        new Request('http://localhost:3000'),
        { params: { id: '507f1f77bcf86cd799439011' } }
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toBe('CATEGORY_NOT_FOUND');
    });

    it('should return 400 for invalid id format', async () => {
      const response = await getCategoryByIdGET(
        new Request('http://localhost:3000'),
        { params: { id: 'invalid-id' } }
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('INVALID_CATEGORY_ID');
    });
  });

  describe('PUT /api/admin/categories/[id]', () => {
    it('should update category', async () => {
      const category = await CategoryModel.create({
        name: 'Old Name',
        slug: 'old-slug',
      });

      const req = createMockRequest({
        name: 'New Name',
        description: 'Updated description',
      }, 'PUT');

      const response = await updateCategoryPUT(
        req,
        { params: { id: category._id.toString() } }
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.name).toBe('New Name');
      expect(body.description).toBe('Updated description');
    });

    it('should return 409 for duplicate slug', async () => {
      const category1 = await CategoryModel.create({
        name: 'Category 1',
        slug: 'category-1',
      });

      const category2 = await CategoryModel.create({
        name: 'Category 2',
        slug: 'category-2',
      });

      const req = createMockRequest({
        slug: 'category-1',
      }, 'PUT');

      const response = await updateCategoryPUT(
        req,
        { params: { id: category2._id.toString() } }
      );
      const body = await response.json();

      expect(response.status).toBe(409);
      expect(body.error).toBe('CATEGORY_ALREADY_EXISTS');
    });

    it('should return 400 when category is its own parent', async () => {
      const category = await CategoryModel.create({
        name: 'Category',
        slug: 'category',
      });

      const req = createMockRequest({
        parent: category._id.toString(),
      }, 'PUT');

      const response = await updateCategoryPUT(
        req,
        { params: { id: category._id.toString() } }
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('CATEGORY_CANNOT_BE_ITS_OWN_PARENT');
    });
  });

  describe('DELETE /api/admin/categories/[id]', () => {
    it('should delete category without products', async () => {
      const category = await CategoryModel.create({
        name: 'To Delete',
        slug: 'to-delete',
      });

      const req = createMockRequest({}, 'DELETE');

      const response = await deleteCategoryDELETE(
        req,
        { params: { id: category._id.toString() } }
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toBe('Category deleted successfully');

      const deletedCategory = await CategoryModel.findById(category._id);
      expect(deletedCategory).toBeNull();
    });

    it('should return 400 when category is in use without replacement', async () => {
      const category = await CategoryModel.create({
        name: 'In Use',
        slug: 'in-use',
      });

      await ProductModel.create({
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        price: 100,
        categories: [category._id],
        variants: [{
          name: 'Default',
          sku: 'TEST-001',
          stock: 10,
        }],
      });

      const req = createMockRequest({}, 'DELETE');

      const response = await deleteCategoryDELETE(
        req,
        { params: { id: category._id.toString() } }
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('CATEGORY_IN_USE');
      expect(body.details.productsCount).toBe(1);
    });

    it('should delete category and replace in products', async () => {
      const categoryToDelete = await CategoryModel.create({
        name: 'To Delete',
        slug: 'to-delete',
      });

      const replacementCategory = await CategoryModel.create({
        name: 'Replacement',
        slug: 'replacement',
      });

      const product = await ProductModel.create({
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        price: 100,
        categories: [categoryToDelete._id],
        variants: [{
          name: 'Default',
          sku: 'TEST-002',
          stock: 10,
        }],
      });

      const req = createMockRequest({
        replacementCategoryId: replacementCategory._id.toString(),
      }, 'DELETE');

      const response = await deleteCategoryDELETE(
        req,
        { params: { id: categoryToDelete._id.toString() } }
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toBe('Category deleted successfully');
      expect(body.productsUpdated).toBe(1);

      const updatedProduct = await ProductModel.findById(product._id);
      expect(updatedProduct?.categories[0].toString()).toBe(replacementCategory._id.toString());

      const deletedCategory = await CategoryModel.findById(categoryToDelete._id);
      expect(deletedCategory).toBeNull();
    });

    it('should return 404 for invalid replacement category', async () => {
      const category = await CategoryModel.create({
        name: 'To Delete',
        slug: 'to-delete',
      });

      await ProductModel.create({
        name: 'Test Product',
        slug: 'test-product-2',
        description: 'Test',
        price: 100,
        categories: [category._id],
        variants: [{
          name: 'Default',
          sku: 'TEST-003',
          stock: 10,
        }],
      });

      const req = createMockRequest({
        replacementCategoryId: '507f1f77bcf86cd799439011',
      }, 'DELETE');

      const response = await deleteCategoryDELETE(
        req,
        { params: { id: category._id.toString() } }
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toBe('REPLACEMENT_CATEGORY_NOT_FOUND');
    });

    it('should set parent to null for child categories', async () => {
      const parentCategory = await CategoryModel.create({
        name: 'Parent',
        slug: 'parent',
      });

      const childCategory = await CategoryModel.create({
        name: 'Child',
        slug: 'child',
        parent: parentCategory._id,
      });

      const req = createMockRequest({}, 'DELETE');

      const response = await deleteCategoryDELETE(
        req,
        { params: { id: parentCategory._id.toString() } }
      );

      expect(response.status).toBe(200);

      const updatedChild = await CategoryModel.findById(childCategory._id);
      expect(updatedChild?.parent).toBeNull();
    });
  });
});
