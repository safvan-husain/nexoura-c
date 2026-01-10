import { promises as fs } from 'fs'
import path from 'path'

export interface Product {
    _id: string
    name: string
    price: number
    compareAtPrice: number
    description: string
    shortDescription: string
    status: string
    images: {
        url: string
        alt: string
    }[]
    stock: number
}

export async function getProducts(): Promise<Product[]> {
    // Read images from public/images/no-bg folder
    const imagesDirectory = path.join(process.cwd(), 'public', 'images', 'no-bg')

    try {
        const imageFiles = await fs.readdir(imagesDirectory)

        // Filter only image files
        const validImageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif']
        const images = imageFiles.filter(file =>
            validImageExtensions.some(ext => file.toLowerCase().endsWith(ext))
        )

        if (images.length === 0) {
            return []
        }

        // Convert images to product format with placeholder data
        return images.map((filename, index) => {
            const cleanName = filename.replace(/\.(png|jpg|jpeg|webp|gif)$/i, '').replace(/[-_]/g, ' ')
            const price = Math.floor(Math.random() * 100) + 20

            return {
                _id: `img-${index}`,
                name: cleanName,
                price: price,
                compareAtPrice: price + Math.floor(Math.random() * 30) + 10,
                description: `This is a placeholder description for ${cleanName}. Product details would normally come from the database.`,
                shortDescription: `Preview of ${cleanName}`,
                status: 'published',
                stock: Math.floor(Math.random() * 50) + 5,
                images: [{
                    url: `/images/no-bg/${filename}`,
                    alt: filename
                }]
            }
        })
    } catch (error) {
        console.error('Error reading product images:', error)
        return []
    }
}
