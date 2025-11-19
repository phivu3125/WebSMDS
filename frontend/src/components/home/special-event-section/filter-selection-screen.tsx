"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import type { CurrencyFilter } from "./index"

interface FilterSelectionScreenProps {
  uploadedImage: string
  currencies: CurrencyFilter[]
  onFilterSelect: (filter: CurrencyFilter) => void
  onBack: () => void
}

export default function FilterSelectionScreen({
  uploadedImage,
  currencies,
  onFilterSelect,
  onBack
}: FilterSelectionScreenProps) {
  const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFilterSelect = (filter: CurrencyFilter) => {
    if (isProcessing) return

    setSelectedFilterId(filter.id)
    setIsProcessing(true)

    setTimeout(() => {
      onFilterSelect(filter)
    }, 2000)
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
        <h3 className="text-xl font-medium" style={{ color: '#723d2c' }}>Chọn mệnh giá</h3>
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
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(114, 61, 44, 0.7)' }}>
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#e7eef7', borderTopColor: 'transparent' }}></div>
                <p className="text-sm" style={{ color: '#e7eef7' }}>Đang xử lý...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Currency Grid */}
      <div className="max-w-2xl mx-auto">
        <p className="mb-6 text-center text-sm" style={{ color: '#855923' }}>
          Chọn mệnh giá tiền polymer để áp dụng
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {currencies.map((currency) => (
            <button
              key={currency.id}
              onClick={() => handleFilterSelect(currency)}
              disabled={isProcessing}
              className={`relative overflow-hidden rounded-lg border-2 p-3 text-center transition-all duration-200 ${
                selectedFilterId === currency.id
                  ? 'shadow-md'
                  : 'bg-white hover:scale-105'
              } ${isProcessing && selectedFilterId !== currency.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              style={{
                borderColor: selectedFilterId === currency.id ? '#aa7638' : '#b0987e',
                backgroundColor: selectedFilterId === currency.id ? '#c4b3a4' : undefined
              }}
            >
              {/* Currency Image */}
              <div className="mb-2 aspect-[3/2] overflow-hidden rounded">
                <img
                  src={currency.image}
                  alt={`${currency.name} - ${currency.year}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback to colored placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="h-full w-full flex items-center justify-center" style="background: linear-gradient(135deg, #aa7638 0%, #723d2c 100%);">
                        <div class="text-center">
                          <div class="text-white font-bold text-lg">${currency.value}</div>
                          <div class="text-white/80 text-xs">${currency.year}</div>
                        </div>
                      </div>
                    `;
                  }}
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
              {selectedFilterId === currency.id && isProcessing && (
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