import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Playfair_Display } from 'next/font/google'
import ErrorBoundary from '@/components/ErrorBoundary.client'
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })


export const metadata: Metadata = {
  title: "Sắc Màu Di Sản",
  description:
    "Sắc Màu Di Sản là hành trình của những con người trẻ chọn đồng hành cùng di sản bằng sự sáng tạo và niềm tự hào văn hóa Việt.",
  generator: "v0.app",
  icons: {
    icon: '/images/logo.png',
  },
}

const playfair = Playfair_Display({ 
  subsets: ['vietnamese'],
  display: 'swap',
  variable: '--font-playfair',
  preload: true
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`font-sans antialiased ${playfair.variable}`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
