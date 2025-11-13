import PastEventDetailClient from "../[slug]/past-event-client"
import { sacHoiTrangThuEvent } from "@/data/past-events"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sắc Màu Di Sản – Sắc Hội Trăng Thu 2025",
    description: "Hành trình đưa di sản trở lại trong một mùa Trung thu hiện đại",
}

export default function SacMauDiSanSacHoiTrangThu2025Page() {
    return <PastEventDetailClient event={sacHoiTrangThuEvent} />
}