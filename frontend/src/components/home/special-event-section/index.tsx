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
    id: "note_01",
    name: "100 đồng",
    year: "1980",
    value: "100",
    image: "Note1.jpg",
    description: ""
  },
  {
    id: "note_02",
    name: "5000 đồng",
    year: "1987",
    value: "5000",
    image: "Note2.jpg",
    description: ""
  },
  {
    id: "note_03",
    name: "100000 đồng",
    year: "1994",
    value: "200.000",
    image: "Note3.jpg",
    description: ""
  },
  {
    id: "note_04",
    name: "2 đồng",
    year: "1958",
    value: "2",
    image: "Note4.jpg",
    description: ""
  },
  {
    id: "note_05",
    name: "5 đồng",
    year: "1966",
    value: "5",
    image: "Note5.jpg",
    description: ""
  },
  {
    id: "note_06",
    name: "50 đồng",
    year: "1950",
    value: "50",
    image: "Note6.jpg",
    description: ""
  },
]

type Screen = "upload" | "filter" | "result"

// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_GEMINI_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    PROCESS_IMAGE: '/run'
  },
  TIMEOUT: 300000 // 5 minutes
}

// Utility function to convert data URL to File
const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// API service function for image processing
const callImageProcessingAPI = async (
  inputImage: File,
  banknoteChoice: string
): Promise<string[]> => {
  const formData = new FormData()
  formData.append('input_image', inputImage)
  formData.append('banknote_choice', banknoteChoice)

  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROCESS_IMAGE}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()
  if (result.error) {
    throw new Error(result.error)
  }

  return result.outputs || []
}

export default function SpecialEventSection() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("upload")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<CurrencyFilter | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [generationCount, setGenerationCount] = useState(1)

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl)
    setCurrentScreen("filter")
  }

  const handleFilterSelect = async (filter: CurrencyFilter) => {
    setSelectedFilter(filter)
    setIsLoading(true)
    setError(null)

    try {
      // Convert uploaded image data URL to File
      const inputImageFile = dataURLtoFile(uploadedImage!, 'user-photo.jpg')

      // Call the API with the selected banknote choice (using ID)
      const processedImages = await callImageProcessingAPI(inputImageFile, filter.id)

      if (processedImages.length > 0) {
        // Construct full URL for the processed image
        const fullImageUrl = `${API_CONFIG.BASE_URL}${processedImages[0]}`
        setProcessedImage(fullImageUrl)
        setGenerationCount(1) // Reset generation count for new filter selection
        setCurrentScreen("result")
      } else {
        throw new Error("No processed image returned from API")
      }
    } catch (err) {
      console.error('Error processing image:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestart = () => {
    setCurrentScreen("upload")
    setUploadedImage(null)
    setSelectedFilter(null)
    setProcessedImage(null)
    setError(null)
    setIsLoading(false)
    setIsRegenerating(false)
    setGenerationCount(1)
  }

  const handleBack = () => {
    if (currentScreen === "filter") {
      setCurrentScreen("upload")
      setUploadedImage(null)
      setError(null)
      setGenerationCount(1)
    } else if (currentScreen === "result") {
      setCurrentScreen("filter")
      setProcessedImage(null)
      setSelectedFilter(null)
      setError(null)
      setIsRegenerating(false)
      setGenerationCount(1)
    }
  }

  const handleRegenerate = async () => {
    if (!selectedFilter || !uploadedImage) return

    setIsRegenerating(true)
    setError(null)

    try {
      // Convert uploaded image data URL to File
      const inputImageFile = dataURLtoFile(uploadedImage, 'user-photo.jpg')

      // Call the API with the same selected banknote choice (using ID)
      const processedImages = await callImageProcessingAPI(inputImageFile, selectedFilter.id)

      if (processedImages.length > 0) {
        // Construct full URL for the processed image
        const fullImageUrl = `${API_CONFIG.BASE_URL}${processedImages[0]}`
        setProcessedImage(fullImageUrl)
        setGenerationCount(prev => prev + 1) // Increment generation count
      } else {
        throw new Error("No processed image returned from API")
      }
    } catch (err) {
      console.error('Error regenerating image:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsRegenerating(false)
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
            Một hành trình thời gian qua những tờ tiền Việt, được tái hiện bằng công nghệ AI
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
              Chọn mẫu tiền
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
                isLoading={isLoading}
                error={error}
              />
            )}
            {currentScreen === "result" && (
              <ResultScreen
                originalImage={uploadedImage!}
                processedImage={processedImage!}
                selectedFilter={selectedFilter!}
                onRestart={handleRestart}
                onBack={() => handleBack()}
                onRegenerate={handleRegenerate}
                isRegenerating={isRegenerating}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}