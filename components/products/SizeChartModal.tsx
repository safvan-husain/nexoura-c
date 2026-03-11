'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface SizeChartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const sizeData = [
    { size: 'XS', chest: 36, waist: 34, shoulder: 16, neck: 15, sleeve: 24, length: 27 },
    { size: 'S', chest: 38, waist: 36, shoulder: 17, neck: 16, sleeve: 24.5, length: 28 },
    { size: 'M', chest: 40, waist: 38, shoulder: 19, neck: 17, sleeve: 25, length: 29 },
    { size: 'L', chest: 42, waist: 40, shoulder: 19, neck: 17.5, sleeve: 25.5, length: 30 },
    { size: 'XL', chest: 44, waist: 42, shoulder: 20, neck: 18.5, sleeve: 26, length: 31 },
    { size: 'XXL', chest: 46, waist: 44, shoulder: 21, neck: 19, sleeve: 26.5, length: 32 },
    { size: '3XL', chest: 48, waist: 46, shoulder: 22, neck: 19.5, sleeve: 27, length: 33 },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-gray-900 font-sans">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-medium text-center flex-1">Shirt Size Chart</h2>
            <button
              onClick={onClose}
              className="absolute right-6 p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto p-6 flex-1">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-4 px-4 font-bold text-sm tracking-wider border-b border-gray-100">Size</th>
                  <th className="py-4 px-4 font-bold text-sm tracking-wider border-b border-gray-100">Chest</th>
                  <th className="py-4 px-4 font-bold text-sm tracking-wider border-b border-gray-100">Waist</th>
                  <th className="py-4 px-4 font-bold text-sm tracking-wider border-b border-gray-100">Shoulder</th>
                  <th className="py-4 px-4 font-bold text-sm tracking-wider border-b border-gray-100">Neck</th>
                  <th className="py-4 px-4 font-bold text-sm tracking-wider border-b border-gray-100">Sleeve Length</th>
                  <th className="py-4 px-4 font-bold text-sm tracking-wider border-b border-gray-100">Shirt Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sizeData.map((row) => (
                  <tr key={row.size} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm font-medium">{row.size}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{row.chest}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{row.waist}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{row.shoulder}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{row.neck}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{row.sleeve}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  )
}
