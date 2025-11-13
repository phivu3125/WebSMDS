"use client"

import React from "react"
import Link from "next/link"
import { DataTable } from "@/components/admin/DataTable"
import { useApiCall } from "@/hooks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, ExternalLink, Star, Image as ImageIcon } from "lucide-react"
import { getPress, deletePress, updatePress } from "@/lib/api/press"

// Type definitions for Press items
interface PressItem {
  id: number
  title: string
  description: string
  link: string
  source: string
  date: string
  image?: string
  type: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

const typeLabels: Record<string, string> = {
  article: "Bài viết",
  video: "Video",
  podcast: "Podcast",
  news: "Tin tức",
  other: "Khác",
}

export default function PressAdminPage() {
  const {
    data: pressItems = [],
    loading,
    error,
    execute: fetchPress,
  } = useApiCall<PressItem[]>()

  // Load data on mount
  React.useEffect(() => {
    const loadPressData = async () => {
      try {
        const data = await getPress()
        if (data.success) {
          fetchPress(() => Promise.resolve(data.data))
        }
      } catch (error) {
        console.error('Failed to load press:', error)
      }
    }
    loadPressData()
  }, [])

  const handleDelete = async (item: PressItem) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa nội dung truyền thông này?")
    if (!confirmed) return

    try {
      await deletePress(item.id)

      // Refresh data
      const data = await getPress()
      if (data.success) {
        fetchPress(() => Promise.resolve(data.data))
      }
    } catch (error) {
      console.error('Failed to delete press item:', error)
    }
  }

  const handleToggleFeatured = async (item: PressItem) => {
    try {
      await updatePress(item.id, { featured: !item.featured })

      // Refresh data
      const data = await getPress()
      if (data.success) {
        fetchPress(() => Promise.resolve(data.data))
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error)
    }
  }

  // Define table columns
  const columns = [
    {
      key: "image",
      label: "Hình ảnh",
      render: (value: string, item: PressItem) => (
        <div className="flex-shrink-0">
          {value ? (
            <img
              src={value.startsWith('http') ? value : `/uploads/${value}`}
              alt={item.title}
              className="h-12 w-12 rounded-lg object-cover bg-gray-100"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Tiêu đề",
      sortable: true,
      render: (value: string, item: PressItem) => (
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-900">{value}</span>
            <Badge variant="outline" className="text-xs">
              {typeLabels[item.type] ?? item.type}
            </Badge>
            {item.featured && (
              <Badge variant="default" className="flex items-center gap-1 bg-amber-500 text-xs">
                <Star className="h-3 w-3" fill="currentColor" />
                Nổi bật
              </Badge>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.description}</p>
        </div>
      ),
    },
    {
      key: "source",
      label: "Nguồn",
      sortable: true,
    },
    {
      key: "date",
      label: "Ngày đăng",
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      key: "link",
      label: "Liên kết",
      render: (value: string) => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm font-semibold text-purple-600 hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          Xem
        </a>
      ),
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Truyền thông</h1>
          <p className="mt-2 text-gray-600">Quản lý các bài viết, phóng sự và nội dung truyền thông.</p>
        </div>
        <Link href="/admin/press/create">
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Thêm nội dung
          </Button>
        </Link>
      </div>

      <DataTable
        data={pressItems || []}
        columns={columns}
        loading={loading}
        error={error}
        search={{
          placeholder: "Tìm kiếm theo tiêu đề, nguồn...",
          onSearch: (query) => {
            // Implement client-side search through the DataTable component
          },
        }}
        actions={{
          add: {
            label: "Thêm nội dung",
            onClick: () => window.location.href = "/admin/press/create",
          },
          edit: (item: PressItem) => {
            window.location.href = `/admin/press/${item.id}/edit`
          },
          delete: handleDelete,
          custom: (item: PressItem) => (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleToggleFeatured(item)}
            >
              <Star className="mr-1 h-3 w-3" fill={item.featured ? "currentColor" : "none"} />
              {item.featured ? "Bỏ nổi bật" : "Nổi bật"}
            </Button>
          ),
        }}
        emptyState={
          <div className="py-10 text-center text-gray-500">
            <p>Chưa có nội dung truyền thông nào.</p>
            <Link href="/admin/press/create" className="mt-4 inline-block">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm nội dung đầu tiên
              </Button>
            </Link>
          </div>
        }
      />
    </div>
  )
}
