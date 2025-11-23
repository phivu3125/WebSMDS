"use client"

import { useState, useRef } from "react"
import ImageUploadScreen from "./upload-screen"
import FilterSelectionScreen from "./filter-selection-screen"
import ResultScreen from "./result-screen"
import { useBusinessHours } from "../../../hooks/useBusinessHours"

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
    image: "/images/currency-notes/Note1.jpg",
    description: ""
  },
  {
    id: "note_02",
    name: "5000 đồng",
    year: "1987",
    value: "5000",
    image: "/images/currency-notes/Note2.jpg",
    description: ""
  },
  {
    id: "note_03",
    name: "100000 đồng",
    year: "1994",
    value: "200.000",
    image: "/images/currency-notes/Note3.jpg",
    description: ""
  },
  {
    id: "note_04",
    name: "2 đồng",
    year: "1958",
    value: "2",
    image: "/images/currency-notes/Note4.jpg",
    description: ""
  },
  {
    id: "note_05",
    name: "5 đồng",
    year: "1966",
    value: "5",
    image: "/images/currency-notes/Note5.jpg",
    description: ""
  },
  {
    id: "note_06",
    name: "5 đồng",
    year: "1966",
    value: "5",
    image: "/images/currency-notes/Note6.jpg",
    description: ""
  },
]

type Screen = "upload" | "filter" | "result"

// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_GEMINI_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    PROCESS_IMAGE: '/run',
    REGENERATE_STEP2: '/regenerate-step2'
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

// Type for API response
interface ImageProcessingResponse {
  returncode: number
  run_id: string
  outputs: string[]
  step_outputs: {
    step1: string[]
    step2: string[]
  }
  banknote_used: string
  input_image_path?: string
  input_filename?: string
  regeneration_timestamp?: string
}

// API service function for image processing
const callImageProcessingAPI = async (
  inputImage: File,
  banknoteChoice: string
): Promise<ImageProcessingResponse> => {
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

  return result as ImageProcessingResponse
}

