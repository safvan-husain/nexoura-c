'use client'

interface VariantFilterPanelProps {
  availableColors: string[]
  availableSizes: string[]
  selectedColor: string | null
  selectedSize: string | null
  currentVariant: any
  onColorSelect: (color: string | null) => void
  onSizeSelect: (size: string | null) => void
}

export default function VariantFilterPanel({
  availableColors,
  availableSizes,
  selectedColor,
  selectedSize,
  currentVariant,
  onColorSelect,
  onSizeSelect,
}: VariantFilterPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 h-[50vh] overflow-y-auto w-48">
      <h3 className="font-semibold text-sm mb-3">Filter Variants</h3>
      
      {/* Color Filter */}
      <div className="mb-4">
        <label className="block text-xs font-semibold mb-2 text-gray-700">Color</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onColorSelect(null)}
            className={`px-2 py-1 text-xs rounded transition-all ${
              selectedColor === null
                ? 'bg-blue-600 text-white ring-2 ring-blue-500'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {availableColors.map((color: string) => (
            <button
              key={color}
              onClick={() => onColorSelect(color)}
              className={`px-2 py-1 text-xs rounded transition-all ${
                selectedColor === color
                  ? 'bg-blue-600 text-white ring-2 ring-blue-500'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
      
      {/* Size Filter */}
      <div className="mb-4">
        <label className="block text-xs font-semibold mb-2 text-gray-700">Size</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSizeSelect(null)}
            className={`px-2 py-1 text-xs rounded transition-all ${
              selectedSize === null
                ? 'bg-blue-600 text-white ring-2 ring-blue-500'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {availableSizes.map((size: string) => (
            <button
              key={size}
              onClick={() => onSizeSelect(size)}
              className={`px-2 py-1 text-xs rounded transition-all ${
                selectedSize === size
                  ? 'bg-blue-600 text-white ring-2 ring-blue-500'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      {/* Current Variant Info */}
      {currentVariant && (
        <div className="pt-3 border-t">
          <p className="text-xs font-semibold mb-2">Current Selection:</p>
          <div className="space-y-1 text-xs">
            <p><span className="font-medium">Color:</span> {currentVariant.color || 'N/A'}</p>
            <p><span className="font-medium">Size:</span> {currentVariant.size || 'N/A'}</p>
            <p><span className="font-medium">Price:</span> ${currentVariant.price?.toFixed(2) || '0.00'}</p>
            <p><span className="font-medium">Stock:</span> {currentVariant.stock ?? 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
