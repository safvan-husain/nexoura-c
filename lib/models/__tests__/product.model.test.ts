import { ProductModel } from '../product.model';

describe('Product Model', () => {
  describe('Creation', () => {
    it('should create a new product with valid data', async () => {
      const productData = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'A test product description',
        price: 29.99,
        stock: 100,
        sku: 'TEST-001',
      };

      const product = await ProductModel.create(productData);

      expect(product.name).toBe(productData.name);
      expect(product.slug).toBe(productData.slug);
      expect(product.price).toBe(productData.price);
      expect(product.stock).toBe(productData.stock);
      expect(product.sku).toBe(productData.sku);
      expect(product.isActive).toBe(true);
      expect(product.isFeatured).toBe(false);
    });

    it('should fail with duplicate slug', async () => {
      await ProductModel.create({
        name: 'Product 1',
        slug: 'duplicate-slug',
        description: 'Description',
        price: 10,
        stock: 50,
        sku: 'SKU-001',
      });

      await expect(
        ProductModel.create({
          name: 'Product 2',
          slug: 'duplicate-slug',
          description: 'Description',
          price: 20,
          stock: 30,
          sku: 'SKU-002',
        })
      ).rejects.toThrow();
    });

    it('should fail with duplicate sku', async () => {
      await ProductModel.create({
        name: 'Product 1',
        slug: 'product-1',
        description: 'Description',
        price: 10,
        stock: 50,
        sku: 'DUPLICATE-SKU',
      });

      // Ensure indexes are created
      await ProductModel.createIndexes();

      await expect(
        ProductModel.create({
          name: 'Product 2',
          slug: 'product-2',
          description: 'Description',
          price: 20,
          stock: 30,
          sku: 'DUPLICATE-SKU',
        })
      ).rejects.toThrow();
    });
  });

  describe('Computed Properties', () => {
    it('should correctly calculate isInStock', async () => {
      const inStock = await ProductModel.create({
        name: 'In Stock Product',
        slug: 'in-stock',
        description: 'Description',
        price: 10,
        stock: 5,
        sku: 'IN-STOCK',
      });

      const outOfStock = await ProductModel.create({
        name: 'Out of Stock Product',
        slug: 'out-of-stock',
        description: 'Description',
        price: 10,
        stock: 0,
        sku: 'OUT-STOCK',
      });

      expect(inStock.isInStock).toBe(true);
      expect(outOfStock.isInStock).toBe(false);
    });

    it('should correctly calculate hasDiscount', async () => {
      const withDiscount = await ProductModel.create({
        name: 'Discounted Product',
        slug: 'discounted',
        description: 'Description',
        price: 20,
        compareAtPrice: 30,
        stock: 10,
        sku: 'DISCOUNT',
      });

      const noDiscount = await ProductModel.create({
        name: 'Regular Product',
        slug: 'regular',
        description: 'Description',
        price: 20,
        stock: 10,
        sku: 'REGULAR',
      });

      expect(withDiscount.hasDiscount).toBe(true);
      expect(noDiscount.hasDiscount).toBe(false);
    });

    it('should correctly calculate discountPercentage', async () => {
      const product = await ProductModel.create({
        name: 'Product',
        slug: 'product',
        description: 'Description',
        price: 75,
        compareAtPrice: 100,
        stock: 10,
        sku: 'PERCENT',
      });

      expect(product.discountPercentage).toBe(25);
    });
  });

  describe('Images and Variants', () => {
    it('should store product images', async () => {
      const product = await ProductModel.create({
        name: 'Product with Images',
        slug: 'with-images',
        description: 'Description',
        price: 10,
        stock: 5,
        sku: 'IMG-001',
        images: [
          { url: 'https://example.com/img1.jpg', isPrimary: true },
          { url: 'https://example.com/img2.jpg', alt: 'Alt text' },
        ],
      });

      expect(product.images).toHaveLength(2);
      expect(product.images[0].isPrimary).toBe(true);
      expect(product.images[1].alt).toBe('Alt text');
    });

    it('should store product variants', async () => {
      const product = await ProductModel.create({
        name: 'Product with Variants',
        slug: 'with-variants',
        description: 'Description',
        price: 10,
        stock: 5,
        sku: 'VAR-001',
        variants: [
          { name: 'Small', sku: 'VAR-001-S', price: 10, stock: 5 },
          { name: 'Large', sku: 'VAR-001-L', price: 15, stock: 3 },
        ],
      });

      expect(product.variants).toHaveLength(2);
      expect(product.variants[0].name).toBe('Small');
      expect(product.variants[1].price).toBe(15);
    });
  });

  describe('Categories and Tags', () => {
    it('should store categories and tags', async () => {
      const product = await ProductModel.create({
        name: 'Categorized Product',
        slug: 'categorized',
        description: 'Description',
        price: 10,
        stock: 5,
        sku: 'CAT-001',
        categories: ['electronics', 'gadgets'],
        tags: ['new', 'featured', 'sale'],
      });

      expect(product.categories).toHaveLength(2);
      expect(product.tags).toHaveLength(3);
      expect(product.categories).toContain('electronics');
      expect(product.tags).toContain('featured');
    });
  });
});
