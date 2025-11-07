/// <reference types="node" />
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Clear existing data
    console.log('🧹 Cleaning existing data...')
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.emailSubscription.deleteMany()
    await prisma.idea.deleteMany()
    await prisma.story.deleteMany()
    await prisma.press.deleteMany()
    await prisma.product.deleteMany()
    await prisma.eventSection.deleteMany()
    await prisma.event.deleteMany()
    await prisma.talkSection.deleteMany()
    await prisma.user.deleteMany()

    // Create admin user
    console.log('👤 Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
        data: {
            email: 'admin@sacmaudisan.vn',
            password: hashedPassword,
            name: 'Admin User',
            role: 'admin',
        },
    })
    console.log('✅ Admin created:', admin.email)

    // Seed Talk Section content
    console.log('🎤 Seeding talk section content...')
    await prisma.talkSection.upsert({
        where: { key: 'default' },
        update: {
            title: 'TỌA ĐÀM TRỰC TUYẾN',
            description: 'Cập nhật các buổi trò chuyện trực tuyến cùng chuyên gia và nghệ nhân văn hóa.',
            liveInput: 'https://www.youtube.com/watch?v=NWys5zmK9wo',
            replayInput: `<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F818742077735961%2F&show_text=false&width=476&t=0" width="476" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
        },
        create: {
            key: 'default',
            title: 'TỌA ĐÀM TRỰC TUYẾN',
            description: 'Cập nhật các buổi trò chuyện trực tuyến cùng chuyên gia và nghệ nhân văn hóa.',
            liveInput: 'https://www.youtube.com/watch?v=NWys5zmK9wo',
            replayInput: `<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F818742077735961%2F&show_text=false&width=476&t=0" width="476" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
        }
    })
    console.log('✅ Talk section seeded')

    // Create Events
    console.log('📅 Creating events...')
    const events = await Promise.all([
        prisma.event.create({
            data: {
                title: 'Sắc Hội Trăng Thu - Mùa 2',
                slug: 'sac-hoi-trang-thu-mua-2',
                description: 'Chương trình Trung Thu xưa giữa phố - Kết nối thế hệ trẻ với giá trị truyền thống qua các hoạt động sáng tạo và ý nghĩa.',
                fullDescription: 'Chương trình tái hiện không gian Trung Thu xưa với nhiều hoạt động trải nghiệm dành cho gia đình và giới trẻ yêu văn hóa Việt.',
                content: `
# Sắc Hội Trăng Thu - Mùa 2

## Giới thiệu
Chương trình "Sắc Hội Trăng Thu" mùa 2 là sự kiện văn hóa đặc biệt, tái hiện không gian Trung Thu xưa ngay giữa lòng thành phố. Với mong muốn kết nối thế hệ trẻ với những giá trị truyền thống, chương trình mang đến trải nghiệm độc đáo về văn hóa Trung Thu Việt Nam.

## Hoạt động chính
- Làm lồng đèn truyền thống
- Trải nghiệm trò chơi dân gian
- Thưởng thức bánh Trung Thu
- Biểu diễn nghệ thuật truyền thống

## Thông tin
- **Thời gian:** 15/09/2024 - 17/09/2024
- **Địa điểm:** Phố cổ Hà Nội
- **Đối tượng:** Mọi lứa tuổi
        `,
                image: '/events/sac-hoi-trang-thu.jpg',
                location: 'Phố cổ Hà Nội',
                openingHours: '09:00 - 21:00',
                dateDisplay: '15/09/2024 - 17/09/2024',
                status: 'published',
                sections: {
                    create: [
                        {
                            title: 'Các hoạt động trải nghiệm văn hóa',
                            position: 0,
                            items: [
                                'Làm lồng đèn truyền thống với nghệ nhân',
                                'Không gian trò chơi dân gian cho thiếu nhi',
                                'Workshop vẽ tranh dân gian và thư pháp',
                            ],
                        },
                        {
                            title: 'Các gian hàng đặc sắc',
                            position: 1,
                            items: [
                                'Gian hàng đồ thủ công Sắc Màu Di Sản',
                                'Không gian ẩm thực Trung Thu cổ truyền',
                                'Khu trưng bày ảnh ký ức Trung Thu',
                            ],
                        },
                    ],
                },
            },
        }),
        prisma.event.create({
            data: {
                title: 'Hương Sắc Cố Đô - Huế 2024',
                slug: 'huong-sac-co-do-hue-2024',
                description: 'Hành trình khám phá kiến trúc và ẩm thực cung đình Huế - Trải nghiệm văn hóa đậm chất hoàng gia.',
                fullDescription: 'Chương trình đưa du khách trở về không gian văn hóa cung đình với các nghi thức truyền thống, ẩm thực và làng nghề đặc trưng của Huế.',
                content: `
# Hương Sắc Cố Đô - Huế 2024

Khám phá vẻ đẹp kiến trúc và ẩm thực cung đình Huế qua các hoạt động trải nghiệm độc đáo.

## Điểm nhấn
- Tham quan di tích lịch sử
- Thưởng thức ẩm thực cung đình
- Trải nghiệm trang phục truyền thống
- Workshop nghệ thuật dân gian
        `,
                image: '/events/huong-sac-co-do.jpg',
                location: 'Thành phố Huế',
                openingHours: '08:00 - 20:00',
                dateDisplay: '20/03/2024 - 23/03/2024',
                status: 'published',
                sections: {
                    create: [
                        {
                            title: 'Trải nghiệm tiêu biểu',
                            position: 0,
                            items: [
                                'Tham quan Đại Nội cùng chuyên gia văn hóa',
                                'Thưởng thức thực đơn cung đình tái hiện',
                                'Khoác thử áo ngũ thân truyền thống',
                            ],
                        },
                        {
                            title: 'Không gian triển lãm',
                            position: 1,
                            items: [
                                'Trưng bày cổ vật cung đình và thư tịch cổ',
                                'Khu vực trình diễn nhã nhạc cung đình',
                            ],
                        },
                    ],
                },
            },
        }),
        prisma.event.create({
            data: {
                title: 'Di Sản Sống - Hội An',
                slug: 'di-san-song-hoi-an',
                description: 'Trải nghiệm văn hóa làng nghề và phố cổ Hội An qua các hoạt động thực hành.',
                fullDescription: 'Một hành trình khám phá di sản Hội An với làng nghề truyền thống, đêm phố cổ và các hoạt động kết nối cộng đồng.',
                content: `
# Di Sản Sống - Hội An

Chương trình kết nối với di sản văn hóa Hội An qua trải nghiệm thực tế tại các làng nghề truyền thống.
        `,
                image: '/events/di-san-song.jpg',
                location: 'Hội An, Quảng Nam',
                openingHours: '09:00 - 22:00',
                dateDisplay: '10/12/2024 - 12/12/2024',
                status: 'published',
                sections: {
                    create: [
                        {
                            title: 'Lịch trình nổi bật',
                            position: 0,
                            items: [
                                'Tham quan làng gốm Thanh Hà',
                                'Workshop làm đèn lồng Hội An',
                                'Đêm thả hoa đăng trên sông Hoài',
                            ],
                        },
                        {
                            title: 'Kết nối cộng đồng',
                            position: 1,
                            items: [
                                'Giao lưu nghệ nhân và du khách quốc tế',
                                'Triển lãm ảnh ký ức phố cổ Hội An',
                            ],
                        },
                    ],
                },
            },
        }),
    ])
    console.log(`✅ Created ${events.length} events`)

    // Create Products
    console.log('🛍️ Creating products...')
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: 'Lồng Đèn Truyền Thống Handmade',
                slug: 'long-den-truyen-thong-handmade',
                description: 'Lồng đèn được làm thủ công từ giấy dó truyền thống, tái hiện vẻ đẹp của lồng đèn xưa.',
                content: `
# Lồng Đèn Truyền Thống Handmade

## Đặc điểm
- Làm thủ công 100%
- Chất liệu giấy dó truyền thống
- Họa tiết vẽ tay
- Kích thước: 30cm x 40cm

## Ý nghĩa
Mỗi chiếc lồng đèn là một tác phẩm nghệ thuật, mang trong mình câu chuyện văn hóa Trung Thu truyền thống.
        `,
                price: 350000,
                image: '/products/long-den-1.jpg',
                images: ['/products/long-den-1.jpg', '/products/long-den-2.jpg'],
                category: 'Handmade',
                stock: 50,
                status: 'published',
                featured: true,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Phấn Nụ Hoàng Cung',
                slug: 'phan-nu-hoang-cung',
                description: 'Phấn nụ truyền thống được chế tác theo bí quyết cung đình, giữ nguyên tinh hoa làm đẹp của người xưa.',
                content: `
# Phấn Nụ Hoàng Cung

Sản phẩm làm đẹp truyền thống, được nghiên cứu và tái hiện từ công thức cung đình.

## Thành phần
- 100% thiên nhiên
- Không chất bảo quản
- Hương thơm nhẹ nhàng
        `,
                price: 280000,
                image: '/products/phan-nu.jpg',
                images: ['/products/phan-nu.jpg'],
                category: 'Mỹ phẩm',
                stock: 100,
                status: 'published',
                featured: true,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Giấy Trúc Chỉ Nghệ Thuật',
                slug: 'giay-truc-chi-nghe-thuat',
                description: 'Giấy thủ công được làm từ tre trúc theo phương pháp truyền thống, mỗi tờ giấy là một tác phẩm nghệ thuật.',
                price: 120000,
                image: '/products/giay-truc-chi.jpg',
                images: ['/products/giay-truc-chi.jpg'],
                category: 'Văn phòng phẩm',
                stock: 200,
                status: 'published',
                featured: true,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Áo Dài Truyền Thống',
                slug: 'ao-dai-truyen-thong',
                description: 'Áo dài may đo theo phong cách truyền thống, chất liệu vải lụa cao cấp.',
                price: 1500000,
                image: '/products/ao-dai.jpg',
                images: ['/products/ao-dai.jpg'],
                category: 'Trang phục',
                stock: 30,
                status: 'published',
                featured: true,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Cờ Cá Ngựa Handmade',
                slug: 'co-ca-ngua-handmade',
                description: 'Bộ cờ cá ngựa được làm thủ công, tái hiện trò chơi dân gian truyền thống.',
                price: 450000,
                image: '/products/co-ca-ngua.jpg',
                images: ['/products/co-ca-ngua.jpg'],
                category: 'Đồ chơi',
                stock: 40,
                status: 'published',
                featured: true,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Gốm Sứ Bát Tràng',
                slug: 'gom-su-bat-trang',
                description: 'Bộ ấm chén gốm sứ Bát Tràng, vẽ hoa văn truyền thống.',
                price: 850000,
                image: '/products/gom-su.jpg',
                images: ['/products/gom-su.jpg'],
                category: 'Gốm sứ',
                stock: 25,
                status: 'published',
                featured: false,
            },
        }),
    ])
    console.log(`✅ Created ${products.length} products`)

    // Create Press coverage
    console.log('📰 Creating press coverage...')
    const press = await Promise.all([
        prisma.press.create({
            data: {
                source: 'NHÂN DÂN',
                title: 'Trưởng thành cùng di sản',
                description:
                    'Mùa 2: Trung thu xưa giữa phố - Chương trình đã tạo nên không gian văn hóa độc đáo, kết nối thế hệ trẻ với những giá trị truyền thống qua các hoạt động sáng tạo và ý nghĩa.',
                date: '15/09/2024',
                type: 'article',
                link: 'https://nhandan.vn/...',
                image: '/press/nhan-dan-1.jpg',
                featured: true,
            },
        }),
        prisma.press.create({
            data: {
                source: 'ĐẠI BIỂU NHÂN DÂN',
                title: "Chuỗi sự kiện 'Sắc màu di sản'",
                description: 'Mùa 1: Hướng đến Ngày Gia đình Việt Nam',
                date: '28/06/2024',
                type: 'article',
                link: 'https://daibieunhandan.vn/...',
                image: '/press/dbnd.jpg',
                featured: false,
            },
        }),
        prisma.press.create({
            data: {
                source: 'ANTV',
                title: 'Thế hệ trẻ góp phần gìn giữ bản sắc Việt',
                description: 'Mùa 1: Chương trình truyền hình',
                date: '25/06/2024',
                type: 'video',
                link: 'https://www.youtube.com/watch?v=...',
                image: '/press/antv.jpg',
                featured: false,
            },
        }),
    ])
    console.log(`✅ Created ${press.length} press records`)

    // Create Stories
    console.log('📖 Creating stories...')
    const stories = await Promise.all([
        prisma.story.create({
            data: {
                title: 'Kỷ niệm đáng nhớ từ Sắc Hội Trăng Thu',
                slug: 'ky-niem-dang-nho-tu-sac-hoi-trang-thu',
                content: `
Tôi vẫn nhớ như in ngày đầu tiên tham gia chương trình Sắc Hội Trăng Thu. Được tự tay làm lồng đèn, được nghe những câu chuyện về Trung Thu xưa từ các nghệ nhân, tôi như được quay về tuổi thơ.

Đặc biệt, khi thắp sáng chiếc lồng đèn mình làm và treo lên cùng hàng trăm chiếc lồng đèn khác, tôi cảm nhận được sự kết nối sâu sắc với văn hóa dân tộc. Đó không chỉ là một chiếc lồng đèn, mà là cả một ký ức, một phần văn hóa được lưu giữ và truyền lại.

Cảm ơn Sắc Màu Di Sản đã tạo ra những khoảnh khắc ý nghĩa như vậy!
        `,
                author: 'Nguyễn Minh Anh',
                authorEmail: 'minhanh@example.com',
                image: '/stories/story-1.jpg',
                status: 'approved',
            },
        }),
        prisma.story.create({
            data: {
                title: 'Hành trình tìm về cội nguồn',
                slug: 'hanh-trinh-tim-ve-coi-nguon',
                content: `
Là một người trẻ lớn lên trong môi trường thành thị, tôi ít có cơ hội tiếp xúc với văn hóa truyền thống. Tham gia các chương trình của Sắc Màu Di Sản, tôi như được mở ra một cánh cửa mới.

Từ những buổi workshop làm phấn nụ truyền thống, đến việc học cách vẽ tranh dân gian, mỗi hoạt động đều mang lại cho tôi sự trân trọng sâu sắc hơn đối với di sản văn hóa của dân tộc.

Giờ đây, tôi tự hào khi chia sẻ về văn hóa Việt với bạn bè quốc tế, và mong muốn tiếp tục đóng góp cho việc bảo tồn và phát huy những giá trị này.
        `,
                author: 'Trần Văn Nam',
                authorEmail: 'vannam@example.com',
                status: 'approved',
            },
        }),
        prisma.story.create({
            data: {
                title: 'Cảm nhận về văn hóa Huế',
                slug: 'cam-nhan-ve-van-hoa-hue',
                content: `
Chuyến đi Huế cùng Sắc Màu Di Sản đã để lại trong tôi nhiều ấn tượng khó quên. Được trải nghiệm ẩm thực cung đình, tham quan các di tích lịch sử, và đặc biệt là được nghe các nghệ nhân kể về lịch sử của từng món ăn, từng công trình kiến trúc.

Tôi nhận ra rằng di sản không chỉ là những tòa nhà cổ hay món ăn ngon, mà còn là những câu chuyện, những giá trị tinh thần được lưu truyền qua nhiều thế hệ.
        `,
                author: 'Lê Thị Hoa',
                authorEmail: 'thihoa@example.com',
                status: 'pending',
            },
        }),
    ])
    console.log(`✅ Created ${stories.length} stories`)

    // Create Ideas
    console.log('💡 Creating ideas...')
    const ideas = await Promise.all([
        prisma.idea.create({
            data: {
                title: 'Tổ chức workshop làm đồ gốm truyền thống',
                description: `
Tôi nghĩ sẽ rất thú vị nếu có thêm các workshop về gốm sứ truyền thống, đặc biệt là gốm Bát Tràng và gốm Chu Đậu. Người tham gia có thể tự tay nặn và trang trí sản phẩm của mình.

Ngoài ra, có thể mời các nghệ nhân đến chia sẻ về lịch sử và kỹ thuật làm gốm để mọi người hiểu sâu hơn về nghề truyền thống này.
        `,
                submitter: 'Phạm Văn Đức',
                email: 'vanduc@example.com',
                phone: '0901234567',
                status: 'pending',
                notes: 'Ý tưởng hay, cần tìm kiếm nghệ nhân và địa điểm phù hợp',
            },
        }),
        prisma.idea.create({
            data: {
                title: 'Chương trình kết nối với làng nghề truyền thống',
                description: `
Đề xuất tổ chức các chuyến tham quan và trải nghiệm tại các làng nghề truyền thống như làng rèn Phú Định, làng tranh Đông Hồ, làng gốm Bát Tràng...

Người tham gia sẽ được tìm hiểu quy trình sản xuất, tự tay thực hành và mua về những sản phẩm thủ công làm quà lưu niệm.
        `,
                submitter: 'Hoàng Thị Mai',
                email: 'thimai@example.com',
                phone: '0912345678',
                status: 'in_review',
                notes: 'Đã liên hệ với các làng nghề, chuẩn bị triển khai trong tháng tới',
            },
        }),
        prisma.idea.create({
            data: {
                title: 'Ứng dụng AR để khám phá di sản',
                description: `
Xây dựng ứng dụng thực tế tăng cường (AR) cho phép người dùng khám phá các di sản văn hóa một cách sinh động hơn. Khi quét mã QR tại các điểm di sản, người dùng có thể xem thông tin lịch sử, hình ảnh 3D, và video giới thiệu.
        `,
                submitter: 'Đinh Quang Huy',
                email: 'quanghuy@example.com',
                phone: '0923456789',
                status: 'pending',
            },
        }),
    ])
    console.log(`✅ Created ${ideas.length} ideas`)

    // Create email subscriptions
    console.log('📧 Creating email subscriptions...')
    const emailSubscriptions = await Promise.all([
        prisma.emailSubscription.create({
            data: {
                email: 'nguyenvana@example.com',
                status: 'subscribed',
            },
        }),
        prisma.emailSubscription.create({
            data: {
                email: 'tranthib@example.com',
                status: 'subscribed',
            },
        }),
        prisma.emailSubscription.create({
            data: {
                email: 'levanc@example.com',
                status: 'subscribed',
            },
        }),
    ])
    console.log(`✅ Created ${emailSubscriptions.length} email subscriptions`)

    // Create sample orders
    console.log('🛒 Creating sample orders...')
    const orders = await Promise.all([
        prisma.order.create({
            data: {
                orderNumber: `ORD-${Date.now()}-001`,
                customerName: 'Nguyễn Văn Đạt',
                customerEmail: 'vandat@example.com',
                customerPhone: '0987654321',
                shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
                totalAmount: 980000,
                status: 'delivered',
                notes: 'Giao hàng giờ hành chính',
                orderItems: {
                    create: [
                        {
                            productId: products[0].id,
                            quantity: 2,
                            price: 350000,
                        },
                        {
                            productId: products[1].id,
                            quantity: 1,
                            price: 280000,
                        },
                    ],
                },
            },
        }),
        prisma.order.create({
            data: {
                orderNumber: `ORD-${Date.now()}-002`,
                customerName: 'Trần Thị Lan',
                customerEmail: 'thilan@example.com',
                customerPhone: '0976543210',
                shippingAddress: '456 Đường XYZ, Quận 3, TP.HCM',
                totalAmount: 1500000,
                status: 'shipping',
                notes: 'Gọi trước khi giao',
                orderItems: {
                    create: [
                        {
                            productId: products[3].id,
                            quantity: 1,
                            price: 1500000,
                        },
                    ],
                },
            },
        }),
        prisma.order.create({
            data: {
                orderNumber: `ORD-${Date.now()}-003`,
                customerName: 'Lê Minh Tuấn',
                customerEmail: 'minhtuan@example.com',
                customerPhone: '0965432109',
                shippingAddress: '789 Đường DEF, Quận 7, TP.HCM',
                totalAmount: 690000,
                status: 'confirmed',
                orderItems: {
                    create: [
                        {
                            productId: products[2].id,
                            quantity: 3,
                            price: 120000,
                        },
                        {
                            productId: products[1].id,
                            quantity: 1,
                            price: 280000,
                        },
                    ],
                },
            },
        }),
    ])
    console.log(`✅ Created ${orders.length} orders`)

    console.log('✨ Seed completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Users: ${1}`)
    console.log(`- Events: ${events.length}`)
    console.log(`- Products: ${products.length}`)
    console.log(`- Press: ${press.length}`)
    console.log(`- Stories: ${stories.length}`)
    console.log(`- Ideas: ${ideas.length}`)
    console.log(`- Email subscriptions: ${emailSubscriptions.length}`)
    console.log(`- Orders: ${orders.length}`)
    console.log('\n🔑 Admin credentials:')
    console.log('Email: admin@sacmaudisan.vn')
    console.log('Password: admin123')
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
