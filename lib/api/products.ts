import { cacheLife, cacheTag } from 'next/cache'
import { getProducts as getProductsFromService, getProductById as getProductByIdFromService } from '@/lib/product/product.service'

export async function getProducts(params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
  minStock?: number
  maxStock?: number
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
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })

    // Transform to match the expected API response format if necessary
    // Our service already returns { products, pagination }
    return result
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
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

