'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  search?: string
  minPrice?: number
  maxPrice?: number
  status?: 'draft' | 'published' | 'archived'
  minStock?: number
  maxStock?: number
  sortBy: 'name' | 'price' | 'createdAt'
  sortOrder: 'asc' | 'desc'
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    status: (searchParams.get('status') as any) || 'published',
    minStock: searchParams.get('minStock') ? parseInt(searchParams.get('minStock')!) : undefined,
    maxStock: searchParams.get('maxStock') ? parseInt(searchParams.get('maxStock')!) : undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
  })

  const [isCollapsed, setIsCollapsed] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)
    onFilterChange(newFilters)

    // Update URL
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') {
        params.set(k, String(v))
      }
    })
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      search: '',
      status: 'published',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
    router.push('/', { scroll: false })
  }

  return (
    <div className={`bg-white rounded-lg shadow-md transition-all ${isCollapsed ? 'w-12' : 'w-64'}`}>
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full p-3 flex items-center justify-center border-b hover:bg-gray-50"
        aria-label={isCollapsed ? 'Expand filters' : 'Collapse filters'}
      >
        <svg
          className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>

      {!isCollapsed && (
        <div className="p-4 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {/* Search */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Search</label>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search products..."
              className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>


          {/* Status */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Status</label>
            <select
              value={filters.status || 'published'}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Min"
                className="w-1/2 px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Max"
                className="w-1/2 px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stock Range */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Stock Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minStock || ''}
                onChange={(e) => updateFilter('minStock', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Min"
                className="w-1/2 px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={filters.maxStock || ''}
                onChange={(e) => updateFilter('maxStock', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Max"
                className="w-1/2 px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">Date Created</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Sort Order</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => updateFilter('sortOrder', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}
