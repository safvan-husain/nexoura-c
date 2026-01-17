import { cacheLife, cacheTag } from 'next/cache'
import {
  getProducts as getProductsFromService,
  getProductById as getProductByIdFromService,
  getProductBySlug as getProductBySlugFromService
} from '@/lib/product/product.service'

export async function getProducts(params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
  minStock?: number
  maxStock?: number
  tag?: string
  sortBy?: 'name' | 'price' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}) {
  'use cache'
  cacheTag('products')
  cacheLife('minutes')

  try {
    // Call the service directly instead of fetching from our own API
    // This is more efficient and avoids localhost connection issues
    const result = await getProductsFromService({
      page: params?.page || 1,
      limit: params?.limit || 20,
      search: params?.search,
      status: params?.status as any,
      minStock: params?.minStock,
      maxStock: params?.maxStock,
      tag: params?.tag,
      sortBy: params?.sortBy || 'createdAt',
      sortOrder: params?.sortOrder || 'desc'
    })

    // Serialize the results to ensure they are plain objects
    // This converts MongoDB ObjectIds to strings and Dates to ISO strings
    return JSON.parse(JSON.stringify(result))
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export async function getProductById(id: string) {
  'use cache'
  cacheTag(`product-${id}`)
  cacheLife('minutes')

  try {
    const product = await getProductByIdFromService(id)
    return JSON.parse(JSON.stringify(product))
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export async function getProductBySlug(slug: string) {
  'use cache'
  cacheTag(`product-${slug}`)
  cacheLife('minutes')

  try {
    const product = await getProductBySlugFromService(slug)
    return JSON.parse(JSON.stringify(product))
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    throw error
  }
}
