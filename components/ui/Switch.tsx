'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = '', label, checked, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only"
            checked={checked}
            {...props}
          />
          <div className={`w-11 h-6 rounded-full transition-colors ${
            checked ? 'bg-blue-600' : 'bg-gray-300'
          }`}></div>
          <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'transform translate-x-5' : ''
          }`}></div>
        </div>
        {label && (
          <span className="text-sm font-medium text-gray-700">
            {label}
          </span>
        )}
      </label>
    )
  }
)

Switch.displayName = 'Switch'
