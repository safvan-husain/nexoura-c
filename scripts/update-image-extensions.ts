import 'reflect-metadata';
import { connectDB } from '../lib/db/mongo-client';
import { ProductModel } from '../lib/models/product.model';

/**
 * Script to update all product and variant image URLs to use .png extension
 * 
 * Usage: npx tsx scripts/update-image-extensions.ts
 */

async function updateImageExtensions() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Fetch all products
    const products = await ProductModel.find({});
    console.log(`📦 Found ${products.length} products\n`);

    let updatedCount = 0;
    let totalImagesUpdated = 0;

    for (const product of products) {
      let productModified = false;

      // Update variant images
      for (const variant of product.variants) {
        if (variant.images && variant.images.length > 0) {
          for (const image of variant.images) {
            const oldUrl = image.url;
            
            // Replace extension with .png
            const newUrl = oldUrl.replace(/\.(jpg|jpeg|webp|gif|bmp)$/i, '.png');
            
            if (oldUrl !== newUrl) {
              image.url = newUrl;
              productModified = true;
              totalImagesUpdated++;
              console.log(`  📸 Updated: ${oldUrl} → ${newUrl}`);
            }
          }
        }
      }

      // Save if modified
      if (productModified) {
        await product.save();
        updatedCount++;
        console.log(`✅ Updated product: ${product.name} (${product.slug})\n`);
      }
    }

    console.log('\n🎉 Migration complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Products updated: ${updatedCount}`);
    console.log(`   - Total images updated: ${totalImagesUpdated}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating image extensions:', error);
    process.exit(1);
  }
}

updateImageExtensions();
