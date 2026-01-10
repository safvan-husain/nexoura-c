import 'reflect-metadata';
import { connectDB } from '../lib/db/mongo-client';
import { ProductModel } from '../lib/models/product.model';

async function seedClothingProducts() {
    console.log('📦 Seeding clothing products...');

    const products = [
        {
            name: 'Premium Oversized Hoodie',
            slug: 'premium-oversized-hoodie',
            description: 'A heavyweight, premium cotton hoodie with a relaxed, oversized fit. Perfect for a cozy yet stylish streetwear look.',
            shortDescription: 'Heavyweight premium cotton hoodie',
            price: 89.99,
            compareAtPrice: 119.99,
            tags: ['clothing', 'hoodie', 'streetwear', 'premium'],
            stock: 50,
            images: [
                { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800', alt: 'Black Oversized Hoodie', isPrimary: true }
            ],
            status: 'published',
            metadata: { brand: 'Nexoura', category: 'Tops' }
        },
        {
            name: 'Vintage Graphic Tee',
            slug: 'vintage-graphic-tee',
            description: 'Subtly distressed graphic tee made from 100% organic cotton. Features a unique vintage-inspired print on the chest.',
            shortDescription: '100% organic cotton graphic tee',
            price: 34.99,
            compareAtPrice: 45.00,
            tags: ['clothing', 't-shirt', 'vintage', 'organic'],
            stock: 120,
            images: [
                { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', alt: 'Vintage White Graphic Tee', isPrimary: true }
            ],
            status: 'published',
            metadata: { brand: 'Nexoura', category: 'Tops' }
        },
        {
            name: 'Classic Denim Jacket',
            slug: 'classic-denim-jacket',
            description: 'The timeless denim jacket, crafted from durable 14oz denim with a slightly worn-in feel. A versatile piece for every season.',
            shortDescription: 'Timeless 14oz denim jacket',
            price: 129.99,
            tags: ['clothing', 'jacket', 'denim', 'outerwear'],
            stock: 35,
            images: [
                { url: 'https://images.unsplash.com/photo-1542272454315-4c01d7afdf16?auto=format&fit=crop&q=80&w=800', alt: 'Classic Blue Denim Jacket', isPrimary: true }
            ],
            status: 'published',
            metadata: { brand: 'Nexoura', category: 'Outerwear' }
        },
        {
            name: 'Modern Slim-Fit Jeans',
            slug: 'modern-slim-fit-jeans',
            description: 'Slim-fit jeans with a touch of stretch for all-day comfort. Designed with a clean, dark indigo wash that works from day to night.',
            shortDescription: 'Comfortable dark indigo slim-fit jeans',
            price: 79.99,
            compareAtPrice: 99.99,
            tags: ['clothing', 'jeans', 'denim', 'bottoms'],
            stock: 85,
            images: [
                { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800', alt: 'Dark Indigo Slim-Fit Jeans', isPrimary: true }
            ],
            status: 'published',
            metadata: { brand: 'Nexoura', category: 'Bottoms' }
        },
        {
            name: 'Minimalist Trench Coat',
            slug: 'minimalist-trench-coat',
            description: 'A sophisticated trench coat featuring a streamlined silhouette and water-repellent finish. The ultimate layering piece for the modern professional.',
            shortDescription: 'Sophisticated water-repellent trench coat',
            price: 249.99,
            compareAtPrice: 320.00,
            tags: ['clothing', 'coat', 'minimalist', 'outerwear'],
            stock: 20,
            images: [
                { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800', alt: 'Beige Minimalist Trench Coat', isPrimary: true }
            ],
            status: 'published',
            metadata: { brand: 'Nexoura', category: 'Outerwear' }
        }
    ];

    await ProductModel.create(products);
    console.log(`✅ Created ${products.length} clothing products`);
}

async function main() {
    try {
        console.log('🌱 Starting clothing database seed...\n');
        await connectDB();
        console.log('✅ Connected to MongoDB\n');

        // We don't clear the database here because we might want to keep other products
        // But if the user wants only these 5, they should clear it first.
        // I'll keep it simple and just add them.

        await seedClothingProducts();
        console.log('\n🎉 Clothing database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

main();
