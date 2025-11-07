"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Check, X, Download } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { adminApi } from "@/lib/api"

interface Story {
  id: string
  title: string
  content: string
  author?: string | null
  authorEmail?: string | null
  status: string
  createdAt: string
}

export default function StoriesAdmin() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread")

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const data = await adminApi.getAllStories()
      setStories(data)
    } catch (error) {
      console.error("Failed to fetch stories:", error)
    } finally {
      setLoading(false)
    }
  }

  const normalizeStatus = (status: string | null | undefined) =>
    (status ?? "").toLowerCase()

  const getReadState = (status: string | null | undefined): "read" | "unread" => {
    const normalized = normalizeStatus(status)
    if (["read", "approved", "published"].includes(normalized)) {
      return "read"
    }
    return "unread"
  }

  const unreadStories = useMemo(
    () => stories.filter((story) => getReadState(story.status) === "unread"),
    [stories]
  )

  const readStories = useMemo(
    () => stories.filter((story) => getReadState(story.status) === "read"),
    [stories]
  )

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateStoryStatus(id, status)
      fetchStories()
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const deleteStory = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa story này?")) {
      try {
        await adminApi.deleteStory(id)
        fetchStories()
      } catch (error) {
        console.error("Failed to delete story:", error)
      }
    }
  }

  const exportStoriesToCsv = (list: Story[], suffix: string) => {
    if (!list.length) {
      return
    }

    const headers = [
      "Tiêu đề",
      "Tác giả",
      "Email tác giả",
      "Trạng thái",
      "Ngày tạo",
      "Nội dung",
    ]

    const rows = list.map((story) => [
      story.title,
      story.author || "Ẩn danh",
      story.authorEmail || "",
      story.status,
      new Date(story.createdAt).toLocaleString("vi-VN"),
      story.content.replace(/\s+/g, " ").trim(),
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `stories-${suffix}-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  const renderStoriesList = (list: Story[], isUnreadTab: boolean) => (
    <div className="space-y-4">
      {list.map((story) => (
        <Card key={story.id}>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg break-words pr-2">{story.title}</CardTitle>
                <div className="text-sm text-gray-600 break-words">
                  <span className="inline-block">{story.author || "Ẩn danh"}</span>
                  {story.authorEmail && <span className="inline-block"> • {story.authorEmail}</span>}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Badge variant={isUnreadTab ? "destructive" : "secondary"}>
                  {isUnreadTab ? "Chưa đọc" : "Đã đọc"}
                </Badge>
                <p className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(story.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 whitespace-pre-wrap">{story.content}</p>
            <div className="flex flex-wrap gap-2">
              {isUnreadTab ? (
                <Button size="sm" onClick={() => updateStatus(story.id, "read")}>
                  <Check className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Đánh dấu đã đọc</span>
                  <span className="sm:hidden">Đã đọc</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(story.id, "unread")}
                >
                  <X className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Đánh dấu chưa đọc</span>
                  <span className="sm:hidden">Chưa đọc</span>
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteStory(story.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Xóa</span>
                <span className="sm:hidden">Xoá</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {list.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Chưa có story nào thuộc nhóm này</p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Story Submissions</h1>
          <p className="text-gray-600 mt-2">Quản lý câu chuyện từ người dùng</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              exportStoriesToCsv(
                activeTab === "unread" ? unreadStories : readStories,
                activeTab
              )
            }
          >
            <Download className="h-4 w-4 mr-1" />
            Xuất CSV ({activeTab === "unread" ? unreadStories.length : readStories.length})
          </Button>
        </div>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "unread" | "read")}
        className="space-y-4"
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="unread">
            Chưa đọc ({unreadStories.length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Đã đọc ({readStories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unread">
          {renderStoriesList(unreadStories, true)}
        </TabsContent>
        <TabsContent value="read">
          {renderStoriesList(readStories, false)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
