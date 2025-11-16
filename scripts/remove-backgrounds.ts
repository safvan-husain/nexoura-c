import { removeBackground } from '@imgly/background-removal-node';
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';

const INPUT_DIR = path.join(process.cwd(), 'public', 'images');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'no-bg');

async function processImage(inputPath: string, outputPath: string) {
  try {
    console.log(`Processing: ${path.basename(inputPath)}...`);
    
    // Convert Windows path to file URL
    const fileUrl = pathToFileURL(inputPath).href;
    
    const blob = await removeBackground(fileUrl, {
      model: 'medium',
      output: {
        format: 'image/png',
        quality: 0.8,
        type: 'foreground',
      },
      progress: (key, current, total) => {
        if (key === 'fetch') {
          console.log(`  Downloading model: ${Math.round((current / total) * 100)}%`);
        }
      },
    });
    
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`✓ Completed: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`✗ Failed: ${path.basename(inputPath)}`, error);
  }
}

async function main() {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Get all image files
  const files = fs.readdirSync(INPUT_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });
  
  console.log(`Found ${files.length} images to process\n`);
  
  // Process images sequentially to avoid memory issues
  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const outputFileName = path.parse(file).name + '.png';
    const outputPath = path.join(OUTPUT_DIR, outputFileName);
    
    await processImage(inputPath, outputPath);
  }
  
  console.log(`\n✓ All images processed! Output saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);
