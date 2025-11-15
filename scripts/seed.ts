import 'reflect-metadata';
import { connectDB } from '@/lib/db/mongo-client';
import { UserModel } from '@/lib/models/user.model';
import { AdminModel } from '@/lib/models/admin.model';
import { CategoryModel } from '@/lib/models/category.model';
import { ProductModel } from '@/lib/models/product.model';

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...');
  await Promise.all([
    UserModel.deleteMany({}),
    AdminModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    ProductModel.deleteMany({}),
  ]);
  console.log('✅ Database cleared');
}

async function seedAdmins() {
  console.log('👤 Seeding admins...');
  
  const admins = [
    {
      email: 'admin@nexoura.com',
      password: 'Admin123!',
      name: 'Super Admin',
      role: 'super_admin',
      isActive: true,
    },
    {
      email: 'manager@nexoura.com',
      password: 'Manager123!',
      name: 'Store Manager',
      role: 'admin',
      isActive: true,
    },
  ];

  await AdminModel.create(admins);
  console.log(`✅ Created ${admins.length} admins`);
}

async function seedUsers() {
  console.log('👥 Seeding users...');
  
  const users = [
    {
      email: 'john.doe@example.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      isActive: true,
      isEmailVerified: true,
    },
    {
      email: 'jane.smith@example.com',
      password: 'Password123!',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1234567891',
      isActive: true,
      isEmailVerified: true,
    },
    {
      email: 'bob.wilson@example.com',
      password: 'Password123!',
      firstName: 'Bob',
      lastName: 'Wilson',
      isActive: true,
      isEmailVerified: false,
    },
  ];

  await UserModel.create(users);
  console.log(`✅ Created ${users.length} users`);
}

async function seedCategories() {
  console.log('📁 Seeding categories...');
  
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and accessories',
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home improvement and garden supplies',
      isActive: true,
      sortOrder: 3,
    },
    {
      name: 'Sports & Outdoors',
      slug: 'sports-outdoors',
      description: 'Sports equipment and outdoor gear',
      isActive: true,
      sortOrder: 4,
    },
    {
      name: 'Books',
      slug: 'books',
      description: 'Books and reading materials',
      isActive: true,
      sortOrder: 5,
    },
  ];

  const createdCategories = await CategoryModel.create(categories);
  console.log(`✅ Created ${createdCategories.length} categories`);
  
  return createdCategories;
}

