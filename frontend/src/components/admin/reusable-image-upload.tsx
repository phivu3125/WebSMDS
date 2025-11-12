"use client"

import { useState, useRef, ChangeEvent, DragEvent } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Plus } from "lucide-react"
import Image from "next/image"

interface SingleImageUploadProps {
  value?: string | File
  onChange: (value: string | File | undefined) => void
  onRemove?: () => void
  label?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  showRemoveButton?: boolean
  accept?: string
}

interface MultipleImageUploadProps {
  values: (string | File)[]
  onChange: (values: (string | File)[]) => void
  onRemove?: (index: number) => void
  maxImages?: number
  label?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  accept?: string
}

interface AddImageButtonProps {
  onAdd: (file: File) => void
  maxImages?: number
  currentCount?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  accept?: string
  label?: string
}

type ImageUploadProps = SingleImageUploadProps | MultipleImageUploadProps | AddImageButtonProps

// Utility function for file validation
const validateImageFile = (file: File): string | null => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return "Chỉ cho phép file hình ảnh có định dạng: JPG, PNG, WebP"
  }

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return "Kích thước file không được vượt quá 5MB"
  }

  return null
}

// Single Image Upload Component
export function SingleImageUpload({
  value,
  onChange,
  onRemove,
  label = "Hình ảnh",
  placeholder = "Chưa có hình ảnh",
  size = 'md',
  className = '',
  disabled = false,
  showRemoveButton = true,
  accept = "image/*"
}: SingleImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: { container: 'w-24 h-24', icon: 'h-6 w-6', button: 'h-5 w-5 top-0 right-0 rounded-full' },
    md: { container: 'w-32 h-32', icon: 'h-8 w-8', button: 'h-6 w-6 top-0 right-0 rounded-full' },
    lg: { container: 'w-full h-48', icon: 'h-12 w-12', button: 'h-6 w-6 top-0 right-0 rounded-full' }
  }

  const handleFileSelect = async (file: File) => {
    const error = validateImageFile(file)
    if (error) {
      alert(error)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    onChange(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleRemove = () => {
    onChange(undefined)
    if (onRemove) onRemove()
  }

  const getImageSrc = () => {
    if (!value) return null
    return value instanceof File ? URL.createObjectURL(value) : value
  }

  const imageSrc = getImageSrc()

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {imageSrc ? (
          <div className={`relative ${sizeClasses[size].container} rounded-lg overflow-hidden border`}>
            <Image
              src={imageSrc}
              alt="Uploaded image"
              fill
              className="object-contain"
              sizes="100vw"
            />
            {showRemoveButton && !disabled && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className={`absolute ${sizeClasses[size].button} p-0 cursor-pointer`}
                onClick={handleRemove}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
              disabled
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : dragActive
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            } ${size === 'lg' ? 'p-6' : 'p-4'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled}
            />
            <Upload className={`mx-auto text-gray-400 ${sizeClasses[size].icon} mb-2`} />
            <p className="text-sm text-gray-600 mb-1">{placeholder}</p>
            <p className="text-xs text-gray-500">JPG, PNG, WebP ≤5MB</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Multiple Images Upload Component
export function MultipleImageUpload({
  values,
  onChange,
  onRemove,
  maxImages = 10,
  label = "Hình ảnh",
  placeholder = "Thêm hình ảnh",
  size = 'md',
  className = '',
  disabled = false,
  accept = "image/*"
}: MultipleImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: { container: 'w-20 h-20', button: 'h-5 w-5 -top-2 -right-1 rounded-full' },
    md: { container: 'w-24 h-24', button: 'h-6 w-6 -top-2 -right-1 rounded-full' },
    lg: { container: 'w-32 h-32', button: 'h-6 w-6 -top-2 -right-1 rounded-full' }
  }

  const handleFileSelect = async (file: File) => {
    const error = validateImageFile(file)
    if (error) {
      alert(error)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    if (values.length >= maxImages) {
      alert(`Tối đa ${maxImages} ảnh`)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    onChange([...values, file])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleRemoveImage = (index: number) => {
    const newValues = values.filter((_, i) => i !== index)
    onChange(newValues)
    if (onRemove) onRemove(index)
  }

  const getImageSrc = (value: string | File) => {
    return value instanceof File ? URL.createObjectURL(value) : value
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {values.map((value, index) => (
          <div key={index} className={`relative ${sizeClasses[size].container} rounded-lg overflow-hidden border`}>
            <Image
              src={getImageSrc(value)}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className={`absolute ${sizeClasses[size].button} p-0`}
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}

        {values.length < maxImages && !disabled && (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-center">
              <Plus className="mx-auto h-6 w-6 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">{placeholder}</span>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">JPG, PNG, WebP ≤5MB (tối đa {maxImages} ảnh)</p>
    </div>
  )
}

// Add Image Button Component (for inline usage like in headers)
export function AddImageButton({
  onAdd,
  maxImages,
  currentCount = 0,
  size = 'md',
  className = '',
  disabled = false,
  accept = "image/*",
  label = "Thêm ảnh"
}: AddImageButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    const error = validateImageFile(file)
    if (error) {
      alert(error)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    if (maxImages && currentCount >= maxImages) {
      alert(`Tối đa ${maxImages} ảnh`)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    onAdd(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className="cursor-pointer"
      >
        <Upload className="h-4 w-4 mr-1" />
        {label}
        {maxImages && <span className="ml-1 text-xs">({currentCount}/{maxImages})</span>}
      </Button>
    </div>
  )
}

// Export a unified component that can handle different modes
export function ImageUpload(props: ImageUploadProps) {
  if ('values' in props) {
    return <MultipleImageUpload {...props} />
  } else if ('onAdd' in props) {
    return <AddImageButton {...props} />
  } else {
    return <SingleImageUpload {...props} />
  }
}

export default ImageUpload
