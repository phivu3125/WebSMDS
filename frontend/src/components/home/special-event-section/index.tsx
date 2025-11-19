"use client"

import { useState } from "react"
import ImageUploadScreen from "./upload-screen"
import FilterSelectionScreen from "./filter-selection-screen"
import ResultScreen from "./result-screen"

export type CurrencyFilter = {
  id: string
  name: string
  year: string
  value: string
  image: string
  description: string
}

const historicalCurrencies: CurrencyFilter[] = [
  {
    id: "1",
    name: "500.000₫",
    year: "2003",
    value: "500.000",
    image: "/images/currency-500k.jpg",
    description: ""
  },
  {
    id: "2",
    name: "200.000₫",
    year: "2006",
    value: "200.000",
    image: "/images/currency-200k.jpg",
    description: ""
  },
  {
    id: "3",
    name: "100.000₫",
    year: "2004",
    value: "100.000",
    image: "/images/currency-100k.jpg",
    description: ""
  },
  {
    id: "4",
    name: "50.000₫",
    year: "2003",
    value: "50.000",
    image: "/images/currency-50k.jpg",
    description: ""
  },
  {
    id: "5",
    name: "20.000₫",
    year: "2006",
    value: "20.000",
    image: "/images/currency-20k.jpg",
    description: ""
  },
  {
    id: "6",
    name: "10.000₫",
    year: "2006",
    value: "10.000",
    image: "/images/currency-10k.jpg",
    description: ""
  }
]

type Screen = "upload" | "filter" | "result"

export default function SpecialEventSection() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("upload")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<CurrencyFilter | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl)
    setCurrentScreen("filter")
  }

  const handleFilterSelect = (filter: CurrencyFilter) => {
    setSelectedFilter(filter)
    setTimeout(() => {
      setProcessedImage(uploadedImage)
      setCurrentScreen("result")
    }, 2000)
  }

  const handleRestart = () => {
    setCurrentScreen("upload")
    setUploadedImage(null)
    setSelectedFilter(null)
    setProcessedImage(null)
  }

  const handleBack = () => {
    if (currentScreen === "filter") {
      setCurrentScreen("upload")
      setUploadedImage(null)
    } else if (currentScreen === "result") {
      setCurrentScreen("filter")
      setProcessedImage(null)
      setSelectedFilter(null)
    }
  }

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#e7eef7' }}>
      {/* Hero Header - Clean & Minimal */}
      <div className="relative px-6 py-12 text-center sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance" style={{ color: '#723d2c' }}>
            DI SẢN TIỀN TỆ
          </h2>
          <p className="text-base" style={{ color: '#855923' }}>
            Khám phá vẻ đẹp tiền polymer qua công nghệ xử lý ảnh
          </p>
        </div>
      </div>

      {/* Minimal Progress Indicator */}
      <div className="relative px-6 pb-8 sm:px-8">
        <div className="mx-auto flex max-w-md items-center justify-center space-x-4">
          <div className={`text-center transition-colors flex flex-col items-center ${currentScreen === "upload" ? "" : "opacity-40"
            }`}>
            <div className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${currentScreen === "upload" ? "border-[#aa7638] bg-[#aa7638] text-white" : "border-gray-300 bg-white text-gray-400"
              }`}>
              <span className="text-sm font-bold">1</span>
            </div>
            <span className="text-xs font-medium" style={{ color: currentScreen === "upload" ? '#aa7638' : '#957048' }}>
              Tải ảnh
            </span>
          </div>
          <div className={`text-center transition-colors flex flex-col items-center ${currentScreen === "filter" ? "" : "opacity-40"
            }`}>
            <div className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${currentScreen === "filter" ? "border-[#aa7638] bg-[#aa7638] text-white" : "border-gray-300 bg-white text-gray-400"
              }`}>
              <span className="text-sm font-bold">2</span>
            </div>
            <span className="text-xs font-medium" style={{ color: currentScreen === "filter" ? '#aa7638' : '#957048' }}>
              Chọn mệnh giá
            </span>
          </div>
          <div className={`text-center transition-colors flex flex-col items-center ${currentScreen === "result" ? "" : "opacity-40"
            }`}>
            <div className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${currentScreen === "result" ? "border-[#aa7638] bg-[#aa7638] text-white" : "border-gray-300 bg-white text-gray-400"
              }`}>
              <span className="text-sm font-bold">3</span>
            </div>
            <span className="text-xs font-medium" style={{ color: currentScreen === "result" ? '#aa7638' : '#957048' }}>
              Kết quả
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative pb-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          <div className="rounded-2xl bg-white shadow-xl border" style={{ borderColor: '#c4b3a4' }}>
            {currentScreen === "upload" && (
              <ImageUploadScreen onImageUpload={handleImageUpload} />
            )}
            {currentScreen === "filter" && (
              <FilterSelectionScreen
                uploadedImage={uploadedImage!}
                currencies={historicalCurrencies}
                onFilterSelect={handleFilterSelect}
                onBack={() => handleBack()}
              />
            )}
            {currentScreen === "result" && (
              <ResultScreen
                originalImage={uploadedImage!}
                processedImage={processedImage!}
                selectedFilter={selectedFilter!}
                onRestart={handleRestart}
                onBack={() => handleBack()}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}