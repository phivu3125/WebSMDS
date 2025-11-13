import PastEventDetailClient from "../[slug]/past-event-client"
import { huongSacCoDoEvent } from "@/data/past-events"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Hương Sắc Cố Đô - Sắc Màu Di Sản",
    description: "Hành trình trải nghiệm đa giác quan, nơi văn hóa – lịch sử – nghệ thuật và ẩm thực Huế được tái hiện sống động. Cùng chạm vào tinh hoa di sản cố đô qua không gian triển lãm, VR và các hoạt động workshop sáng tạo.",
}

export default function HuongSacCoDoPage() {
    return <PastEventDetailClient event={huongSacCoDoEvent} />
}