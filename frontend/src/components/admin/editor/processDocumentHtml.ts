/**
 * Process HTML content from Word and Google Docs to extract structure while cleaning formatting
 * This utility removes images and background images while preserving text structure
 */

export const processDocumentHtml = (htmlContent: string): string => {
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent

  // Remove all image-related elements before processing
  const images = tempDiv.querySelectorAll('img, picture, figure')
  images.forEach(img => img.remove())

  // Remove background-image styles from all elements
  const allElements = tempDiv.querySelectorAll('*')
  allElements.forEach(element => {
    const style = element.getAttribute('style')
    if (style && style.includes('background-image')) {
      // Remove background-image from inline styles
      const newStyle = style.replace(/background-image\s*:\s*[^;]+;?/gi, '').trim()
      if (newStyle) {
        element.setAttribute('style', newStyle)
      } else {
        element.removeAttribute('style')
      }
    }
  })

  // Helper function to get heading level from Word and Google Docs style names
  const getHeadingLevel = (element: Element): number => {
    const styleName = element.getAttribute('style') || ''
    const className = element.className || ''
    const tagName = element.tagName.toLowerCase()

    // Check for actual heading tags first (most reliable)
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
      return parseInt(tagName.charAt(1))
    }

    // Check for Google Docs heading patterns - Enhanced detection
    if (className.includes('title') || className.includes('heading-1') || className.includes('docs-title') ||
        className.includes('docs-text-heading-1') || className.includes('docs-title-input') ||
        styleName.includes('font-size: 26pt') || styleName.includes('font-size: 32pt')) {
      return 1
    }
    if (className.includes('subtitle') || className.includes('heading-2') || className.includes('docs-subtitle') ||
        className.includes('docs-text-heading-2') || className.includes('docs-subtitle-input') ||
        styleName.includes('font-size: 20pt') || styleName.includes('font-size: 24pt')) {
      return 2
    }
    if (className.includes('heading-3') || className.includes('docs-heading-3') ||
        className.includes('docs-text-heading-3') ||
        styleName.includes('font-size: 18pt') || styleName.includes('font-size: 20pt')) {
      return 3
    }
    if (className.includes('heading-4') || className.includes('docs-heading-4') ||
        className.includes('docs-text-heading-4') ||
        styleName.includes('font-size: 16pt') || styleName.includes('font-size: 18pt')) {
      return 4
    }
    if (className.includes('heading-5') || className.includes('docs-heading-5') ||
        className.includes('docs-text-heading-5') ||
        styleName.includes('font-size: 14pt') || styleName.includes('font-size: 16pt')) {
      return 5
    }
    if (className.includes('heading-6') || className.includes('docs-heading-6') ||
        className.includes('docs-text-heading-6') ||
        styleName.includes('font-size: 12pt') || styleName.includes('font-size: 14pt')) {
      return 6
    }

    // Check for Google Docs font-family patterns
    if (styleName.includes('font-family: "Arial"') || styleName.includes('font-family: Arial') ||
        styleName.includes('font-family: "Helvetica"') || styleName.includes('font-family: Helvetica')) {
      // Google Docs typically uses Arial/Helvetica with specific font sizes
      const fontSize = styleName.match(/font-size:\s*(\d+(?:\.\d+)?)(pt|px|em)/i)
      if (fontSize) {
        const size = parseFloat(fontSize[1])
        if (size >= 26) return 1
        if (size >= 20) return 2
        if (size >= 16) return 3
      }
    }

    // Check for Word heading patterns
    if (styleName.includes('mso-heading') || className.includes('heading')) {
      if (styleName.includes('level-1') || className.includes('1')) return 1
      if (styleName.includes('level-2') || className.includes('2')) return 2
      if (styleName.includes('level-3') || className.includes('3')) return 3
      if (styleName.includes('level-4') || className.includes('4')) return 4
      if (styleName.includes('level-5') || className.includes('5')) return 5
      if (styleName.includes('level-6') || className.includes('6')) return 6
    }

    // Check font size heuristics for headings (fallback)
    const fontSize = (element as HTMLElement).style?.fontSize
    if (fontSize) {
      const size = parseFloat(fontSize)
      if (size >= 24) return 1
      if (size >= 20) return 2
      if (size >= 16) return 3
    }

    return 0 // Not a heading
  }

  // Helper function to check if element is a list
  const isListElement = (element: Element): boolean => {
    const tagName = element.tagName.toLowerCase()
    return tagName === 'ul' || tagName === 'ol' || tagName === 'li'
  }

  // Process all paragraph and text elements
  const processElements = (elements: NodeListOf<Element>): string => {
    let result = ''

    elements.forEach(element => {
      const tagName = element.tagName.toLowerCase()

      // Skip images and other non-text elements
      if (tagName === 'img' || tagName === 'table' || tagName === 'figure') {
        return
      }

      // Handle headings
      const headingLevel = getHeadingLevel(element)
      if (headingLevel > 0) {
        const text = element.textContent || ''
        if (text.trim()) {
          result += `<h${headingLevel}>${text.trim()}</h${headingLevel}>`
        }
        return
      }

      // Handle lists
      if (isListElement(element)) {
        const listHtml = processListElement(element)
        if (listHtml) {
          result += listHtml
        }
        return
      }

      // Handle paragraphs and other text blocks
      if (tagName === 'p' || tagName === 'div' || element.textContent?.trim()) {
        const text = element.textContent || ''
        if (text.trim()) {
          result += `<p>${text.trim()}</p>`
        }
      }
    })

    return result
  }

  // Process list elements recursively
  const processListElement = (element: Element): string => {
    const tagName = element.tagName.toLowerCase()
    const items = element.querySelectorAll(':scope > li')

    if (items.length === 0) return ''

    let listHtml = tagName === 'ol' ? '<ol>' : '<ul>'

    items.forEach(item => {
      const text = item.textContent?.trim() || ''
      if (text) {
        listHtml += `<li>${text}</li>`
      }
    })

    listHtml += tagName === 'ol' ? '</ol>' : '</ul>'
    return listHtml
  }

  // Get all direct child elements that might contain content
  const contentElements = tempDiv.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, ul, ol, li')

  // If no structured elements found, try to extract text content
  if (contentElements.length === 0) {
    const text = tempDiv.textContent || ''
    if (text.trim()) {
      const lines = text.split('\n').filter(line => line.trim())
      return lines.map(line => `<p>${line.trim()}</p>`).join('')
    }
    return ''
  }

  // Process the elements
  return processElements(contentElements)
}