async function seedProducts(categories: any[]) {
  console.log('📦 Seeding products...');
  
  const products = [
    {
      name: 'Wireless Bluetooth Headphones',
      slug: 'wireless-bluetooth-headphones',
      description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
      shortDescription: 'Premium wireless headphones with ANC',
      price: 199.99,
      compareAtPrice: 299.99,
      categories: [categories[0]._id], // Electronics
      tags: ['audio', 'wireless', 'bluetooth', 'headphones'],
      variants: [
        {
          name: 'Black / Standard',
          sku: 'WBH-BLK-STD',
          color: 'Black',
          size: 'Standard',
          price: 199.99,
          stock: 50,
          images: [
            { url: '/images/headphones-black.jpg', alt: 'Black Headphones', isPrimary: true }
          ],
          attributes: { color: 'Black', size: 'Standard' }
        },
        {
          name: 'Silver / Standard',
          sku: 'WBH-SLV-STD',
          color: 'Silver',
          size: 'Standard',
          price: 199.99,
          stock: 30,
          images: [
            { url: '/images/headphones-silver.jpg', alt: 'Silver Headphones', isPrimary: true }
          ],
          attributes: { color: 'Silver', size: 'Standard' }
        }
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
      categories: [categories[0]._id, categories[3]._id], // Electronics, Sports
      tags: ['smartwatch', 'fitness', 'health', 'wearable'],
      variants: [
        {
          name: 'Black / 42mm',
          sku: 'SFW-BLK-42',
          color: 'Black',
          size: '42mm',
          price: 249.99,
          stock: 40,
          images: [
            { url: '/images/watch-black-42.jpg', alt: 'Black 42mm Watch', isPrimary: true }
          ],
          attributes: { color: 'Black', size: '42mm' }
        },
        {
          name: 'Rose Gold / 38mm',
          sku: 'SFW-RG-38',
          color: 'Rose Gold',
          size: '38mm',
          price: 249.99,
          stock: 25,
          images: [
            { url: '/images/watch-rosegold-38.jpg', alt: 'Rose Gold 38mm Watch', isPrimary: true }
          ],
          attributes: { color: 'Rose Gold', size: '38mm' }
        }
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
      categories: [categories[1]._id], // Clothing
      tags: ['clothing', 'tshirt', 'cotton', 'casual'],
      variants: [
        {
          name: 'White / Small',
          sku: 'CCT-WHT-S',
          color: 'White',
          size: 'S',
          price: 24.99,
          stock: 100,
          images: [
            { url: '/images/tshirt-white.jpg', alt: 'White T-Shirt', isPrimary: true }
          ],
          attributes: { color: 'White', size: 'S' }
        },
        {
          name: 'White / Medium',
          sku: 'CCT-WHT-M',
          color: 'White',
          size: 'M',
          price: 24.99,
          stock: 120,
          images: [
            { url: '/images/tshirt-white.jpg', alt: 'White T-Shirt', isPrimary: true }
          ],
          attributes: { color: 'White', size: 'M' }
        },
        {
          name: 'Black / Medium',
          sku: 'CCT-BLK-M',
          color: 'Black',
          size: 'M',
          price: 24.99,
          stock: 80,
          images: [
            { url: '/images/tshirt-black.jpg', alt: 'Black T-Shirt', isPrimary: true }
          ],
          attributes: { color: 'Black', size: 'M' }
        },
        {
          name: 'Navy / Large',
          sku: 'CCT-NVY-L',
          color: 'Navy',
          size: 'L',
          price: 24.99,
          stock: 60,
          images: [
            { url: '/images/tshirt-navy.jpg', alt: 'Navy T-Shirt', isPrimary: true }
          ],
          attributes: { color: 'Navy', size: 'L' }
        }
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
      categories: [categories[2]._id], // Home & Garden
      tags: ['furniture', 'office', 'chair', 'ergonomic'],
      variants: [
        {
          name: 'Black / Standard',
          sku: 'EOC-BLK-STD',
          color: 'Black',
          size: 'Standard',
          price: 399.99,
          stock: 15,
          images: [
            { url: '/images/chair-black.jpg', alt: 'Black Office Chair', isPrimary: true }
          ],
          attributes: { color: 'Black', material: 'Mesh' }
        },
        {
          name: 'Gray / Standard',
          sku: 'EOC-GRY-STD',
          color: 'Gray',
          size: 'Standard',
          price: 399.99,
          stock: 10,
          images: [
            { url: '/images/chair-gray.jpg', alt: 'Gray Office Chair', isPrimary: true }
          ],
          attributes: { color: 'Gray', material: 'Fabric' }
        }
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
      categories: [categories[3]._id], // Sports & Outdoors
      tags: ['yoga', 'fitness', 'exercise', 'mat'],
      variants: [
        {
          name: 'Purple / Standard',
          sku: 'YMP-PUR-STD',
          color: 'Purple',
          size: 'Standard',
          price: 39.99,
          stock: 75,
          images: [
            { url: '/images/yoga-mat-purple.jpg', alt: 'Purple Yoga Mat', isPrimary: true }
          ],
          attributes: { color: 'Purple' }
        },
        {
          name: 'Blue / Standard',
          sku: 'YMP-BLU-STD',
          color: 'Blue',
          size: 'Standard',
          price: 39.99,
          stock: 60,
          images: [
            { url: '/images/yoga-mat-blue.jpg', alt: 'Blue Yoga Mat', isPrimary: true }
          ],
          attributes: { color: 'Blue' }
        },
        {
          name: 'Green / Standard',
          sku: 'YMP-GRN-STD',
          color: 'Green',
          size: 'Standard',
          price: 39.99,
          stock: 50,
          images: [
            { url: '/images/yoga-mat-green.jpg', alt: 'Green Yoga Mat', isPrimary: true }
          ],
          attributes: { color: 'Green' }
        }
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
      categories: [categories[4]._id], // Books
      tags: ['book', 'programming', 'javascript', 'education'],
      variants: [
        {
          name: 'Standard / Paperback',
          sku: 'CGJ-STD-PB',
          color: 'Standard',
          size: 'Paperback',
          price: 49.99,
          stock: 200,
          images: [
            { url: '/images/book-js-paperback.jpg', alt: 'JavaScript Book Paperback', isPrimary: true }
          ],
          attributes: { format: 'Paperback', pages: '650' }
        },
        {
          name: 'Standard / Hardcover',
          sku: 'CGJ-STD-HC',
          color: 'Standard',
          size: 'Hardcover',
          price: 69.99,
          stock: 50,
          images: [
            { url: '/images/book-js-hardcover.jpg', alt: 'JavaScript Book Hardcover', isPrimary: true }
          ],
          attributes: { format: 'Hardcover', pages: '650' }
        }
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
      categories: [categories[3]._id], // Sports & Outdoors
      tags: ['bottle', 'hydration', 'eco-friendly', 'insulated'],
      variants: [
        {
          name: 'Matte Black / 32oz',
          sku: 'SSWB-MBLK-32',
          color: 'Matte Black',
          size: '32oz',
          price: 29.99,
          stock: 90,
          images: [
            { url: '/images/bottle-matte-black.jpg', alt: 'Matte Black Bottle', isPrimary: true }
          ],
          attributes: { color: 'Matte Black', capacity: '32oz' }
        },
        {
          name: 'Ocean Blue / 32oz',
          sku: 'SSWB-BLU-32',
          color: 'Ocean Blue',
          size: '32oz',
          price: 29.99,
          stock: 70,
          images: [
            { url: '/images/bottle-blue.jpg', alt: 'Blue Bottle', isPrimary: true }
          ],
          attributes: { color: 'Ocean Blue', capacity: '32oz' }
        }
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
      categories: [categories[2]._id], // Home & Garden
      tags: ['lighting', 'desk', 'led', 'office'],
      variants: [
        {
          name: 'White / Standard',
          sku: 'LDL-WHT-STD',
          color: 'White',
          size: 'Standard',
          price: 45.99,
          stock: 35,
          images: [
            { url: '/images/lamp-white.jpg', alt: 'White Desk Lamp', isPrimary: true }
          ],
          attributes: { color: 'White' }
        },
        {
          name: 'Black / Standard',
          sku: 'LDL-BLK-STD',
          color: 'Black',
          size: 'Standard',
          price: 45.99,
          stock: 40,
          images: [
            { url: '/images/lamp-black.jpg', alt: 'Black Desk Lamp', isPrimary: true }
          ],
          attributes: { color: 'Black' }
        }
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
      categories: [categories[1]._id, categories[3]._id], // Clothing, Sports
      tags: ['shoes', 'running', 'sports', 'footwear'],
      variants: [
        {
          name: 'Black/Red / US 9',
          sku: 'RSP-BR-9',
          color: 'Black/Red',
          size: 'US 9',
          price: 129.99,
          stock: 20,
          images: [
            { url: '/images/shoes-black-red.jpg', alt: 'Black Red Running Shoes', isPrimary: true }
          ],
          attributes: { color: 'Black/Red', size: 'US 9' }
        },
        {
          name: 'White/Blue / US 10',
          sku: 'RSP-WB-10',
          color: 'White/Blue',
          size: 'US 10',
          price: 129.99,
          stock: 25,
          images: [
            { url: '/images/shoes-white-blue.jpg', alt: 'White Blue Running Shoes', isPrimary: true }
          ],
          attributes: { color: 'White/Blue', size: 'US 10' }
        },
        {
          name: 'Gray / US 11',
          sku: 'RSP-GRY-11',
          color: 'Gray',
          size: 'US 11',
          price: 129.99,
          stock: 15,
          images: [
            { url: '/images/shoes-gray.jpg', alt: 'Gray Running Shoes', isPrimary: true }
          ],
          attributes: { color: 'Gray', size: 'US 11' }
        }
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
      categories: [categories[0]._id], // Electronics
      tags: ['keyboard', 'mouse', 'wireless', 'computer'],
      variants: [
        {
          name: 'Black / Standard',
          sku: 'WKMC-BLK-STD',
          color: 'Black',
          size: 'Standard',
          price: 59.99,
          stock: 45,
          images: [
            { url: '/images/keyboard-mouse-black.jpg', alt: 'Black Keyboard Mouse', isPrimary: true }
          ],
          attributes: { color: 'Black' }
        }
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
    
    await seedAdmins();
    console.log('');
    
    await seedUsers();
    console.log('');
    
    const categories = await seedCategories();
    console.log('');
    
    await seedProducts(categories);
    console.log('');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Admins: 2 (admin@nexoura.com, manager@nexoura.com)');
    console.log('   - Users: 3 (john.doe@example.com, jane.smith@example.com, bob.wilson@example.com)');
    console.log('   - Categories: 5');
    console.log('   - Products: 10');
    console.log('\n🔑 Default passwords: Password123! (users), Admin123! (super admin), Manager123! (admin)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main();
