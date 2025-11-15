import { ProductModel } from '../product.model';

describe('Product Model', () => {
  describe('Creation', () => {
    it('should create a new product with valid data', async () => {
      const productData = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'A test product description',
        price: 29.99,
        variants: [{ name: 'Default', sku: 'TEST-001', stock: 100 }],
      };

      const product = await ProductModel.create(productData);

      expect(product.name).toBe(productData.name);
      expect(product.slug).toBe(productData.slug);
      expect(product.price).toBe(productData.price);
      expect(product.variants).toHaveLength(1);
      expect(product.variants[0].stock).toBe(100);
      expect(product.status).toBe('draft');
    });

    it('should fail with duplicate slug', async () => {
      await ProductModel.create({
        name: 'Product 1',
        slug: 'duplicate-slug',
        description: 'Description',
        price: 10,
        variants: [{ name: 'Default', sku: 'SKU-001', stock: 50 }],
      });

      await expect(
        ProductModel.create({
          name: 'Product 2',
          slug: 'duplicate-slug',
          description: 'Description',
          price: 20,
          variants: [{ name: 'Default', sku: 'SKU-002', stock: 30 }],
        })
      ).rejects.toThrow();
    });

    it('should fail without variants', async () => {
      await expect(
        ProductModel.create({
          name: 'Product Without Variants',
          slug: 'no-variants',
          description: 'Description',
          price: 10,
          variants: [],
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
        variants: [{ name: 'Default', sku: 'IN-STOCK', stock: 5 }],
      });

      const outOfStock = await ProductModel.create({
        name: 'Out of Stock Product',
        slug: 'out-of-stock',
        description: 'Description',
        price: 10,
        variants: [{ name: 'Default', sku: 'OUT-STOCK', stock: 0 }],
      });

      expect(inStock.isInStock).toBe(true);
      expect(outOfStock.isInStock).toBe(false);
    });

    it('should correctly calculate totalStock', async () => {
      const product = await ProductModel.create({
        name: 'Multi Variant Product',
        slug: 'multi-variant',
        description: 'Description',
        price: 10,
        variants: [
          { name: 'Small', sku: 'MULTI-S', stock: 5 },
          { name: 'Medium', sku: 'MULTI-M', stock: 10 },
          { name: 'Large', sku: 'MULTI-L', stock: 3 },
        ],
      });

      expect(product.totalStock).toBe(18);
    });

    it('should correctly calculate hasDiscount', async () => {
      const withDiscount = await ProductModel.create({
        name: 'Discounted Product',
        slug: 'discounted',
        description: 'Description',
        price: 20,
        compareAtPrice: 30,
        variants: [{ name: 'Default', sku: 'DISCOUNT', stock: 10 }],
      });

      const noDiscount = await ProductModel.create({
        name: 'Regular Product',
        slug: 'regular',
        description: 'Description',
        price: 20,
        variants: [{ name: 'Default', sku: 'REGULAR', stock: 10 }],
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
        variants: [{ name: 'Default', sku: 'PERCENT', stock: 10 }],
      });

      expect(product.discountPercentage).toBe(25);
    });
  });

  describe('Images and Variants', () => {
    it('should store variant images', async () => {
      const product = await ProductModel.create({
        name: 'Product with Images',
        slug: 'with-images',
        description: 'Description',
        price: 10,
        variants: [
          {
            name: 'Default',
            sku: 'IMG-001',
            stock: 5,
            images: [
              { url: 'https://example.com/img1.jpg', isPrimary: true },
              { url: 'https://example.com/img2.jpg', alt: 'Alt text' },
            ],
          },
        ],
      });

      expect(product.variants[0].images).toHaveLength(2);
      expect(product.variants[0].images[0].isPrimary).toBe(true);
      expect(product.variants[0].images[1].alt).toBe('Alt text');
    });

    it('should store product variants', async () => {
      const product = await ProductModel.create({
        name: 'Product with Variants',
        slug: 'with-variants',
        description: 'Description',
        price: 10,
        variants: [
          { name: 'Small', sku: 'VAR-001-S', stock: 5 },
          { name: 'Large', sku: 'VAR-001-L', stock: 3 },
        ],
      });

      expect(product.variants).toHaveLength(2);
      expect(product.variants[0].name).toBe('Small');
      expect(product.variants[1].stock).toBe(3);
    });
  });

  describe('Categories and Tags', () => {
    it('should store categories and tags', async () => {
      const product = await ProductModel.create({
        name: 'Categorized Product',
        slug: 'categorized',
        description: 'Description',
        price: 10,
        variants: [{ name: 'Default', sku: 'CAT-001', stock: 5 }],
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
