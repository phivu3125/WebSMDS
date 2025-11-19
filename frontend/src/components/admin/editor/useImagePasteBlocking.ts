import { useState } from 'react'

/**
 * Hook for blocking image paste with intelligent content filtering
 * Provides detection and notification logic for preventing image paste
 */
export const useImagePasteBlocking = () => {
  const [imagePasteNotification, setImagePasteNotification] = useState(false)

  /**
   * Check if clipboard contains images and show notification if needed
   * @param clipboardData - Clipboard data from paste event
   * @returns Object with hasImages flag and processed content
   */
  const checkForImages = (clipboardData: DataTransfer | null): { hasImages: boolean; showNotification: boolean } => {
    let hasImages = false
    let showNotification = false

    if (!clipboardData) {
      return { hasImages: false, showNotification: false }
    }

    // LAYER 1: File-based detection
    if (clipboardData?.files && clipboardData.files.length > 0) {
      hasImages = Array.from(clipboardData.files).some(file => {
        const fileType = file.type.toLowerCase()
        const fileName = file.name.toLowerCase()
        return (
          fileType.startsWith('image/') ||
          fileType.includes('image') ||
          fileType === 'application/octet-stream' ||
          fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg|ico|tiff|tif|psd|raw|heic|heif)$/i)
        )
      })
      if (hasImages) showNotification = true
    }

    // LAYER 2: HTML content image detection
    const htmlContent = clipboardData.getData('text/html') || ''
    const htmlImagePatterns = [
      /<img[^>]+>/gi,
      /<picture[^>]*>[\s\S]*?<\/picture>/gi,
      /src\s*=\s*["'][^"']*\.(jpg|jpeg|png|gif|webp|bmp|svg|ico|tiff|tif)(\?[^"']*)?["']/gi,
      /data:image\/[^;]+;base64/gi,
      /background-image\s*:\s*url\([^)]*\.(jpg|jpeg|png|gif|webp|bmp|svg|ico|tiff|tif)\)/gi,
      /<figure[^>]*>[\s\S]*?<img[^>]*>[\s\S]*?<\/figure>/gi,
    ]

    if (htmlContent && htmlImagePatterns.some(pattern => pattern.test(htmlContent))) {
      hasImages = true
      showNotification = true
    }

    // LAYER 3: Rich text format detection
    const rtfContent = clipboardData.getData('text/rtf') || ''
    if (rtfContent && rtfContent.includes('\\pict')) {
      hasImages = true
      showNotification = true
    }

    // Show notification if images were detected
    if (showNotification) {
      setImagePasteNotification(true)
      setTimeout(() => setImagePasteNotification(false), 3000)
    }

    return { hasImages, showNotification }
  }

  /**
   * Handle paste event with image blocking
   * @param event - Paste event
   * @param view - TipTap editor view
   * @param processContent - Function to process HTML content
   * @returns Boolean indicating if paste was handled
   */
  const handlePasteWithBlocking = (
    event: ClipboardEvent,
    view: any,
    processContent: (html: string) => string
  ): boolean => {
    const clipboardData = event.clipboardData

    // Check for images in clipboard
    const { hasImages, showNotification } = checkForImages(clipboardData)

    // Get HTML content for structure detection
    event.preventDefault()

    const htmlContent = clipboardData?.getData('text/html') || ''
    const plainText = clipboardData?.getData('text/plain') || ''

    if (htmlContent) {
      // Process HTML content to extract structure while cleaning document formatting
      const processedHtml = processContent(htmlContent)

      // Use TipTap's commands to insert cleaned HTML
      const { state, dispatch } = view
      const { from, to } = state.selection

      // Create a temporary div and parse with TipTap's DOM parser
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = processedHtml
      const { DOMParser } = require('prosemirror-model')
      const parser = DOMParser.fromSchema(view.state.schema)
      const fragment = parser.parse(tempDiv, { preserveWhitespace: true })

      const tr = state.tr.replaceWith(from, to, fragment.content)
      dispatch(tr)

      return true
    } else if (plainText) {
      // Fallback to plain text processing if no HTML content
      const lines = plainText.split('\n')
      let processedHtmlContent = ''

      lines.forEach((line) => {
        const trimmedLine = line.trim()

        if (trimmedLine === '') {
          // Empty line - just add a paragraph break
          processedHtmlContent += '<p></p>'
        } else {
          // Regular paragraph
          processedHtmlContent += `<p>${trimmedLine}</p>`
        }
      })

      // Use TipTap's commands to insert cleaned HTML
      const { state, dispatch } = view
      const { from, to } = state.selection

      // Create a temporary div and parse with TipTap's DOM parser
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = processedHtmlContent
      const { DOMParser } = require('prosemirror-model')
      const parser = DOMParser.fromSchema(view.state.schema)
      const fragment = parser.parse(tempDiv, { preserveWhitespace: true })

      const tr = state.tr.replaceWith(from, to, fragment.content)
      dispatch(tr)

      return true
    }

    return false
  }

  return {
    imagePasteNotification,
    setImagePasteNotification,
    checkForImages,
    handlePasteWithBlocking
  }
}