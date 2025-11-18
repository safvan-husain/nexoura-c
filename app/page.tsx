import { Suspense } from 'react'
import { promises as fs } from 'fs'
import path from 'path'
import ProductViewer from './components/ProductViewer'

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ 
    productId?: string
  }>
}) {
  return (
    <div className="">
      <Suspense fallback={<ProductViewerLoading />}>
        <ProductViewerWrapper searchParamsPromise={searchParams} />
      </Suspense>
    </div>
  )
}

async function ProductViewerWrapper({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<any>
}) {
  const params = await searchParamsPromise
  const productId = params.productId
  
  // Read images from public/images/no-bg folder
  const imagesDirectory = path.join(process.cwd(), 'public', 'images', 'no-bg')
  const imageFiles = await fs.readdir(imagesDirectory)
  
  // Filter only image files
  const validImageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif']
  const images = imageFiles.filter(file => 
    validImageExtensions.some(ext => file.toLowerCase().endsWith(ext))
  )
  
  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No images found in the folder</p>
      </div>
    )
  }
  
  // Convert images to product format with placeholder data
  const products = images.map((filename, index) => {
    const cleanName = filename.replace(/\.(png|jpg|jpeg|webp|gif)$/i, '').replace(/[-_]/g, ' ')
    const price = Math.floor(Math.random() * 100) + 20
    
    return {
      _id: `img-${index}`,
      name: cleanName,
      price: price,
      compareAtPrice: price + Math.floor(Math.random() * 30) + 10,
      description: `This is a placeholder description for ${cleanName}. Product details would normally come from the database.`,
      shortDescription: `Preview of ${cleanName}`,
      category: 'Sample Category',
      status: 'published',
      variants: [{
        color: 'default',
        size: 'default',
        sku: `SKU-${String(index).padStart(4, '0')}`,
        price: price,
        stock: Math.floor(Math.random() * 50) + 5,
        images: [{
          url: `/images/no-bg/${filename}`,
          alt: filename
        }]
      }]
    }
  })

  const currentIndex = productId 
    ? products.findIndex((p: any) => p._id === productId)
    : 0
  
  return (
    <ProductViewer 
      products={products} 
      initialIndex={currentIndex >= 0 ? currentIndex : 0}
    />
  )
}

function ProductViewerLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading products...</div>
    </div>
  )
}
