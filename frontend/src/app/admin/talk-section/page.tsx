"use client"

import { useEffect, useState } from "react"
import { Video, Save, AlertCircle, CheckCircle2 } from "lucide-react"
import { adminApi } from "@/lib/api"

export default function TalkSectionPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    liveInput: "",
    replayInput: "",
  })

  useEffect(() => {
    fetchTalkSection()
  }, [])

  const fetchTalkSection = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.getTalkSectionAdmin()
      if (data) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          liveInput: data.liveInput || "",
          replayInput: data.replayInput || "",
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)
      await adminApi.updateTalkSection(formData)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu dữ liệu")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Video className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Tọa đàm</h1>
        </div>
        <p className="text-gray-600">
          Cập nhật thông tin và liên kết video cho phần tọa đàm trực tuyến
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-1">Lỗi</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 mb-1">Thành công</h3>
            <p className="text-green-700 text-sm">Đã lưu thông tin tọa đàm</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chung</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VD: TỌA ĐÀM TRỰC TUYẾN"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mô tả ngắn về tọa đàm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Video Livestream</h2>
          
          <div>
            <label htmlFor="liveInput" className="block text-sm font-medium text-gray-700 mb-2">
              URL hoặc Embed Code
            </label>
            <textarea
              id="liveInput"
              value={formData.liveInput}
              onChange={(e) => setFormData({ ...formData, liveInput: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="VD: https://www.youtube.com/watch?v=... hoặc <iframe src=...></iframe>"
            />
            <p className="mt-2 text-sm text-gray-500">
              Hỗ trợ: YouTube URL, Facebook embed code, hoặc iframe HTML
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Video Phát lại</h2>
          
          <div>
            <label htmlFor="replayInput" className="block text-sm font-medium text-gray-700 mb-2">
              URL hoặc Embed Code
            </label>
            <textarea
              id="replayInput"
              value={formData.replayInput}
              onChange={(e) => setFormData({ ...formData, replayInput: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="VD: https://www.youtube.com/watch?v=... hoặc <iframe src=...></iframe>"
            />
            <p className="mt-2 text-sm text-gray-500">
              Video này sẽ hiển thị khi không có livestream
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={fetchTalkSection}
            disabled={saving}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Làm mới
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
