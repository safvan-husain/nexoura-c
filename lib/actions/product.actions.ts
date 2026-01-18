'use server'

import { updateTag, revalidateTag, revalidatePath } from 'next/cache'
import { createProduct, updateProduct, deleteProduct } from '@/lib/product/product.service'

export async function createProductAction(formData: FormData) {
  try {
    const productData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      images: JSON.parse(formData.get('images') as string || '[]'),
      stock: parseInt(formData.get('stock') as string || '0'),
      status: (formData.get('status') as any) || 'draft',
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      hasColors: formData.get('hasColors') === 'true',
      colors: JSON.parse(formData.get('colors') as string || '[]'),
      hasSizes: formData.get('hasSizes') === 'true',
      sizes: JSON.parse(formData.get('sizes') as string || '[]'),
    }

    console.log('[ProductAction] createProductAction calling service with images:', productData.images);

    const product = await createProduct(productData);

    updateTag('products')
    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/products')

    // Serialize to plain object to avoid Maximum call stack size exceeded on RSC pass-back
    return { success: true, data: JSON.parse(JSON.stringify(product)) }
  } catch (error: any) {
    console.error('[ProductAction] createProductAction error:', error);
    return { error: error.message || 'Failed to create product' }
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  try {
    const productData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      images: JSON.parse(formData.get('images') as string || '[]'),
      stock: parseInt(formData.get('stock') as string || '0'),
      status: formData.get('status') as any,
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      hasColors: formData.get('hasColors') === 'true',
      colors: JSON.parse(formData.get('colors') as string || '[]'),
      hasSizes: formData.get('hasSizes') === 'true',
      sizes: JSON.parse(formData.get('sizes') as string || '[]'),
    }

    console.log('[ProductAction] updateProductAction calling service for ID', id);

    const product = await updateProduct(id, productData);

    updateTag('products')
    updateTag(`product-${id}`)
    if (product.slug) {
      updateTag(`product-${product.slug}`)
    }

    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath(`/products/${product.slug}`)

    // Serialize to plain object to avoid Maximum call stack size exceeded on RSC pass-back
    return { success: true, data: JSON.parse(JSON.stringify(product)) }
  } catch (error: any) {
    console.error('[ProductAction] updateProductAction error:', error);
    return { error: error.message || 'Failed to update product' }
  }
}

export async function deleteProductAction(id: string) {
  try {
    await deleteProduct(id);
    updateTag('products')
    updateTag(`product-${id}`)
    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/products')
    return { success: true }
  } catch (error: any) {
    console.error('[ProductAction] deleteProductAction error:', error);
    return { error: error.message || 'Failed to delete product' }
  }
}