// API service function for step2-only regeneration
const callRegenerateStep2API = async (
  runId: string,
  banknoteChoice: string
): Promise<ImageProcessingResponse> => {
  const formData = new FormData()
  formData.append('run_id', runId)
  formData.append('banknote_choice', banknoteChoice)

  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGENERATE_STEP2}`, {
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

  return result as ImageProcessingResponse
}

export default function SpecialEventSection() {
  const { isBusinessHours } = useBusinessHours()
  const [currentScreen, setCurrentScreen] = useState<Screen>("upload")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<CurrencyFilter | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [generationCount, setGenerationCount] = useState(1)
  const [runId, setRunId] = useState<string | null>(null)

  // Background regeneration state
  const [cachedImageUrl, setCachedImageUrl] = useState<string | null>(null)
  const [isBackgroundRegenerating, setIsBackgroundRegenerating] = useState(false)
  const [showFakeLoading, setShowFakeLoading] = useState(false)

  // Refs to store current values for setTimeout callback
  const runIdRef = useRef<string | null>(null)
  const selectedFilterRef = useRef<CurrencyFilter | null>(null)
  const backgroundTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Helper functions to update both state and refs
  const updateRunId = (newRunId: string | null) => {
    setRunId(newRunId)
    runIdRef.current = newRunId
  }

  const updateSelectedFilter = (newFilter: CurrencyFilter | null) => {
    setSelectedFilter(newFilter)
    selectedFilterRef.current = newFilter
  }

  // Clear any pending background regeneration
  const clearBackgroundTimeout = () => {
    if (backgroundTimeoutRef.current) {
      clearTimeout(backgroundTimeoutRef.current)
      backgroundTimeoutRef.current = null
    }
  }

  // Abort background regeneration
  const abortBackgroundRegeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    clearBackgroundTimeout()
    setIsBackgroundRegenerating(false)
  }

  // Handle regeneration function for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRegenerate = async () => {
    if (!selectedFilter || !uploadedImage) return

    // Clear any background regeneration when user starts new regeneration
    clearBackgroundTimeout()
    setCachedImageUrl(null)
    setIsBackgroundRegenerating(false)
    setShowFakeLoading(false)

    setIsRegenerating(true)
    setError(null)

    try {
      // Convert uploaded image data URL to File
      const inputImageFile = dataURLtoFile(uploadedImage, 'user-photo.jpg')

      // Call the API with the same selected banknote choice (using ID)
      const response = await callImageProcessingAPI(inputImageFile, selectedFilter.id)

      if (response.outputs.length > 0) {
        // Construct full URL for the processed image
        const fullImageUrl = `${API_CONFIG.BASE_URL}${response.outputs[0]}`
        setProcessedImage(fullImageUrl)
        updateRunId(response.run_id) // Update run_id with new regeneration
        setGenerationCount(prev => prev + 1) // Increment generation count

        // Start background regeneration after initial generation
        if (isBusinessHours()) {
          clearBackgroundTimeout()
          backgroundTimeoutRef.current = setTimeout(() => {
            startBackgroundRegeneration()
          }, 1000)
        }
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

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl)
    setCurrentScreen("filter")
  }

  const handleFilterSelect = async (filter: CurrencyFilter) => {
    updateSelectedFilter(filter)
    setIsLoading(true)
    setError(null)

    // Clear any existing cache and abort background regeneration when selecting new filter
    setCachedImageUrl(null)
    abortBackgroundRegeneration()

    try {
      // Always generate from scratch
      const inputImageFile = dataURLtoFile(uploadedImage!, 'user-photo.jpg')
      const response = await callImageProcessingAPI(inputImageFile, filter.id)

      if (response.outputs.length > 0) {
        const fullImageUrl = `${API_CONFIG.BASE_URL}${response.outputs[0]}`
        setProcessedImage(fullImageUrl)
        updateRunId(response.run_id)
        setGenerationCount(1)
        setCurrentScreen("result")

        // Start background regeneration immediately if business hours
        if (isBusinessHours()) {
          clearBackgroundTimeout()
          backgroundTimeoutRef.current = setTimeout(() => {
            startBackgroundRegeneration()
          }, 1000)
        }
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
    updateSelectedFilter(null)
    setProcessedImage(null)
    setError(null)
    setIsLoading(false)
    setIsRegenerating(false)
    setGenerationCount(1)
    updateRunId(null)
    setCachedImageUrl(null) // Clear cache
    setIsBackgroundRegenerating(false) // Clear background state
    setShowFakeLoading(false) // Clear fake loading
    abortBackgroundRegeneration() // Abort any running background regeneration
  }

  const handleBack = () => {
    if (currentScreen === "filter") {
      setCurrentScreen("upload")
      setUploadedImage(null)
      setError(null)
      setGenerationCount(1)
      updateRunId(null)
      updateSelectedFilter(null) // Also clear selected filter
      setCachedImageUrl(null) // Clear cache
      setIsBackgroundRegenerating(false) // Clear background state
      setShowFakeLoading(false) // Clear fake loading
      abortBackgroundRegeneration() // Abort any running background regeneration
    } else if (currentScreen === "result") {
      setCurrentScreen("filter")
      setProcessedImage(null)
      // Keep selectedFilter so user can see current choice when going back to filter screen
      setError(null)
      setIsRegenerating(false)
      setGenerationCount(1)
      // Keep runId and cache for background regeneration
      setIsBackgroundRegenerating(false) // Clear background state
      setShowFakeLoading(false) // Clear fake loading
      abortBackgroundRegeneration() // Abort any running background regeneration
    }
  }

  const handleRegenerateStep2 = async () => {
    if (!selectedFilter || !runId) return

    // Use cached result if available for instant response
    if (cachedImageUrl) {
      // Show fake loading for 1-3 seconds to make it feel like processing
      setShowFakeLoading(true)

      setTimeout(() => {
        setProcessedImage(cachedImageUrl)
        setCachedImageUrl(null) // Clear cache after using
        setGenerationCount(prev => prev + 1)
        setShowFakeLoading(false)
      }, 2000) // 2 seconds fake loading

      return
    }

    // Clear any pending background regeneration when user starts regeneration
    abortBackgroundRegeneration()
    setShowFakeLoading(false) // Clear fake loading
    setIsRegenerating(true)
    setError(null)

    try {
      // Call the step2 regeneration API
      const response = await callRegenerateStep2API(runId, selectedFilter.id)

      if (response.outputs.length > 0) {
        // Construct full URL for the processed image
        const fullImageUrl = `${API_CONFIG.BASE_URL}${response.outputs[0]}`
        setProcessedImage(fullImageUrl)
        setGenerationCount(prev => prev + 1)

        // Start background regeneration after user regeneration
        if (isBusinessHours()) {
          clearBackgroundTimeout()
          backgroundTimeoutRef.current = setTimeout(() => {
            startBackgroundRegeneration()
          }, 1000)
        }
      } else {
        throw new Error("No processed image returned from step2 regeneration API")
      }
    } catch (err) {
      console.error('Error regenerating step2:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsRegenerating(false)
    }
  }

  // Background regeneration function
  const startBackgroundRegeneration = async () => {
    // Use refs to get current values (available in setTimeout callback)
    const currentRunId = runIdRef.current
    const currentSelectedFilter = selectedFilterRef.current

    if (!currentRunId || !currentSelectedFilter || isBackgroundRegenerating) {
      return
    }

    // Create new AbortController for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setIsBackgroundRegenerating(true)

    try {
      // Check if aborted before making API call
      if (abortController.signal.aborted) {
        return
      }

      const response = await callRegenerateStep2API(currentRunId, currentSelectedFilter.id)

      // Check if aborted during API call
      if (abortController.signal.aborted) {
        return
      }

      if (response.outputs.length > 0) {
        const newImageUrl = `${API_CONFIG.BASE_URL}${response.outputs[0]}`
        setCachedImageUrl(newImageUrl)

        // Auto-trigger next background regeneration if still in business hours and not aborted
        if (isBusinessHours() && runIdRef.current && selectedFilterRef.current && !abortController.signal.aborted) {
          backgroundTimeoutRef.current = setTimeout(() => {
            startBackgroundRegeneration()
          }, 5000) // 5 seconds delay before next background regeneration
        }
      }
    } catch (error) {
      // Error handled silently for production
    } finally {
      // Only set false if this is still the current abortController
      if (abortControllerRef.current === abortController) {
        setIsBackgroundRegenerating(false)
      }
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
                onRegenerateStep2={handleRegenerateStep2}
                isRegenerating={isRegenerating}
                isFakeLoading={showFakeLoading}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}