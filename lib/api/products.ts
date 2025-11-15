import { cacheLife, cacheTag } from 'next/cache'

// Helper to get the base URL for server-side fetching
function getBaseUrl() {
  // In server components, use localhost directly
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  }
  // In client components, use relative URLs
  return ''
}

export async function getProducts(params?: {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
}) {
  'use cache'
  cacheTag('products')
  cacheLife('minutes')

  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.search) searchParams.set('search', params.search)
  if (params?.category) searchParams.set('category', params.category)
  if (params?.status) searchParams.set('status', params.status)

  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/api/products?${searchParams}`

  try {
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Failed to fetch products:', res.status, errorText)
      throw new Error(`Failed to fetch products: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export async function getProductById(id: string) {
  'use cache'
  cacheTag(`product-${id}`)
  cacheLife('minutes')

  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/api/products/${id}`

  try {
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Failed to fetch product:', res.status, errorText)
      throw new Error(`Failed to fetch product: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}
