'use server'

import { revalidateTag } from 'next/cache'

export async function createProductAction(formData: FormData) {
  const productData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: parseFloat(formData.get('price') as string),
    images: JSON.parse(formData.get('images') as string || '[]'),
    stock: parseInt(formData.get('stock') as string || '0'),
    status: formData.get('status') || 'draft',
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })

  const data = await res.json()

  if (!res.ok) {
    return { error: data.error || 'Failed to create product' }
  }

  revalidateTag('products', 'max')
  return { success: true, data }
}

export async function updateProductAction(id: string, formData: FormData) {
  const productData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: parseFloat(formData.get('price') as string),
    images: JSON.parse(formData.get('images') as string || '[]'),
    stock: parseInt(formData.get('stock') as string || '0'),
    status: formData.get('status'),
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })

  const data = await res.json()

  if (!res.ok) {
    return { error: data.error || 'Failed to update product' }
  }

  revalidateTag('products', 'max')
  revalidateTag(`product-${id}`, 'max')
  return { success: true, data }
}

export async function deleteProductAction(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const data = await res.json()
    return { error: data.error || 'Failed to delete product' }
  }

  revalidateTag('products', 'max')
  return { success: true }
}
