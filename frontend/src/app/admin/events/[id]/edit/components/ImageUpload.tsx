"use client"

import { useState, useRef, ChangeEvent, DragEvent } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Trash2 } from "lucide-react"
import { resolveMediaUrl } from "@/lib/media"

interface ImageUploadProps {
  value?: string | File
  onChange: (url: string | File) => void
  label?: string
  placeholder?: string
}

export function ImageUpload({ value, onChange, label = "Tải lên hình ảnh", placeholder = "Chưa có hình ảnh" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (file: File) => {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file không được vượt quá 5MB")
      return
    }

    onChange(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleClear = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDelete = () => {
    handleClear()
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {value ? (
        <>
          <div className="relative">
            <img
              src={value instanceof File ? URL.createObjectURL(value) : resolveMediaUrl(value) || value}
              alt="Uploaded image"
              className="w-full h-48 object-contain rounded-lg border"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={false}
              >
                <Upload className="h-4 w-4 mr-1" />
                Đổi ảnh
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setConfirmOpen(true)}
                disabled={false}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Xóa
              </Button>
            </div>

            {confirmOpen && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="rounded-lg bg-white p-4 shadow-lg space-y-4 text-center">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Xóa ảnh này?</h3>
                    <p className="mt-1 text-xs text-gray-600">
                      Xóa ảnh này khỏi form.
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmOpen(false)}
                      disabled={false}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={false}
                    >
                      Đồng ý xóa
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            {placeholder}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={false}
            className="cursor-pointer"
          >
            Chọn file
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            PNG, JPG, GIF lên đến 5MB
          </p>
        </div>
      )}
    </div>
  )
}
