'use server'

import { revalidateTag } from 'next/cache'

export async function createCategory(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    parent: formData.get('parent') as string || undefined,
    isActive: formData.get('isActive') === 'true',
    sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await res.json()

  if (res.ok) {
    revalidateTag('categories', 'max')
  }

  return { ok: res.ok, data: result }
}

export async function updateCategory(id: string, formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    parent: formData.get('parent') as string || undefined,
    isActive: formData.get('isActive') === 'true',
    sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await res.json()

  if (res.ok) {
    revalidateTag('categories', 'max')
  }

  return { ok: res.ok, data: result }
}

export async function deleteCategory(id: string, replacementCategoryId?: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/categories/${id}`)
  if (replacementCategoryId) {
    url.searchParams.set('replacementCategoryId', replacementCategoryId)
  }

  const res = await fetch(url.toString(), {
    method: 'DELETE',
  })

  const result = await res.json()

  if (res.ok) {
    revalidateTag('categories', 'max')
  }

  return { ok: res.ok, data: result }
}
