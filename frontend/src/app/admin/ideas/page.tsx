"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Trash2, Check, X, Download } from "lucide-react"
import { adminApi } from "@/lib/api"

interface Idea {
  id: string
  title: string
  description: string
  submitter: string
  email: string
  phone?: string | null
  status: string
  notes?: string | null
  createdAt: string
}

export default function IdeasAdmin() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread")
  const [notesDrafts, setNotesDrafts] = useState<Record<string, string>>({})
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      const data = await adminApi.getAllIdeas()
      setIdeas(data)
      const drafts: Record<string, string> = {}
      data.forEach((idea: Idea) => {
        drafts[idea.id] = idea.notes ?? ""
      })
      setNotesDrafts(drafts)
    } catch (error) {
      console.error("Failed to fetch ideas:", error)
    } finally {
      setLoading(false)
    }
  }

  const normalizeStatus = (status: string | null | undefined) =>
    (status ?? "").toLowerCase()

  const getReadState = (status: string | null | undefined): "read" | "unread" => {
    const normalized = normalizeStatus(status)
    if (["read", "accepted", "approved", "completed"].includes(normalized)) {
      return "read"
    }
    return "unread"
  }

  const unreadIdeas = useMemo(
    () => ideas.filter((idea) => getReadState(idea.status) === "unread"),
    [ideas]
  )

  const readIdeas = useMemo(
    () => ideas.filter((idea) => getReadState(idea.status) === "read"),
    [ideas]
  )

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateIdeaStatus(id, status)
      fetchIdeas()
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const handleNoteChange = (id: string, value: string) => {
    setNotesDrafts((prev) => ({ ...prev, [id]: value }))
  }

  const startEditingNote = (id: string) => {
    setEditingNoteId(id)
  }

  const cancelEditingNote = (id: string) => {
    setNotesDrafts((prev) => ({ ...prev, [id]: ideas.find((idea) => idea.id === id)?.notes ?? "" }))
    setEditingNoteId(null)
  }

  const saveNote = async (id: string) => {
    try {
      setSavingNoteId(id)
      const note = notesDrafts[id] ?? ""
      await adminApi.updateIdeaNotes(id, note)
      fetchIdeas()
      setEditingNoteId(null)
    } catch (error) {
      console.error("Failed to save note:", error)
    } finally {
      setSavingNoteId(null)
    }
  }

  const deleteIdea = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa idea này?")) {
      try {
        await adminApi.deleteIdea(id)
        fetchIdeas()
      } catch (error) {
        console.error("Failed to delete idea:", error)
      }
    }
  }

  const exportIdeasToCsv = (list: Idea[], suffix: string) => {
    if (!list.length) {
      return
    }

    const headers = [
      "Tiêu đề",
      "Người gửi",
      "Email",
      "Số điện thoại",
      "Trạng thái",
      "Ngày tạo",
      "Ghi chú",
      "Mô tả",
    ]

    const rows = list.map((idea) => [
      idea.title,
      idea.submitter,
      idea.email,
      idea.phone ? `\u200B${idea.phone}` : "",
      idea.status,
      new Date(idea.createdAt).toLocaleString("vi-VN"),
      idea.notes?.replace(/\s+/g, " ").trim() || "",
      idea.description.replace(/\s+/g, " ").trim(),
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `ideas-${suffix}-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  const renderIdeasList = (list: Idea[], isUnreadTab: boolean) => (
    <div className="space-y-4">
      {list.map((idea) => (
        <Card key={idea.id}>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg break-words pr-2">{idea.title}</CardTitle>
                <div className="text-sm text-gray-600 break-words">
                  <span className="inline-block">{idea.submitter}</span>
                  {idea.email && <span className="inline-block"> • {idea.email}</span>}
                  {idea.phone && <span className="inline-block"> • {idea.phone}</span>}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Badge variant={isUnreadTab ? "destructive" : "secondary"}>
                  {isUnreadTab ? "Chưa đọc" : "Đã đọc"}
                </Badge>
                <p className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(idea.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-gray-700 whitespace-pre-wrap">{idea.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700" htmlFor={`idea-note-${idea.id}`}>
                    Ghi chú nội bộ
                  </label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="px-2"
                    onClick={() =>
                      editingNoteId === idea.id
                        ? cancelEditingNote(idea.id)
                        : startEditingNote(idea.id)
                    }
                  >
                    {editingNoteId === idea.id ? "Hủy" : "Chỉnh sửa"}
                  </Button>
                </div>
                {editingNoteId === idea.id ? (
                  <>
                    <textarea
                      id={`idea-note-${idea.id}`}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      rows={3}
                      value={notesDrafts[idea.id] ?? ""}
                      onChange={(event) => handleNoteChange(idea.id, event.target.value)}
                      placeholder="Thêm ghi chú chỉ dành cho nội bộ..."
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => saveNote(idea.id)}
                        disabled={
                          savingNoteId === idea.id ||
                          (notesDrafts[idea.id] ?? "") === (ideas.find((i) => i.id === idea.id)?.notes ?? "")
                        }
                      >
                        {savingNoteId === idea.id ? "Đang lưu..." : "Lưu ghi chú"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelEditingNote(idea.id)}
                        disabled={savingNoteId === idea.id}
                      >
                        Hủy bỏ
                      </Button>
                    </div>
                  </>
                ) : (
                  <div
                    className="rounded-md bg-muted p-3 text-sm text-muted-foreground"
                    onDoubleClick={() => startEditingNote(idea.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        startEditingNote(idea.id)
                      }
                    }}
                  >
                    {(idea.notes && idea.notes.trim().length > 0)
                      ? idea.notes
                      : "(Chưa có ghi chú. Nhấp đúp hoặc chọn Chỉnh sửa để thêm.)"}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {isUnreadTab ? (
                <Button size="sm" onClick={() => updateStatus(idea.id, "read")}>
                  <Check className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Đánh dấu đã đọc</span>
                  <span className="sm:hidden">Đã đọc</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(idea.id, "unread")}
                >
                  <X className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Đánh dấu chưa đọc</span>
                  <span className="sm:hidden">Chưa đọc</span>
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteIdea(idea.id)}
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
            <p className="text-gray-500">Chưa có ý tưởng nào thuộc nhóm này</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Idea Submissions</h1>
          <p className="text-gray-600 mt-2">Quản lý ý tưởng từ người dùng</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              exportIdeasToCsv(
                activeTab === "unread" ? unreadIdeas : readIdeas,
                activeTab
              )
            }
          >
            <Download className="h-4 w-4 mr-1" />
            Xuất CSV ({activeTab === "unread" ? unreadIdeas.length : readIdeas.length})
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
            Chưa đọc ({unreadIdeas.length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Đã đọc ({readIdeas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unread">
          {renderIdeasList(unreadIdeas, true)}
        </TabsContent>
        <TabsContent value="read">
          {renderIdeasList(readIdeas, false)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
