"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Calendar, MapPin, Clock } from "lucide-react"

interface EventData {
  title: string
  slug: string
  description: string
  fullDescription: string
  heroImage: string | File
  location: string
  dateDisplay: string
  openingHours: string
}

interface LivePreviewProps {
  eventData: EventData
}

export function LivePreview({ eventData }: LivePreviewProps) {
  const getHeroImageUrl = (heroImage: string | File) => {
    if (!heroImage) {
      return null // Return null instead of empty string
    }
    if (typeof heroImage === 'string') {
      return heroImage
    }
    if (heroImage instanceof File) {
      return URL.createObjectURL(heroImage)
    }
    return '/images/events/placeholder-hero.jpg'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Live Preview</h3>
        <Badge variant="outline" className="text-xs">
          <Eye className="h-3 w-3 mr-1" />
          Preview Mode
        </Badge>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        {/* Hero Section */}
        <div className="relative h-64 sm:h-80 bg-gradient-to-r from-purple-600 to-pink-600">
          {(() => {
            const imageUrl = getHeroImageUrl(eventData.heroImage)
            return imageUrl && (
              <img
                src={imageUrl}
                alt={eventData.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            )
          })()}
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm font-medium">Sự kiện sắp diễn ra</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              {eventData.title || 'Tiêu đề sự kiện'}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm">
              {eventData.dateDisplay && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{eventData.dateDisplay}</span>
                </div>
              )}
              {eventData.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{eventData.location}</span>
                </div>
              )}
              {eventData.openingHours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{eventData.openingHours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Description */}
          {eventData.description && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-purple-800">Giới thiệu</h2>
              <p className="text-gray-700 leading-relaxed">{eventData.description}</p>
            </div>
          )}

          {/* Full Description */}
          {eventData.fullDescription && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-purple-800">Chi tiết sự kiện</h2>
              <div
                className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700 [&_h1]:text-3xl [&_h1]:font-serif [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-purple-800 [&_h1]:mt-8 [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:font-semibold [&_h2]:text-purple-700 [&_h2]:mb-3 [&_h2]:mt-6 [&_h3]:text-xl [&_h3]:font-serif [&_h3]:font-semibold [&_h3]:text-purple-600 [&_h3]:mb-3 [&_h3]:mt-4 [&_blockquote]:border-l-4 [&_blockquote]:border-purple-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:bg-purple-50 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:font-serif"
                dangerouslySetInnerHTML={{ __html: eventData.fullDescription }}
              />
            </div>
          )}

          {/* Registration CTA */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 text-purple-800">
                Sẵn sàng tham gia sự kiện?
              </h3>
              <p className="text-gray-600 mb-4">
                Đăng ký ngay để không bỏ lỡ sự kiện tuyệt vời này!
              </p>
              <Button className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-semibold">
                Đăng ký tham gia
              </Button>
            </div>
          </div>

          {/* Event Info Sidebar */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-purple-800">Thông tin sự kiện</h3>
            <div className="space-y-3 text-sm">
              {eventData.dateDisplay && (
                <div>
                  <p className="text-gray-600 mb-1">Thời gian</p>
                  <p className="font-semibold text-gray-800">{eventData.dateDisplay}</p>
                </div>
              )}
              {eventData.openingHours && (
                <div>
                  <p className="text-gray-600 mb-1">Giờ mở cửa</p>
                  <p className="font-semibold text-gray-800">{eventData.openingHours}</p>
                </div>
              )}
              {eventData.location && (
                <div>
                  <p className="text-gray-600 mb-1">Địa điểm</p>
                  <p className="font-semibold text-gray-800">{eventData.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="text-xs text-gray-500 text-center">
        <p>Đây là preview real-time của sự kiện. Nội dung sẽ hiển thị chính xác như thế này cho người xem.</p>
        <p className="mt-1">Hero image và các styling được áp dụng tự động từ template.</p>
      </div>
    </div>
  )
}