"use client"

import { useState, useEffect } from "react"
import { getAuthToken } from "@/lib/auth-cookies"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PastEventListItem } from "@/types/PastEvent"

export default function PastEventsAdminPage() {
    const [events, setEvents] = useState<PastEventListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedYear, setSelectedYear] = useState<"all" | number>("all")

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const token = getAuthToken()
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/past-events`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const data = await res.json()
            setEvents(data)
        } catch (error) {
            console.error("Error fetching events:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa sự kiện này?")) return

        try {
            const token = getAuthToken()
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/past-events/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            fetchEvents()
        } catch (error) {
            console.error("Error deleting event:", error)
            alert("Có lỗi xảy ra khi xóa sự kiện")
        }
    }

    const years = Array.from(new Set(events.map((e: PastEventListItem) => e.year))).sort((a: number, b: number) => b - a)
    const filteredEvents =
        selectedYear === "all" ? events : events.filter((e) => e.year === selectedYear)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Đang tải...</div>
            </div>
        )
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Sự kiện đã diễn ra</h1>
                    <p className="text-gray-600 mt-2">Quản lý các sự kiện trong quá khứ</p>
                </div>
                <Link
                    href="/admin/past-events/create"
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus size={20} />
                    Thêm sự kiện mới
                </Link>
            </div>

            {/* Year Filter */}
            <div className="flex flex-wrap gap-3 mb-6">
                <button
                    onClick={() => setSelectedYear("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedYear === "all"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Tất cả
                </button>
                {years.map((year: number) => (
                    <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedYear === year
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {year}
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Chưa có sự kiện nào</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Image */}
                            {event.thumbnailImage && (
                                <div className="relative h-48 bg-gray-200">
                                    <Image
                                        src={event.thumbnailImage}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                                        {event.year}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                    {event.title}
                                </h3>
                                {event.description && (
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                        {event.description}
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/past-events/${event.slug}`}
                                        target="_blank"
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <Eye size={16} />
                                        Xem
                                    </Link>
                                    <Link
                                        href={`/admin/past-events/edit/${event.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                    >
                                        <Edit size={16} />
                                        Sửa
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
