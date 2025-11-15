'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { useState, useEffect } from 'react'

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [minStock, setMinStock] = useState(searchParams.get('minStock') || '')
  const [maxStock, setMaxStock] = useState(searchParams.get('maxStock') || '')
  const [showVariants, setShowVariants] = useState(searchParams.get('showVariants') === 'true')

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (showVariants) {
      params.set('showVariants', 'true')
    } else {
      params.delete('showVariants')
    }
    
    router.push(`/admin/products?${params.toString()}`)
  }, [showVariants])

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    
    if (minStock) {
      params.set('minStock', minStock)
    } else {
      params.delete('minStock')
    }
    
    if (maxStock) {
      params.set('maxStock', maxStock)
    } else {
      params.delete('maxStock')
    }
    
    params.set('page', '1')
    
    router.push(`/admin/products?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setStatus('')
    setMinStock('')
    setMaxStock('')
    setShowVariants(false)
    router.push('/admin/products')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </Select>

        <Input
          label="Min Stock"
          type="number"
          min="0"
          placeholder="0"
          value={minStock}
          onChange={(e) => setMinStock(e.target.value)}
        />

        <Input
          label="Max Stock"
          type="number"
          min="0"
          placeholder="Any"
          value={maxStock}
          onChange={(e) => setMaxStock(e.target.value)}
        />

        <div className="flex items-end">
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Switch
          label="Show individual variants"
          checked={showVariants}
          onChange={(e) => setShowVariants(e.target.checked)}
        />
        
        <Button variant="secondary" size="sm" onClick={handleClearFilters}>
          Clear All
        </Button>
      </div>
    </div>
  )
}
