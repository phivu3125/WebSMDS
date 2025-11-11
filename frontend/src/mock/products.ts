import { Product } from '@/types';

export const products: Product[] = [
    {
        id: 1,
        name: "Áo Dài Truyền Thống",
        description: "Áo dài lụa tơ tằm thêu tay họa tiết sen, chất liệu cao cấp, thiết kế tinh xảo",
        details: "Áo dài truyền thống được làm từ lụa tơ tằm 100% cao cấp, thêu tay họa tiết hoa sen - biểu tượng của sự thanh khiết và vẻ đẹp trong văn hóa Việt Nam. Mỗi sản phẩm được thực hiện bởi các nghệ nhân có trên 20 năm kinh nghiệm, đảm bảo từng đường nét thêu đều tinh xảo và tỉ mỉ.\n\nÁo dài không chỉ là trang phục mà còn là biểu tượng văn hóa, thể hiện nét đẹp duyên dáng, thanh lịch của phụ nữ Việt. Sản phẩm phù hợp cho các dịp lễ tết, cưới hỏi, hoặc làm quà tặng ý nghĩa.",
        priceNum: 2500000,
        categoryId: 1,
        image: "/placeholder.svg?height=600&width=600",
        featured: true,
        inStock: true,
        stock: 15,
        specifications: [
            { label: "Chất liệu", value: "Lụa tơ tằm 100%" },
            { label: "Xuất xứ", value: "Làng nghề Vạn Phúc, Hà Đông" },
            { label: "Kích thước", value: "S, M, L, XL (có thể đo may riêng)" },
            { label: "Màu sắc", value: "Đỏ, Vàng, Xanh, Trắng" },
            { label: "Trọng lượng", value: "300g" }
        ],
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600&text=Image2",
            "/placeholder.svg?height=600&width=600&text=Image3",
            "https://picsum.photos/id/237/200/300",
        ],
        brandId: 1
    },
    {
        id: 2,
        name: "Tranh Sơn Mài",

        description: "Tranh sơn mài vẽ tay phong cảnh Hạ Long, nghệ thuật truyền thống Việt Nam",
        details: "Tranh sơn mài là một trong những nghệ thuật đặc trưng nhất của Việt Nam, kết hợp giữa kỹ thuật vẽ và công nghệ sơn mài truyền thống. Bức tranh phong cảnh Vịnh Hạ Long được vẽ tay hoàn toàn bởi họa sĩ, qua nhiều lớp sơn mài tạo nên chiều sâu và độ bóng đặc trưng.\n\nSản phẩm mang đến vẻ đẹp sang trọng, cổ điển, phù hợp trang trí cho không gian phòng khách, văn phòng làm việc hoặc làm quà tặng cao cấp.",
        priceNum: 5000000,
        categoryId: 2,
        image: "/placeholder.svg?height=600&width=600",
        featured: false,
        inStock: true,
        stock: 8,
        specifications: [
            { label: "Chất liệu", value: "Sơn mài thiên nhiên, gỗ MDF" },
            { label: "Xuất xứ", value: "Hà Nội" },
            { label: "Kích thước", value: "60cm x 80cm" },
            { label: "Trọng lượng", value: "2.5kg" }
        ],
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600&text=Detail",
        ],
        brandId: 2
    },
    {
        id: 3,
        name: "Gốm Sứ Bát Tràng",

        description: "Bộ ấm chén gốm sứ vẽ hoa sen xanh, làng nghề truyền thống Bát Tràng",
        details: "Bộ ấm chén gốm sứ Bát Tràng được làm thủ công hoàn toàn tại làng nghề gốm sứ Bát Tràng nổi tiếng với lịch sử hàng trăm năm. Men gốm trắng ngà kết hợp với họa tiết hoa sen xanh coban được vẽ tay tỉ mỉ, tạo nên vẻ đẹp thanh tao, tinh tế.\n\nBộ sản phẩm gồm 1 ấm trà và 6 chén nhỏ, thích hợp cho việc thưởng trà cùng gia đình và bạn bè, hoặc làm món quà tặng ý nghĩa.",
        priceNum: 1200000,
        categoryId: 3,
        image: "/placeholder.svg?height=600&width=600",
        featured: true,
        inStock: true,
        stock: 12,
        specifications: [
            { label: "Chất liệu", value: "Gốm sứ cao cấp" },
            { label: "Xuất xứ", value: "Làng Bát Tràng, Gia Lâm, Hà Nội" },
            { label: "Kích thước", value: "Ấm: 15cm x 12cm, Chén: 6cm x 4cm" },
            { label: "Trọng lượng", value: "1.2kg (bộ)" }
        ],
        images: [
            "/placeholder.svg?height=600&width=600",
        ],
        brandId: 3
    },
    {
        id: 4,
        name: "Nón Lá Thủ Công",

        description: "Nón lá Huế thêu thơ truyền thống, thủ công tinh xảo từ nghệ nhân",
        details: "Nón lá Huế là một trong những biểu tượng văn hóa đặc sắc của miền Trung Việt Nam. Mỗi chiếc nón được làm từ lá cọ non, qua nhiều công đoạn tỉ mỉ từ phơi lá, tẩm, xén, khâu cho đến thêu thơ.\n\nĐiểm đặc biệt của nón lá Huế là những câu thơ, hình ảnh được thêu tinh xảo vào giữa các lớp lá, chỉ có thể nhìn thấy khi đưa nón lên ánh sáng.",
        priceNum: 350000,
        categoryId: 4,
        image: "/placeholder.svg?height=600&width=600",
        featured: false,
        inStock: true,
        stock: 20,
        specifications: [
            { label: "Chất liệu", value: "Lá cọ, chỉ tơ tằm" },
            { label: "Xuất xứ", value: "Huế" },
            { label: "Kích thước", value: "Đường kính 40cm - 45cm" },
            { label: "Trọng lượng", value: "150g" }
        ],
        images: [
            "/placeholder.svg?height=600&width=600",
        ],
        brandId: 4
    },
    {
        id: 5,
        name: "Túi Thổ Cẩm",

        description: "Túi xách thổ cẩm dệt tay từ Tây Bắc, họa tiết độc đáo của dân tộc thiểu số",
        details: "Túi xách thổ cẩm mang đậm nét văn hóa của các dân tộc thiểu số vùng Tây Bắc. Mỗi chiếc túi được dệt tay hoàn toàn trên khung cửi truyền thống, với những họa tiết màu sắc rực rỡ đặc trưng.\n\nSản phẩm không chỉ đẹp mắt mà còn bền chắc, thể hiện sự khéo léo và tài năng của người phụ nữ dân tộc.",
        priceNum: 450000,
        categoryId: 1,
        image: "/placeholder.svg?height=600&width=600",
        featured: false,
        inStock: false,
        stock: 0,
        specifications: [
            { label: "Chất liệu", value: "Vải thổ cẩm dệt tay, da PU" },
            { label: "Xuất xứ", value: "Sapa, Lào Cai" },
            { label: "Kích thước", value: "30cm x 25cm x 10cm" },
            { label: "Trọng lượng", value: "300g" }
        ],
        images: [
            "/placeholder.svg?height=600&width=600"
        ],
        brandId: 5
    },
    {
        id: 6,
        name: "Đèn Lồng Hội An",

        description: "Đèn lồng lụa thủ công phong cách Hội An, mang đậm nét văn hóa phố cổ",
        details: "Đèn lồng Hội An là biểu tượng của phố cổ Hội An, được làm thủ công từ lụa và tre. Mỗi chiếc đèn lồng mang theo câu chuyện lịch sử và văn hóa của vùng đất này.",
        priceNum: 280000,
        categoryId: 5,
        image: "/placeholder.svg?height=400&width=400",
        featured: false,
        inStock: true,
        stock: 25,
        specifications: [
            { label: "Chất liệu", value: "Lụa, tre" },
            { label: "Xuất xứ", value: "Hội An, Quảng Nam" },
            { label: "Kích thước", value: "Đường kính 40cm - 45cm" },
            { label: "Trọng lượng", value: "150g" }
        ],
        images: [
            "/placeholder.svg?height=600&width=600"
        ],
        brandId: 6
    },
    {
        id: 7,
        name: "Khăn Lụa Thêu Tay",

        description: "Khăn lụa cao cấp thêu hoa văn truyền thống, quà tặng sang trọng",
        details: "Khăn lụa thêu tay với hoa văn truyền thống, thể hiện sự tinh tế và đẳng cấp.",
        priceNum: 650000,
        categoryId: 1,
        image: "/placeholder.svg?height=400&width=400",
        featured: false,
        inStock: true,
        stock: 30,
        specifications: [
            { label: "Chất liệu", value: "Lụa, tre" },
            { label: "Xuất xứ", value: "Hội An, Quảng Nam" },
            { label: "Kích thước", value: "Đường kính 40cm - 45cm" },
            { label: "Trọng lượng", value: "150g" }
        ],
        images: [
            "/placeholder.svg?height=600&width=600"
        ],
        brandId: 6
    },
    {
        id: 8,
        name: "Tranh Đông Hồ",

        description: "Tranh dân gian Đông Hồ in bằng khuôn gỗ truyền thống",
        details: "Tranh Đông Hồ là nghệ thuật in tranh dân gian Việt Nam, mang đậm nét văn hóa truyền thống.",
        priceNum: 180000,
        categoryId: 2,
        image: "/placeholder.svg?height=400&width=400",
        featured: true,
        inStock: true,
        stock: 18,
        specifications: [
            { label: "Chất liệu", value: "Lụa, tre" },
            { label: "Xuất xứ", value: "Hội An, Quảng Nam" },
            { label: "Kích thước", value: "Đường kính 40cm - 45cm" },
            { label: "Trọng lượng", value: "150g" }
        ],
        images: [
            "/placeholder.svg?height=600&width=600"
        ],
        brandId: 6
    },
    {
        id: 9,
        name: "Cờ Cá Ngựa",

        description: "Bộ cờ cá ngựa gỗ thủ công, trò chơi dân gian truyền thống",
        details: "Cờ cá ngựa là trò chơi dân gian Việt Nam, được làm từ gỗ quý, mang tính giải trí và giáo dục.",
        priceNum: 320000,
        categoryId: 6,
        image: "/placeholder.svg?height=400&width=400",
        featured: false,
        inStock: true,
        stock: 10,
        specifications: [
            { label: "Chất liệu", value: "Lụa, tre" },
            { label: "Xuất xứ", value: "Hội An, Quảng Nam" },
            { label: "Kích thước", value: "Đường kính 40cm - 45cm" },
            { label: "Trọng lượng", value: "150g" }
        ],
        images: [
            "/placeholder.svg?height=600&width=600"
        ],
        brandId: 6
    },
    {
        id: 10,
        name: "Tượng Gỗ Dân Gian",

        description: "Tượng gỗ khắc tay nghệ thuật dân gian Việt Nam",
        details: "Tượng gỗ khắc tay với hoa văn dân gian, thể hiện nghệ thuật điêu khắc truyền thống.",
        priceNum: 890000,
        categoryId: 5,
        image: "/placeholder.svg?height=400&width=400",
        featured: false,
        inStock: true,
        stock: 6,
        specifications: [
            { label: "Chất liệu", value: "Lụa, tre" },
            { label: "Xuất xứ", value: "Hội An, Quảng Nam" },
            { label: "Kích thước", value: "Đường kính 40cm - 45cm" },
            { label: "Trọng lượng", value: "150g" }
        ],
        images: [
            "/placeholder.svg?height=600&width=600"
        ],
        brandId: 6
    },
    {
        id: 11,
        name: "Bình Sơn Mài",

        description: "Bình sơn mài hoa văn truyền thống, trang trí nội thất cao cấp",
        details: "Bình sơn mài với hoa văn truyền thống, phù hợp trang trí nội thất sang trọng.",
        priceNum: 2200000,
        categoryId: 5,
        image: "/placeholder.svg?height=400&width=400",
        featured: false,
        inStock: true,
        stock: 4,
        specifications: [
            { label: "Chất liệu", value: "Lụa, tre" },
            { label: "Xuất xứ", value: "Hội An, Quảng Nam" },
            { label: "Kích thước", value: "Đường kính 40cm - 45cm" },
            { label: "Trọng lượng", value: "150g" }
        ],
        images: [
            "/placeholder.svg?height=600&width=600"
        ],
        brandId: 6
    },
    {
        id: 12,
        name: "Giỏ Đan Tre",

        description: "Giỏ đan tre thủ công từ làng nghề truyền thống miền Tây",
        details: "Giỏ đan tre thủ công từ làng nghề miền Tây, bền chắc và tiện dụng.",
        priceNum: 150000,
        categoryId: 4,
        image: "/placeholder.svg?height=400&width=400",
        featured: false,
        inStock: true,
        stock: 40,
        specifications: [
            { label: "Chất liệu", value: "Lụa, tre" },
            { label: "Xuất xứ", value: "Hội An, Quảng Nam" },
            { label: "Kích thước", value: "Đường kính 40cm - 45cm" },
            { label: "Trọng lượng", value: "150g" }
        ],
        images: [
            "/placeholder.svg?height=600&width=600"
        ],
        brandId: 6
    },
];
