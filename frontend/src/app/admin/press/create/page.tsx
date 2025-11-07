"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PressForm } from "../components/PressForm"

export default function CreatePressPage() {
  return (
    <div className="space-y-6 px-4 pb-10 pt-4 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link href="/admin/press">
            <Button variant="outline" size="sm" className="w-full cursor-pointer sm:w-auto">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Thêm nội dung truyền thông</h1>
            <p className="text-gray-600">Tạo mới bài viết, video hoặc nội dung truyền thông.</p>
          </div>
        </div>
      </div>

      <PressForm mode="create" />
    </div>
  )
}
