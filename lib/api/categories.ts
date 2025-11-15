import { cacheLife, cacheTag } from 'next/cache'

export async function getCategories(params?: {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}) {
  'use cache'
  cacheTag('categories')
  cacheLife('hours')

  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.search) searchParams.set('search', params.search)
  if (params?.isActive !== undefined) searchParams.set('isActive', params.isActive.toString())

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/categories?${searchParams}`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch categories')
  }

  return res.json()
}
