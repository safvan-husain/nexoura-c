'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Variant {
  name: string
  sku: string
  color: string
  size: string
  price: number
  stock: number
  images: { url: string; alt?: string; isPrimary: boolean }[]
  attributes?: Record<string, string>
}

interface VariantCombination {
  color: string
  size: string
  price: number
  stock: number
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

  // Fixed color and size options
  const [colors, setColors] = useState<string[]>([''])
  const [sizes, setSizes] = useState<string[]>([''])
  
  // Store price and stock for each combination
  const [variantCombinations, setVariantCombinations] = useState<Record<string, VariantCombination>>({})

  // Initialize from existing product
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const uniqueColors = [...new Set(product.variants.map((v: Variant) => v.color))].filter((c): c is string => typeof c === 'string')
      const uniqueSizes = [...new Set(product.variants.map((v: Variant) => v.size))].filter((s): s is string => typeof s === 'string')
      
      setColors(uniqueColors.length > 0 ? uniqueColors : [''])
      setSizes(uniqueSizes.length > 0 ? uniqueSizes : [''])
      
      const combinations: Record<string, VariantCombination> = {}
      product.variants.forEach((v: Variant) => {
        const key = `${v.color}-${v.size}`
        combinations[key] = {
          color: v.color,
          size: v.size,
          price: v.price,
          stock: v.stock,
        }
      })
      setVariantCombinations(combinations)
    }
  }, [product])

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

  // Color management
  const addColor = () => {
    setColors([...colors, ''])
  }

  const removeColor = (index: number) => {
    if (colors.length === 1) {
      alert('At least one color is required')
      return
    }
    const newColors = colors.filter((_, i) => i !== index)
    setColors(newColors)
  }

  const updateColor = (index: number, value: string) => {
    const newColors = [...colors]
    newColors[index] = value
    setColors(newColors)
  }

  // Size management
  const addSize = () => {
    setSizes([...sizes, ''])
  }

  const removeSize = (index: number) => {
    if (sizes.length === 1) {
      alert('At least one size is required')
      return
    }
    const newSizes = sizes.filter((_, i) => i !== index)
    setSizes(newSizes)
  }

  const updateSize = (index: number, value: string) => {
    const newSizes = [...sizes]
    newSizes[index] = value
    setSizes(newSizes)
  }

  // Update variant combination data
  const updateCombination = (color: string, size: string, field: 'price' | 'stock', value: number) => {
    const key = `${color}-${size}`
    setVariantCombinations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        color,
        size,
        [field]: value,
      },
    }))
  }

  // Generate all combinations
  const generateVariants = (): Variant[] => {
    const variants: Variant[] = []
    const validColors = colors.filter(c => c && c.trim() !== '')
    const validSizes = sizes.filter(s => s && s.trim() !== '')

    validColors.forEach((color) => {
      validSizes.forEach((size) => {
        const key = `${color}-${size}`
        const combination = variantCombinations[key] || { color, size, price: formData.price, stock: 0 }
        
        variants.push({
          name: `${color} / ${size}`,
          sku: `${formData.slug || 'product'}-${color.toLowerCase().replace(/\s+/g, '-')}-${size.toLowerCase().replace(/\s+/g, '-')}`,
          color: color.trim(),
          size: size.trim(),
          price: Number(combination.price) || 0,
          stock: Number(combination.stock) || 0,
          images: [],
          attributes: {},
        })
      })
    })

    return variants
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Validate colors and sizes
      const validColors = colors.filter(c => c.trim() !== '')
      const validSizes = sizes.filter(s => s.trim() !== '')

      if (validColors.length === 0) {
        throw new Error('At least one color is required')
      }

      if (validSizes.length === 0) {
        throw new Error('At least one size is required')
      }

      // Generate variants from combinations
      const generatedVariants = generateVariants()

      const payload = {
        ...formData,
        variants: generatedVariants,
      }

      const url = mode === 'create' 
        ? '/api/products' 
        : `/api/products/${product._id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'

      console.log('Submitting payload:', JSON.stringify(payload, null, 2))

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Validation error details:', data)
        const errorMsg = data.details 
          ? `${data.error}: ${JSON.stringify(data.details, null, 2)}`
          : data.error || 'Failed to save product'
        throw new Error(errorMsg)
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
        <h2 className="text-xl font-semibold mb-4">Colors & Sizes</h2>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Colors Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Colors</h3>
              <Button type="button" variant="secondary" size="sm" onClick={addColor}>
                + Add Color
              </Button>
            </div>
            <div className="space-y-2">
              {colors.map((color, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    placeholder="e.g., Red, Blue, Black"
                    required
                  />
                  {colors.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeColor(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sizes Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Sizes</h3>
              <Button type="button" variant="secondary" size="sm" onClick={addSize}>
                + Add Size
              </Button>
            </div>
            <div className="space-y-2">
              {sizes.map((size, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={size}
                    onChange={(e) => updateSize(index, e.target.value)}
                    placeholder="e.g., S, M, L, XL"
                    required
                  />
                  {sizes.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeSize(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Variant Combinations</h2>
        <p className="text-sm text-gray-600 mb-4">
          Set price and stock for each color/size combination. SKUs will be auto-generated.
        </p>
        
        <div className="space-y-3">
          {colors.filter(c => c.trim() !== '').map((color) => (
            sizes.filter(s => s.trim() !== '').map((size) => {
              const key = `${color}-${size}`
              const combination = variantCombinations[key] || { color, size, price: formData.price, stock: 0 }
              
              return (
                <div key={key} className="border rounded-lg p-3 bg-gray-50">
                  <div className="grid grid-cols-4 gap-3 items-center">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Variant</label>
                      <p className="text-sm font-semibold">{color} / {size}</p>
                    </div>
                    
                    <Input
                      label="Price *"
                      type="number"
                      step="0.01"
                      min="0"
                      value={combination.price ?? formData.price}
                      onChange={(e) => updateCombination(color, size, 'price', parseFloat(e.target.value) || 0)}
                      required
                    />
                    
                    <Input
                      label="Stock *"
                      type="number"
                      min="0"
                      value={combination.stock ?? 0}
                      onChange={(e) => updateCombination(color, size, 'stock', parseInt(e.target.value) || 0)}
                      required
                    />
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">SKU (auto)</label>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.slug || 'product'}-{color.toLowerCase().replace(/\s+/g, '-')}-{size.toLowerCase().replace(/\s+/g, '-')}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
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
