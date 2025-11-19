"use client"

import { useState } from "react"
import { ArrowLeft, Download, RotateCcw, Eye, EyeOff } from "lucide-react"
import type { CurrencyFilter } from "./index"

interface ResultScreenProps {
  originalImage: string
  processedImage: string
  selectedFilter: CurrencyFilter
  onRestart: () => void
  onBack: () => void
}

export default function ResultScreen({
  originalImage,
  processedImage,
  selectedFilter,
  onRestart,
  onBack
}: ResultScreenProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // Fetch the image first
      const response = await fetch(processedImage)
      const blob = await response.blob()

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob)

      // Create download link
      const link = document.createElement('a')
      link.href = blobUrl

      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `currency-filter-${selectedFilter.name.replace('₫', 'VND')}-${timestamp}.jpg`

      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Không thể tải ảnh xuống. Vui lòng thử lại.')
    } finally {
      setIsDownloading(false)
    }
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
        <h3 className="text-xl font-medium" style={{ color: '#723d2c' }}>Kết quả</h3>
        <div className="w-16"></div>
      </div>

      {/* Main Image Display */}
      <div className="mb-8">
        <div className="relative mx-auto max-w-md">
          {/* Flip Container */}
          <div
            className="relative h-full w-full transition-transform duration-700"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front - Processed Image */}
            <div
              className="relative overflow-hidden rounded-xl"
              style={{
                backfaceVisibility: 'hidden',
                position: isFlipped ? 'absolute' : 'relative'
              }}
            >
              <img
                src={processedImage}
                alt="Processed"
                className="w-full h-auto"
              />

              {/* Filter Badge */}
              <div className="absolute top-4 right-4 rounded-lg px-3 py-1 text-sm" style={{ backgroundColor: 'rgba(170, 118, 56, 0.9)', color: '#e7eef7' }}>
                {selectedFilter.name}
              </div>
            </div>

            {/* Back - Original Image */}
            <div
              className="relative overflow-hidden rounded-xl"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                position: isFlipped ? 'relative' : 'absolute'
              }}
            >
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-auto"
              />

              {/* Original Badge */}
              <div className="absolute top-4 right-4 rounded-lg px-3 py-1 text-sm" style={{ backgroundColor: 'rgba(149, 112, 72, 0.9)', color: '#e7eef7' }}>
                Gốc
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center justify-center space-x-2 rounded-lg px-4 py-2 text-sm hover:opacity-80"
            style={{ backgroundColor: '#c4b3a4', color: '#723d2c' }}
          >
            {isFlipped ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{isFlipped ? 'Xem kết quả' : 'Xem ảnh gốc'}</span>
          </button>
        </div>
      </div>

      {/* Filter Info */}
      <div className="mb-8 text-center">
        <p className="text-lg font-medium" style={{ color: '#723d2c' }}>
          Đã áp dụng bộ lọc {selectedFilter.name}
        </p>
        <p className="text-sm" style={{ color: '#855923' }}>
          Năm phát hành {selectedFilter.year}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-3 max-w-xs mx-auto">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-center space-x-2 rounded-lg px-6 py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#aa7638', color: '#e7eef7' }}
        >
          {isDownloading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: '#e7eef7', borderTopColor: 'transparent' }}></div>
              <span>Đang tải...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Tải về máy</span>
            </>
          )}
        </button>

        <button
          onClick={onRestart}
          className="flex items-center justify-center space-x-2 rounded-lg px-6 py-3 font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#c4b3a4', color: '#723d2c' }}
        >
          <RotateCcw className="h-4 w-4" />
          <span>Bắt đầu lại</span>
        </button>
      </div>
    </div>
  )
}