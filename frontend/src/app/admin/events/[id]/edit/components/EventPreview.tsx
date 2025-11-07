"use client"

import { resolveMediaUrl } from "@/lib/media"

interface EventSection {
  id: string
  title: string
  items: string[]
  position: number
}

interface Event {
  id: string
  title: string
  slug: string
  description: string
  fullDescription?: string
  image?: string
  location?: string
  openingHours?: string
  dateDisplay?: string
  venueMap?: string
  pricingImage?: string
  sections?: EventSection[]
  status: string
}

interface EventPreviewProps {
  event: Event | null
  sections: EventSection[]
}

export function EventPreview({ event, sections }: EventPreviewProps) {
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Đang tải thông tin sự kiện...</p>
        </div>
      </div>
    )
  }

  const sortedSections = [...sections].sort((a, b) => a.position - b.position)

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative w-full pt-32 pb-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(135deg, rgb(115, 66, 186) 0%, #B668A1 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-white" style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              {event.title}
            </h1>
            {event.dateDisplay && (
              <p className="text-lg sm:text-xl mb-2 opacity-90">
                {event.dateDisplay}
              </p>
            )}
            {event.location && (
              <p className="text-base sm:text-lg opacity-80">
                Địa điểm: {event.location}
              </p>
            )}
            {event.openingHours && (
              <p className="text-base sm:text-lg opacity-80">
                Giờ mở cửa: {event.openingHours}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {event.image && (
                <img
                  src={resolveMediaUrl(event.image)}
                  alt={event.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg mb-8"
                />
              )}
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2
                  className="text-3xl font-serif font-bold mb-4"
                  style={{ color: "#5b21b6" }}
                >
                  Về sự kiện
                </h2>
                {event.fullDescription && (
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {event.fullDescription}
                  </p>
                )}
              </div>

              {sortedSections.map((section, idx) => (
                <div
                  key={section.id ?? `${section.title}-${idx}`}
                  className="bg-white rounded-lg shadow-md p-8 mb-8"
                >
                  <h2
                    className="text-3xl font-serif font-bold mb-6"
                    style={{ color: "#5b21b6" }}
                  >
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.items.map((item: string, itemIdx: number) => (
                      <div key={itemIdx} className="flex items-start gap-3">
                        <span
                          className="mt-2 w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: "#fcd34d" }}
                        />
                        <p className="text-gray-700 text-lg leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {event.venueMap && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <h2
                    className="text-3xl font-serif font-bold mb-6"
                    style={{ color: "#5b21b6" }}
                  >
                    Sơ đồ địa điểm
                  </h2>
                  <img
                    src={resolveMediaUrl(event.venueMap)}
                    alt="Sơ đồ địa điểm"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h3
                  className="text-xl font-serif font-bold mb-4"
                  style={{ color: "#5b21b6" }}
                >
                  Thông tin sự kiện
                </h3>
                <div className="space-y-3">
                  {event.dateDisplay && (
                    <div>
                      <p className="font-semibold text-gray-900">Thời gian:</p>
                      <p className="text-gray-600">{event.dateDisplay}</p>
                    </div>
                  )}
                  {event.location && (
                    <div>
                      <p className="font-semibold text-gray-900">Địa điểm:</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  )}
                  {event.openingHours && (
                    <div>
                      <p className="font-semibold text-gray-900">Giờ mở cửa:</p>
                      <p className="text-gray-600">{event.openingHours}</p>
                    </div>
                  )}
                </div>

                {event.pricingImage && (
                  <div className="mt-6">
                    <h4
                      className="text-lg font-serif font-bold mb-3"
                      style={{ color: "#5b21b6" }}
                    >
                      Bảng giá
                    </h4>
                    <img
                      src={resolveMediaUrl(event.pricingImage)}
                      alt="Bảng giá"
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
