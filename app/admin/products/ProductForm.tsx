'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Variant {
  name: string
  sku: string
  stock: number
  images: { url: string; alt?: string; isPrimary: boolean }[]
  attributes?: Record<string, string>
}

interface ProductFormProps {
  product?: any
  mode: 'create' | 'edit'
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    price: product?.price || 0,
    compareAtPrice: product?.compareAtPrice || 0,
    status: product?.status || 'draft',
  })

  const [variants, setVariants] = useState<Variant[]>(
    product?.variants || [
      {
        name: 'Default',
        sku: '',
        stock: 0,
        images: [],
        attributes: {},
      },
    ]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'compareAtPrice' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleSlugGenerate = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setFormData((prev) => ({ ...prev, slug }))
  }

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    setVariants((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        name: `Variant ${prev.length + 1}`,
        sku: '',
        stock: 0,
        images: [],
        attributes: {},
      },
    ])
  }

  const removeVariant = (index: number) => {
    if (variants.length === 1) {
      alert('At least one variant is required')
      return
    }
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        ...formData,
        variants,
      }

      const url = mode === 'create' 
        ? '/api/products' 
        : `/api/products/${product._id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Card className="bg-red-50 border border-red-200">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      <Card>
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        
        <div className="space-y-4">
          <Input
            label="Product Name *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Premium Cotton T-Shirt"
          />

          <div className="flex gap-2">
            <Input
              label="Slug *"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              placeholder="e.g., premium-cotton-t-shirt"
              className="flex-1"
            />
            <div className="flex items-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleSlugGenerate}
              >
                Generate
              </Button>
            </div>
          </div>

          <Textarea
            label="Description *"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Detailed product description..."
          />

          <Textarea
            label="Short Description"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            rows={2}
            placeholder="Brief summary..."
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Pricing</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price *"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Compare at Price"
            name="compareAtPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.compareAtPrice}
            onChange={handleInputChange}
          />
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Variants</h2>
          <Button type="button" variant="secondary" onClick={addVariant}>
            + Add Variant
          </Button>
        </div>

        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Variant {index + 1}</h3>
                {variants.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeVariant(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Name *"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                  required
                  placeholder="e.g., Small / Red"
                />

                <Input
                  label="SKU *"
                  value={variant.sku}
                  onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                  required
                  placeholder="e.g., TSH-SM-RED"
                />

                <Input
                  label="Stock *"
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Status</h2>
        
        <Select
          label="Product Status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'archived', label: 'Archived' },
          ]}
        />
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/products')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
