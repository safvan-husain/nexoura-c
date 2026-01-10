import 'reflect-metadata';
import { connectDB } from '../lib/db/mongo-client';
import { ProductModel } from '../lib/models/product.model';

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...');
  await ProductModel.deleteMany({});
  console.log('✅ Database cleared');
}

async function seedProducts() {
  console.log('📦 Seeding products...');

  const products = [
    {
      name: 'Wireless Bluetooth Headphones',
      slug: 'wireless-bluetooth-headphones',
      description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
      shortDescription: 'Premium wireless headphones with ANC',
      price: 199.99,
      compareAtPrice: 299.99,
      tags: ['audio', 'wireless', 'bluetooth', 'headphones'],
      stock: 80,
      images: [
        { url: '/images/headphones-black.jpg', alt: 'Black Headphones', isPrimary: true },
        { url: '/images/headphones-silver.jpg', alt: 'Silver Headphones', isPrimary: false }
      ],
      status: 'published',
      metadata: { featured: true, brand: 'AudioTech' }
    },
    {
      name: 'Smart Fitness Watch',
      slug: 'smart-fitness-watch',
      description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, sleep tracking, and 50+ sport modes. Water-resistant up to 50m.',
      shortDescription: 'Advanced fitness tracking smartwatch',
      price: 249.99,
      compareAtPrice: 349.99,
      tags: ['smartwatch', 'fitness', 'health', 'wearable'],
      stock: 65,
      images: [
        { url: '/images/watch-black-42.jpg', alt: 'Black 42mm Watch', isPrimary: true },
        { url: '/images/watch-rosegold-38.jpg', alt: 'Rose Gold 38mm Watch', isPrimary: false }
      ],
      status: 'published',
      metadata: { featured: true, brand: 'FitPro' }
    },
    {
      name: 'Classic Cotton T-Shirt',
      slug: 'classic-cotton-tshirt',
      description: 'Comfortable 100% organic cotton t-shirt with a classic fit. Soft, breathable, and perfect for everyday wear. Pre-shrunk and machine washable.',
      shortDescription: '100% organic cotton t-shirt',
      price: 24.99,
      tags: ['clothing', 'tshirt', 'cotton', 'casual'],
      stock: 360,
      images: [
        { url: '/images/tshirt-white.jpg', alt: 'White T-Shirt', isPrimary: true },
        { url: '/images/tshirt-black.jpg', alt: 'Black T-Shirt', isPrimary: false },
        { url: '/images/tshirt-navy.jpg', alt: 'Navy T-Shirt', isPrimary: false }
      ],
      status: 'published',
      metadata: { brand: 'EcoWear' }
    },
    {
      name: 'Ergonomic Office Chair',
      slug: 'ergonomic-office-chair',
      description: 'Premium ergonomic office chair with lumbar support, adjustable armrests, and breathable mesh back. Designed for all-day comfort and productivity.',
      shortDescription: 'Premium ergonomic office chair',
      price: 399.99,
      compareAtPrice: 599.99,
      tags: ['furniture', 'office', 'chair', 'ergonomic'],
      stock: 25,
      images: [
        { url: '/images/chair-black.jpg', alt: 'Black Office Chair', isPrimary: true },
        { url: '/images/chair-gray.jpg', alt: 'Gray Office Chair', isPrimary: false }
      ],
      status: 'published',
      metadata: { featured: true, brand: 'ComfortPro' }
    },
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'Extra thick 6mm yoga mat with non-slip surface and carrying strap. Made from eco-friendly TPE material. Perfect for yoga, pilates, and floor exercises.',
      shortDescription: 'Extra thick non-slip yoga mat',
      price: 39.99,
      compareAtPrice: 59.99,
      tags: ['yoga', 'fitness', 'exercise', 'mat'],
      stock: 185,
      images: [
        { url: '/images/yoga-mat-purple.jpg', alt: 'Purple Yoga Mat', isPrimary: true },
        { url: '/images/yoga-mat-blue.jpg', alt: 'Blue Yoga Mat', isPrimary: false },
        { url: '/images/yoga-mat-green.jpg', alt: 'Green Yoga Mat', isPrimary: false }
      ],
      status: 'published',
      metadata: { brand: 'ZenFit' }
    },
    {
      name: 'The Complete Guide to JavaScript',
      slug: 'complete-guide-javascript',
      description: 'Comprehensive guide covering JavaScript from basics to advanced concepts. Includes ES6+, async programming, and modern frameworks. Perfect for beginners and intermediate developers.',
      shortDescription: 'Comprehensive JavaScript programming guide',
      price: 49.99,
      tags: ['book', 'programming', 'javascript', 'education'],
      stock: 250,
      images: [
        { url: '/images/book-js-paperback.jpg', alt: 'JavaScript Book Paperback', isPrimary: true },
        { url: '/images/book-js-hardcover.jpg', alt: 'JavaScript Book Hardcover', isPrimary: false }
      ],
      status: 'published',
      metadata: { author: 'John Developer', isbn: '978-1234567890' }
    },
    {
      name: 'Stainless Steel Water Bottle',
      slug: 'stainless-steel-water-bottle',
      description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof, and eco-friendly. 32oz capacity.',
      shortDescription: 'Insulated stainless steel bottle',
      price: 29.99,
      tags: ['bottle', 'hydration', 'eco-friendly', 'insulated'],
      stock: 160,
      images: [
        { url: '/images/bottle-matte-black.jpg', alt: 'Matte Black Bottle', isPrimary: true },
        { url: '/images/bottle-blue.jpg', alt: 'Blue Bottle', isPrimary: false }
      ],
      status: 'published',
      metadata: { brand: 'HydroLife' }
    },
    {
      name: 'LED Desk Lamp',
      slug: 'led-desk-lamp',
      description: 'Modern LED desk lamp with adjustable brightness and color temperature. Touch control, USB charging port, and energy-efficient design.',
      shortDescription: 'Adjustable LED desk lamp with USB port',
      price: 45.99,
      tags: ['lighting', 'desk', 'led', 'office'],
      stock: 75,
      images: [
        { url: '/images/lamp-white.jpg', alt: 'White Desk Lamp', isPrimary: true },
        { url: '/images/lamp-black.jpg', alt: 'Black Desk Lamp', isPrimary: false }
      ],
      status: 'published',
      metadata: { brand: 'BrightSpace' }
    },
    {
      name: 'Running Shoes Pro',
      slug: 'running-shoes-pro',
      description: 'Professional running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole. Designed for long-distance runners.',
      shortDescription: 'Professional running shoes',
      price: 129.99,
      compareAtPrice: 179.99,
      tags: ['shoes', 'running', 'sports', 'footwear'],
      stock: 60,
      images: [
        { url: '/images/shoes-black-red.jpg', alt: 'Black Red Running Shoes', isPrimary: true },
        { url: '/images/shoes-white-blue.jpg', alt: 'White Blue Running Shoes', isPrimary: false },
        { url: '/images/shoes-gray.jpg', alt: 'Gray Running Shoes', isPrimary: false }
      ],
      status: 'published',
      metadata: { featured: true, brand: 'RunFast' }
    },
    {
      name: 'Wireless Keyboard & Mouse Combo',
      slug: 'wireless-keyboard-mouse-combo',
      description: 'Sleek wireless keyboard and mouse combo with 2.4GHz connection. Quiet keys, ergonomic design, and long battery life. Perfect for office or home use.',
      shortDescription: 'Wireless keyboard and mouse set',
      price: 59.99,
      tags: ['keyboard', 'mouse', 'wireless', 'computer'],
      stock: 45,
      images: [
        { url: '/images/keyboard-mouse-black.jpg', alt: 'Black Keyboard Mouse', isPrimary: true }
      ],
      status: 'published',
      metadata: { brand: 'TechKeys' }
    }
  ];

  await ProductModel.create(products);
  console.log(`✅ Created ${products.length} products`);
}

async function main() {
  try {
    console.log('🌱 Starting database seed...\n');

    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    await clearDatabase();
    console.log('');

    await seedProducts();
    console.log('');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Products: 10');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main();
