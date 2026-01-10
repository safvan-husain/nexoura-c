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
        images: [{ url: 'https://example.com/image.jpg', isPrimary: true }]
      };

      const product = await ProductModel.create(productData);

      expect(product.name).toBe(productData.name);
      expect(product.slug).toBe(productData.slug);
      expect(product.price).toBe(productData.price);
      expect(product.stock).toBe(100);
      expect(product.status).toBe('draft');
      expect(product.images).toHaveLength(1);
    });

    it('should fail with duplicate slug', async () => {
      await ProductModel.create({
        name: 'Product 1',
        slug: 'duplicate-slug',
        description: 'Description',
        price: 10,
        stock: 50,
      });

      await expect(
        ProductModel.create({
          name: 'Product 2',
          slug: 'duplicate-slug',
          description: 'Description',
          price: 20,
          stock: 30,
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
      });

      const outOfStock = await ProductModel.create({
        name: 'Out of Stock Product',
        slug: 'out-of-stock',
        description: 'Description',
        price: 10,
        stock: 0,
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
      });

      const noDiscount = await ProductModel.create({
        name: 'Regular Product',
        slug: 'regular',
        description: 'Description',
        price: 20,
        stock: 10,
      });

      expect(withDiscount.hasDiscount).toBe(true);
      expect(noDiscount.hasDiscount).toBe(false);
    });

    it('should correctly calculate discountPercentage', async () => {
      const product = await ProductModel.create({
        name: 'Product',
        slug: 'product-discount',
        description: 'Description',
        price: 75,
        compareAtPrice: 100,
        stock: 10,
      });

      expect(product.discountPercentage).toBe(25);
    });
  });

  describe('Images and Tags', () => {
    it('should store images', async () => {
      const product = await ProductModel.create({
        name: 'Product with Images',
        slug: 'with-images',
        description: 'Description',
        price: 10,
        stock: 5,
        images: [
          { url: 'https://example.com/img1.jpg', isPrimary: true },
          { url: 'https://example.com/img2.jpg', alt: 'Alt text' },
        ],
      });

      expect(product.images).toHaveLength(2);
      expect(product.images[0].isPrimary).toBe(true);
      expect(product.images[1].alt).toBe('Alt text');
    });

    it('should store tags', async () => {
      const product = await ProductModel.create({
        name: 'Tagged Product',
        slug: 'tagged',
        description: 'Description',
        price: 10,
        stock: 5,
        tags: ['new', 'featured', 'sale'],
      });

      expect(product.tags).toHaveLength(3);
      expect(product.tags).toContain('featured');
    });
  });
});
