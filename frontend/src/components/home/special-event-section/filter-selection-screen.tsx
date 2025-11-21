"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import type { CurrencyFilter } from "./index"

interface FilterSelectionScreenProps {
  uploadedImage: string
  currencies: CurrencyFilter[]
  onFilterSelect: (filter: CurrencyFilter) => void
  onBack: () => void
  isLoading?: boolean
  error?: string | null
}

export default function FilterSelectionScreen({
  uploadedImage,
  currencies,
  onFilterSelect,
  onBack,
  isLoading = false,
  error = null
}: FilterSelectionScreenProps) {
  const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null)

  const handleFilterSelect = (filter: CurrencyFilter) => {
    if (isLoading) return

    setSelectedFilterId(filter.id)
    onFilterSelect(filter)
  }

  return (
    <div className="p-8 sm:p-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 hover:opacity-80"
          style={{ color: '#855923' }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Quay lại</span>
        </button>
        <h3 className="text-xl font-medium" style={{ color: '#723d2c' }}>Chọn mẫu tiền</h3>
        <div className="w-16"></div>
      </div>

      {/* Image Preview */}
      <div className="mb-8">
        <div className="relative mx-auto max-w-sm overflow-hidden rounded-xl">
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="w-full h-auto"
          />

          {/* Processing Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(114, 61, 44, 0.7)' }}>
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#e7eef7', borderTopColor: 'transparent' }}></div>
                <p className="text-sm" style={{ color: '#e7eef7' }}>Đang xử lý...</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && !isLoading && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-90 p-3 text-white text-sm text-center">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-1 underline text-xs"
              >
                Thử lại
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Currency Grid */}
      <div className="max-w-2xl mx-auto">
        <p className="mb-6 text-center text-sm" style={{ color: '#855923' }}>
          Chọn mẫu tiền để áp dụng
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {currencies.map((currency) => (
            <button
              key={currency.id}
              onClick={() => handleFilterSelect(currency)}
              disabled={isLoading}
              className={`relative overflow-hidden rounded-lg border-2 p-3 text-center transition-all duration-200 ${
                selectedFilterId === currency.id
                  ? 'shadow-md'
                  : 'bg-white hover:scale-105'
              } ${isLoading && selectedFilterId !== currency.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              style={{
                borderColor: selectedFilterId === currency.id ? '#aa7638' : '#b0987e',
                backgroundColor: selectedFilterId === currency.id ? '#c4b3a4' : undefined
              }}
            >
              {/* Currency Image */}
              <div className="mb-2 aspect-[3/2] overflow-hidden rounded bg-gray-100">
                <img
                  src={`${process.env.NEXT_PUBLIC_GEMINI_API_URL || 'http://localhost:5000'}/samples/${currency.image}`}
                  alt={`${currency.name} - ${currency.year}`}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Currency Info */}
              <div className="space-y-1">
                <div className="text-lg font-bold" style={{ color: '#723d2c' }}>
                  {currency.name}
                </div>
                <div className="text-xs" style={{ color: '#855923' }}>
                  {currency.year}
                </div>
              </div>

              {/* Selected Indicator */}
              {selectedFilterId === currency.id && (
                <div className="absolute top-2 right-2 h-2 w-2 rounded-full" style={{ backgroundColor: '#aa7638' }}></div>
              )}

              {/* Processing Indicator */}
              {selectedFilterId === currency.id && isLoading && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                  <div className="h-6 w-6 animate-spin rounded-full border-2" style={{ borderColor: '#aa7638', borderTopColor: 'transparent' }}></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}