'use server'

import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_token')?.value
}

export async function createProductAction(formData: FormData) {
  const token = await getAuthToken()
  
  if (!token) {
    return { error: 'Unauthorized' }
  }

  const productData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: parseFloat(formData.get('price') as string),
    variants: JSON.parse(formData.get('variants') as string),
    status: formData.get('status') || 'draft',
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  })

  const data = await res.json()

  if (!res.ok) {
    return { error: data.error || 'Failed to create product' }
  }

  revalidateTag('products')
  return { success: true, data }
}

export async function updateProductAction(id: string, formData: FormData) {
  const token = await getAuthToken()
  
  if (!token) {
    return { error: 'Unauthorized' }
  }

  const productData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: parseFloat(formData.get('price') as string),
    status: formData.get('status'),
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  })

  const data = await res.json()

  if (!res.ok) {
    return { error: data.error || 'Failed to update product' }
  }

  revalidateTag('products')
  revalidateTag(`product-${id}`)
  return { success: true, data }
}

export async function deleteProductAction(id: string) {
  const token = await getAuthToken()
  
  if (!token) {
    return { error: 'Unauthorized' }
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const data = await res.json()
    return { error: data.error || 'Failed to delete product' }
  }

  revalidateTag('products')
  return { success: true }
}
