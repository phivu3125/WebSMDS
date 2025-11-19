"use client"

import { useState, useCallback } from "react"
import { Upload, Camera, Image as ImageIcon } from "lucide-react"

interface ImageUploadScreenProps {
  onImageUpload: (imageDataUrl: string) => void
}

export default function ImageUploadScreen({ onImageUpload }: ImageUploadScreenProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 25 * 1024 * 1024 // 25MB

    if (!validTypes.includes(file.type)) {
      alert('Vui lòng chọn file ảnh (JPG, PNG, hoặc WebP)')
      return false
    }

    if (file.size > maxSize) {
      alert('Kích thước file không được vượt quá 25MB')
      return false
    }

    return true
  }

  const processImage = (file: File) => {
    if (!validateFile(file)) return

    setIsProcessing(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string
      setTimeout(() => {
        onImageUpload(imageDataUrl)
        setIsProcessing(false)
      }, 800)
    }

    reader.onerror = () => {
      alert('Không thể đọc file ảnh. Vui lòng thử lại.')
      setIsProcessing(false)
    }

    reader.readAsDataURL(file)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      processImage(files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processImage(files[0])
    }
  }

  const triggerFileInput = () => {
    document.getElementById('file-input')?.click()
  }

  return (
    <div className="p-8 sm:p-12">
      {/* Upload Area - Clean & Minimal */}
      <div
        className={`relative mx-auto max-w-xl overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragging
            ? ''
            : 'hover:scale-[1.01]'
        }`}
        style={{
          borderColor: isDragging ? '#aa7638' : '#b0987e',
          backgroundColor: isDragging ? '#c4b3a4' : '#f9f9f9',
          transform: isDragging ? 'scale(1.02)' : undefined
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isProcessing ? triggerFileInput : undefined}
      >
        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="p-16 text-center min-h-[400px] flex items-center justify-center">
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 animate-spin rounded-full border-3" style={{ borderColor: '#aa7638', borderTopColor: 'transparent' }}></div>
              <p style={{ color: '#723d2c' }}>Đang xử lý...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className={`h-20 w-20 rounded-full flex items-center justify-center transition-all ${
                  isDragging ? 'scale-110' : 'hover:scale-105'
                }`} style={{
                  backgroundColor: isDragging ? '#b0987e' : '#c4b3a4'
                }}>
                  <Upload className="h-10 w-10" style={{ color: '#723d2c' }} />
                </div>
              </div>
              <div>
                <p className="text-lg font-medium" style={{ color: '#723d2c' }}>
                  Kéo ảnh vào đây
                </p>
                <p className="text-sm mt-1" style={{ color: '#855923' }}>hoặc nhấn để chọn</p>
              </div>
              <div className="flex items-center space-x-2 text-xs" style={{ color: '#957048' }}>
                <div className="flex items-center">
                  <ImageIcon className="mr-1 h-3 w-3" />
                  JPG, PNG, WebP
                </div>
                <div>•</div>
                <div>Tối đa 25MB</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simple Info */}
      <div className="mt-8 text-center">
        <p className="text-sm" style={{ color: '#855923' }}>
          Chọn ảnh để áp dụng hiệu ứng tiền tệ lịch sử
        </p>
      </div>
    </div>
  )
}