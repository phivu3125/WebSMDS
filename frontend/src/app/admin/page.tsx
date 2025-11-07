import Link from "next/link"
import {
  CalendarCheck,
  Users,
  Video,
  Package,
  ShoppingCart,
  FileText,
  BookOpen,
  Lightbulb,
  Mail,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const overviewCards = [
  {
    title: "Sự kiện",
    description: "Quản lý sự kiện, đăng ký và cập nhật lịch",
    href: "/admin/events",
    action: "Xem sự kiện",
    icon: CalendarCheck,
    iconBg: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "Đăng ký tham gia",
    description: "Theo dõi người tham gia và xử lý yêu cầu",
    href: "/admin/event-registrations",
    action: "Xem đăng ký",
    icon: Users,
    iconBg: "bg-blue-100 text-blue-700",
  },
  {
    title: "Tọa đàm trực tuyến",
    description: "Cập nhật nội dung và liên kết livestream",
    href: "/admin/talk-section",
    action: "Quản lý tọa đàm",
    icon: Video,
    iconBg: "bg-purple-100 text-purple-700",
  },
]

const managementCards = [
  {
    title: "Tin tức",
    description: "Bài viết báo chí và cập nhật truyền thông",
    href: "/admin/press",
    action: "Quản lý tin tức",
    icon: FileText,
  },
  {
    title: "Câu chuyện",
    description: "Bài viết cộng đồng và chia sẻ văn hóa",
    href: "/admin/stories",
    action: "Quản lý câu chuyện",
    icon: BookOpen,
  },
  {
    title: "Ý tưởng",
    description: "Đề xuất, sáng kiến từ cộng đồng",
    href: "/admin/ideas",
    action: "Quản lý ý tưởng",
    icon: Lightbulb,
  },
  {
    title: "Đăng ký nhận tin",
    description: "Danh sách email và thông báo",
    href: "/admin/email-subscriptions",
    action: "Xem danh sách",
    icon: Mail,
  },
  {
    title: "Sản phẩm",
    description: "Quản lý sản phẩm và tồn kho",
    href: "/admin/products",
    action: "Quản lý sản phẩm",
    icon: Package,
  },
  {
    title: "Đơn hàng",
    description: "Theo dõi và xử lý đơn mua hàng",
    href: "/admin/orders",
    action: "Quản lý đơn hàng",
    icon: ShoppingCart,
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      {/* <header className="rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển quản trị</h1>
        <p className="mt-2 max-w-2xl text-white/80">
          Tổng quan nhanh các khu vực quản lý nội dung, sự kiện và thương mại điện tử của Sắc Màu Di Sản.
        </p>
      </header> */}

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Trung tâm hoạt động</h2>
            <p className="text-sm text-gray-600">Các khu vực được truy cập thường xuyên</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {overviewCards.map((card) => (
            <Card key={card.title} className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{card.description}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${card.iconBg}`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-6">
                  <Link href={card.href}>
                    <Button className="w-full" variant="default">
                      {card.action}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Quản lý nội dung & cộng đồng</h2>
          <p className="text-sm text-gray-600">Điều phối thông tin truyền thông và kết nối cộng đồng</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {managementCards.map((card) => (
            <Card key={card.title} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="rounded-md bg-gray-100 p-2 text-gray-700">
                  <card.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4 min-h-[44px]">{card.description}</p>
                <Link href={card.href}>
                  <Button variant="outline" className="w-full">
                    {card.action}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
