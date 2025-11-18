/// <reference types="node" />
import { PrismaClient, Prisma } from '@prisma/client'
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
    await prisma.pastEvent.deleteMany()
    // eventSection removed - using eventIntro and eventDetails fields instead
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

    // Create editor user
    const editorPassword = await bcrypt.hash('editor123', 10)
    await prisma.user.create({
        data: {
            email: 'editor@sacmaudisan.vn',
            password: editorPassword,
            name: 'Editor User',
            role: 'editor',
        },
    })
    console.log('✅ Editor created')

    // Seeding talk section content
    console.log('🎤 Seeding talk section content...')
    await prisma.talkSection.create({
        data: {
            key: 'default',
            title: 'Chương trình Talk Show',
            description: 'Không gian đối thoại và chia sẻ về văn hóa, di sản và nghệ thuật Việt Nam.',
            liveInput: 'Kính mời quý vị tham gia chương trình talkshow đặc biệt về văn hóa Việt Nam.',
            replayInput: 'Video ghi lại các buổi talkshow đã diễn ra.',
        },
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
                eventIntro: 'Chương trình "Sắc Hội Trăng Thu" mùa 2 là sự kiện văn hóa đặc biệt, tái hiện không gian Trung Thu xưa ngay giữa lòng thành phố. Với mong muốn kết nối thế hệ trẻ với những giá trị truyền thống, chương trình mang đến trải nghiệm độc đáo về văn hóa Trung Thu Việt Nam.',
                eventDetails: '## Hoạt động chính\n- Làm lồng đèn truyền thống\n- Trải nghiệm trò chơi dân gian\n- Thưởng thức bánh Trung Thu\n- Biểu diễn nghệ thuật truyền thống\n\n## Các hoạt động trải nghiệm văn hóa\n- Làm lồng đèn truyền thống với nghệ nhân\n- Không gian trò chơi dân gian cho thiếu nhi\n- Workshop vẽ tranh dân gian và thư pháp\n\n## Các gian hàng đặc sắc\n- Gian hàng đồ thủ công Sắc Màu Di Sản\n- Không gian ẩm thực Trung Thu cổ truyền\n- Khu trưng bày ảnh ký ức Trung Thu',
                image: '/events/sac-hoi-trang-thu.jpg',
                location: 'Phố cổ Hà Nội',
                openingHours: '09:00 - 21:00',
                dateDisplay: '15/09/2024 - 17/09/2024',
                status: 'published',
            },
        }),
        prisma.event.create({
            data: {
                title: 'Hương Sắc Cố Đô - Huế 2024',
                slug: 'huong-sac-co-do-hue-2024',
                description: 'Hành trình khám phá kiến trúc và ẩm thực cung đình Huế - Trải nghiệm văn hóa đậm chất hoàng gia.',
                eventIntro: 'Chương trình đưa du khách trở về không gian văn hóa cung đình với các nghi thức truyền thống, ẩm thực và làng nghề đặc trưng của Huế.',
                eventDetails: '## Điểm nhấn\n- Tham quan di tích lịch sử\n- Thưởng thức ẩm thực cung đình\n- Trải nghiệm trang phục truyền thống\n- Workshop nghệ thuật dân gian\n\n## Trải nghiệm tiêu biểu\n- Tham quan Đại Nội cùng chuyên gia văn hóa\n- Thưởng thức thực đơn cung đình tái hiện\n- Workshop làm nón lá và tranh dân gian\n- Tiệc trà cung đình trong không gian hoàng gia',
                image: '/events/huong-sac-co-do.jpg',
                location: 'Thành phố Huế',
                openingHours: '08:00 - 20:00',
                dateDisplay: '20/03/2024 - 23/03/2024',
                status: 'published',
            },
        }),
        prisma.event.create({
            data: {
                title: 'Hội An - Đêm Phố Cổ',
                slug: 'hoi-an-dem-pho-co',
                description: 'Một hành trình khám phá di sản Hội An với làng nghề truyền thống, đêm phố cổ và các hoạt động kết nối cộng đồng.',
                eventIntro: 'Khám phá vẻ đẹp kiến trúc và ẩm thực cung đình Huế qua các hoạt động trải nghiệm độc đáo.',
                eventDetails: '## Làng nghề truyền thống\n- Làng gốm Thanh Hà\n- Làng rau Trà Quế\n- Làng mộc Kim Bồng\n- Làng bánh tráng Hội An\n\n## Hoạt động đặc sắc\n- Đêm phố cổ không gian\n- Workshop đèn lồng Hội An\n- Ẩm thực đường phố\n- Diễn nghệ truyền thống',
                image: '/events/hoi-an-dem-pho-co.jpg',
                location: 'Phố cổ Hội An',
                openingHours: '10:00 - 22:00',
                dateDisplay: '05/05/2024 - 07/05/2024',
                status: 'published',
            },
        }),
        prisma.event.create({
            data: {
                title: 'Sắc Màu Di Sản - Sắc Hội Trang Thu 2025',
                slug: 'sac-mau-di-san-sac-hoi-trang-thu-2025',
                description: 'Chương trình văn hóa đặc sắc tôn vinh giá trị di sản trang phục Việt Nam qua các không gian trưng bày và hoạt động trải nghiệm.',
                eventIntro: 'Chương trình văn hóa đặc sắc tôn vinh giá trị di sản trang phục Việt Nam qua các không gian trưng bày và hoạt động trải nghiệm độc đáo.',
                eventDetails: '## Các không gian trải nghiệm\n- Không gian trưng bày trang phục cung đình\n- Workshop kỹ thuật dệt may truyền thống\n- Sàn diễn thời trang di sản\n- Không gian ẩm thực và văn hóa\n\n## Hoạt động chính\n- Trưng bày hơn 100 bộ trang phục cổ\n- Workshop thử trang phục truyền thống\n- Diễn nghệ thời trang di sản\n- Giao lưu với các nghệ nhân',
                image: '/events/sac-mau-di-san.jpg',
                location: 'Hà Nội',
                openingHours: '08:00 - 21:00',
                dateDisplay: '10/01/2025 - 15/01/2025',
                status: 'draft',
            },
        }),
    ])
    console.log(`✅ Created ${events.length} events`)

    // Create Categories
    console.log('🏷️ Creating categories...')
    const categories = await Promise.all([
        prisma.productCategory.create({
            data: {
                name: 'Trang phục',
                slug: 'trang-phuc',
            },
        }),
        prisma.productCategory.create({
            data: {
                name: 'Đồ thủ công',
                slug: 'do-thu-cong',
            },
        }),
        prisma.productCategory.create({
            data: {
                name: 'Sản phẩm văn hóa',
                slug: 'san-pham-van-hoa',
            },
        }),
        prisma.productCategory.create({
            data: {
                name: 'Ẩm thực',
                slug: 'am-thuc',
            },
        }),
    ])
    console.log(`✅ Created ${categories.length} categories`)

    // Create Products
    console.log('🛍️ Creating products...')
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: 'Áo dài truyền thống',
                slug: 'ao-dai-truyen-thong',
                description: 'Áo dài Việt Nam cao cấp với chất liệu lụa tơ tằm truyền thống.',
                content: 'Áo dài được làm thủ công bởi các nghệ nhân lành nghề với chất liệu lụa tơ tằm tự nhiên, giữ nguyên vẻ đẹp truyền thống.',
                price: 2500000,
                image: '/products/ao-dai.jpg',
                images: ['/products/ao-dai-1.jpg', '/products/ao-dai-2.jpg'],
                categoryId: categories[0].id,
                category: 'Trang phục',
                stock: 10,
                inStock: true,
                status: 'published',
                featured: true,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Nón lá Bình Thuận',
                slug: 'non-la-binh-thuan',
                description: 'Nón lá thủ công từ làng nghề truyền thống Bình Thuận.',
                content: 'Nón lá được đan thủ công từ lá cọ tự nhiên, mang đậm nét văn hóa Việt Nam.',
                price: 150000,
                image: '/products/non-la.jpg',
                images: ['/products/non-la-1.jpg'],
                categoryId: categories[1].id,
                category: 'Đồ thủ công',
                stock: 25,
                inStock: true,
                status: 'published',
                featured: false,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Bộ trà đạo',
                slug: 'bo-tra-dao',
                description: 'Bộ trà đạo gốm sứ Bát Tràng truyền thống.',
                content: 'Bộ trà đạo bao gồm ấm trà, tách, đĩa và khay được làm từ gốm sứ Bát Tràng.',
                price: 850000,
                image: '/products/tra-dao.jpg',
                images: ['/products/tra-dao-1.jpg', '/products/tra-dao-2.jpg'],
                categoryId: categories[3].id,
                category: 'Ẩm thực',
                stock: 15,
                inStock: true,
                status: 'published',
                featured: true,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Tranh Đông Hồ',
                slug: 'tranh-dong-ho',
                description: 'Tranh dân gian Đông Hồ chính hiệu từ làng nghề truyền thống.',
                content: 'Tranh được in trên giấy điệp bằng kỹ thuật in gỗ truyền thống của làng tranh Đông Hồ.',
                price: 350000,
                image: '/products/tranh-dong-ho.jpg',
                images: ['/products/tranh-dong-ho-1.jpg'],
                categoryId: categories[2].id,
                category: 'Sản phẩm văn hóa',
                stock: 20,
                inStock: true,
                status: 'published',
                featured: false,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Lồng đèn Hội An',
                slug: 'long-den-hoi-an',
                description: 'Lồng đèn thủ công từ Hội An với thiết kế tinh xảo.',
                content: 'Lồng đèn được làm thủ công từ tre và lụa, mang đậm nét văn hóa Hội An.',
                price: 450000,
                image: '/products/long-den.jpg',
                images: ['/products/long-den-1.jpg', '/products/long-den-2.jpg'],
                categoryId: categories[1].id,
                category: 'Đồ thủ công',
                stock: 30,
                inStock: true,
                status: 'published',
                featured: true,
            },
        }),
    ])
    console.log(`✅ Created ${products.length} products`)

    // Create Press articles
    console.log('📰 Creating press articles...')
    const press = await Promise.all([
        prisma.press.create({
            data: {
                source: 'VnExpress',
                title: 'Sắc Màu Di Sản - Kết nối thế hệ trẻ với di sản Việt',
                description: 'Chương trình văn hóa "Sắc Màu Di Sản" đã thu hút hàng ngàn người tham gia, đặc biệt là giới trẻ, qua các hoạt động trải nghiệm di sản độc đáo.',
                date: '15/01/2025',
                type: 'Bài viết',
                link: 'https://vnexpress.net/sac-mau-di-san-ket-noi-the-he-voi-di-san-viet-1234567.html',
                image: '/press/sac-mau-di-san-vnexpress.jpg',
                featured: true,
            },
        }),
        prisma.press.create({
            data: {
                source: 'Tuổi Trẻ',
                title: 'Hành trình khám phá di sản cung đình Huế',
                description: 'Chương trình "Hương Sắc Cố Đô" mang đến trải nghiệm độc đáo về văn hóa cung đình Huế cho du khách trong và ngoài nước.',
                date: '25/03/2024',
                type: 'Bài viết',
                link: 'https://tuoitre.vn/hanh-trinh-kham-pha-di-san-cung-dinh-hue-1234567.html',
                image: '/press/huong-sac-co-do-tre.jpg',
                featured: false,
            },
        }),
        prisma.press.create({
            data: {
                source: 'Thanh Niên',
                title: 'Đêm phố cổ Hội An - Không gian văn hóa di sản',
                description: 'Sự kiện "Đêm phố cổ Hội An" tái hiện không gian văn hóa di sản qua các hoạt động trải nghiệm và trình diễn nghệ thuật.',
                date: '08/05/2024',
                type: 'Bài viết',
                link: 'https://thanhnien.vn/dem-pho-co-hoi-an-khong-gian-van-hoa-di-san-1234567.html',
                image: '/press/hoi-an-dem-pho-co-thanh-nien.jpg',
                featured: false,
            },
        }),
        prisma.press.create({
            data: {
                source: 'Công An Nhân Dân',
                title: 'Sắc Hội Trăng Thu - Gìn giữ nét đẹp văn hóa truyền thống',
                description: 'Chương trình "Sắc Hội Trăng Thu" mùa 2 đã thành công trong việc kết nối thế hệ trẻ với văn hóa truyền thống Trung thu Việt Nam.',
                date: '18/09/2024',
                type: 'Bài viết',
                link: 'https://cand.vn/sac-hoi-trang-thu-gin-gu-net-dep-van-hoa-truyen-thong-1234567.html',
                image: '/press/sac-hoi-trang-thu-cand.jpg',
                featured: false,
            },
        }),
    ])
    console.log(`✅ Created ${press.length} press articles`)

    // Create Past Events
    console.log('📅 Creating past events...')
    const pastEvents = await Promise.all([
        prisma.pastEvent.create({
            data: {
                title: 'My Việt Cho Nơi - 2023',
                slug: 'my-vi-cho-noi-2023',
                subtitle: 'Hành trình khám phá văn hóa ẩm thực Việt',
                description: 'Chuyến đi xuyên Việt khám phá văn hóa ẩm thực vùng miền.',
                thumbnailImage: '/past-events/my-vi-cho-noi-2023.jpg',
                year: 2023,
                hero: {
                    title: 'My Việt Cho Nơi',
                    subtitle: 'Hành trình ẩm thực Việt Nam',
                    image: '/past-events/my-vi-cho-noi-hero.jpg',
                },
                intro: {
                    title: 'Giới thiệu',
                    content: 'Chương trình "My Việt Cho Nơi" là hành trình khám phá văn hóa ẩm thực Việt Nam qua các vùng miền.',
                    image: '/past-events/my-vi-cho-noi-intro.jpg',
                },
                featureList: {
                    title: 'Điểm nhấn',
                    features: [
                        'Khám phá ẩm thực 3 miền',
                        'Gặp gỡ các đầu bếp nổi tiếng',
                        'Workshop nấu ăn truyền thống',
                        'Thịnh thực đường phố',
                    ],
                },
                gallery: {
                    title: 'Hình ảnh',
                    images: [
                        '/past-events/my-vi-cho-noi-1.jpg',
                        '/past-events/my-vi-cho-noi-2.jpg',
                        '/past-events/my-vi-cho-noi-3.jpg',
                    ],
                },
                conclusion: {
                    title: 'Kết quả',
                    content: 'Chương trình đã thành công trong việc quảng bá văn hóa ẩm thực Việt Nam.',
                    image: '/past-events/my-vi-cho-noi-conclusion.jpg',
                },
            },
        }),
        prisma.pastEvent.create({
            data: {
                title: 'Hương Sắc Cố Đô - 2023',
                slug: 'huong-sac-co-do-2023',
                subtitle: 'Hành trình văn hóa di sản Cố đô Huế',
                description: 'Chuyến đi khám phá văn hóa di sản Huế.',
                thumbnailImage: '/past-events/huong-sac-co-do-2023.jpg',
                year: 2023,
                hero: {
                    title: 'Hương Sắc Cố Đô',
                    subtitle: 'Di sản Huế',
                    image: '/past-events/huong-sac-co-do-hero.jpg',
                },
                intro: {
                    title: 'Giới thiệu',
                    content: 'Khám phá văn hóa di sản Huế qua các hoạt động trải nghiệm.',
                    image: '/past-events/huong-sac-co-do-intro.jpg',
                },
                featureList: {
                    title: 'Điểm nhấn',
                    features: [
                        'Tham quan Đại Nội',
                        'Ẩm thực cung đình',
                        'Nghệ thuật truyền thống',
                        'Làng nghề Huế',
                    ],
                },
                gallery: {
                    title: 'Hình ảnh',
                    images: [
                        '/past-events/huong-sac-co-do-1.jpg',
                        '/past-events/huong-sac-co-do-2.jpg',
                        '/past-events/huong-sac-co-do-3.jpg',
                    ],
                },
                conclusion: {
                    title: 'Kết quả',
                    content: 'Chương trình đã lan tỏa giá trị văn hóa di sản Huế.',
                    image: '/past-events/huong-sac-co-do-conclusion.jpg',
                },
            },
        }),
        prisma.pastEvent.create({
            data: {
                title: 'Ngàn Thu Việt - 2023',
                slug: 'ngan-thu-viet-2023',
                subtitle: 'Festival văn hóa mùa thu Việt Nam',
                description: 'Lễ hội văn hóa lớn tôn vinh mùa thu Việt Nam.',
                thumbnailImage: '/past-events/ngan-thu-viet-2023.jpg',
                year: 2023,
                hero: {
                    title: 'Ngàn Thu Việt',
                    subtitle: 'Mùa thu Việt Nam',
                    image: '/past-events/ngan-thu-viet-hero.jpg',
                },
                intro: {
                    title: 'Giới thiệu',
                    content: 'Festival văn hóa tôn vinh vẻ đẹp mùa thu Việt Nam.',
                    image: '/past-events/ngan-thu-viet-intro.jpg',
                },
                featureList: {
                    title: 'Điểm nhấn',
                    features: [
                        'Diễn nghệ văn hóa',
                        'Không gian ẩm thực',
                        'Trưng bày thủ công mỹ nghệ',
                        'Tọa đàm văn hóa',
                    ],
                },
                gallery: {
                    title: 'Hình ảnh',
                    images: [
                        '/past-events/ngan-thu-viet-1.jpg',
                        '/past-events/ngan-thu-viet-2.jpg',
                        '/past-events/ngan-thu-viet-3.jpg',
                    ],
                },
                conclusion: {
                    title: 'Kết quả',
                    content: 'Festival đã thành công rực rỡ với hàng ngàn lượt tham quan.',
                    image: '/past-events/ngan-thu-viet-conclusion.jpg',
                },
            },
        }),
    ])
    console.log(`✅ Created ${pastEvents.length} past events`)

    // Create Stories
    console.log('📝 Creating stories...')
    const stories = await Promise.all([
        prisma.story.create({
            data: {
                title: 'Hành trình khám phá văn hóa Việt Nam',
                slug: 'hanh-trinh-kham-pha-van-hoa-viet-nam',
                content: 'Chia sẻ về hành trình khám phá văn hóa Việt Nam qua các vùng miền với những trải nghiệm đáng nhớ.',
                author: 'Nguyễn Văn A',
                authorEmail: 'nguyenvana@example.com',
                image: '/stories/hanh-trinh-van-hoa.jpg',
                status: 'published',
            },
        }),
        prisma.story.create({
            data: {
                title: 'Ký ức về mùa Trung Thu xưa',
                slug: 'ky-uc-ve-mua-trung-thu-xua',
                content: 'Những kỷ niệm đẹp về mùa Trung Thu ngày xưa với đèn lồng, múa lân và những món ăn truyền thống.',
                author: 'Trần Thị B',
                authorEmail: 'tranthib@example.com',
                image: '/stories/trung-thu-xua.jpg',
                status: 'published',
            },
        }),
        prisma.story.create({
            data: {
                title: 'Làng nghề truyền thống Việt Nam',
                slug: 'lang-nghe-truyen-thong-viet-nam',
                content: 'Khám phá các làng nghề truyền thống của Việt Nam và những câu chuyện đằng sau chúng.',
                author: 'Lê Văn C',
                authorEmail: 'levanc@example.com',
                image: '/stories/lang-nghe-viet-nam.jpg',
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
                title: 'Tổ chức Festival văn hóa trẻ',
                submitter: 'Nguyễn Văn D',
                email: 'nguyenvand@example.com',
                phone: '0987654321',
                description: 'Ý tưởng tổ chức festival văn hóa dành riêng cho giới trẻ với các hoạt động sáng tạo và trải nghiệm văn hóa.',
                status: 'pending',
                notes: 'Ý tưởng thú vị, cần nghiên cứu tính khả thi',
            },
        }),
        prisma.idea.create({
            data: {
                title: 'Workshop di sản cho học sinh',
                submitter: 'Trần Thị E',
                email: 'tranthie@example.com',
                phone: '0976543210',
                description: 'Tổ chức các workshop về di sản dành cho học sinh THPT để nâng cao nhận thức về văn hóa truyền thống.',
                status: 'approved',
                notes: 'Sẽ triển khai thí điểm tại các trường THPT',
            },
        }),
    ])
    console.log(`✅ Created ${ideas.length} ideas`)

    console.log('🎉 Database seeded successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })