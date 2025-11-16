'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Extension } from '@tiptap/core'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import { DOMParser } from 'prosemirror-model'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { EditorToolbar } from './EditorToolbar'
import { LinkDialog } from './LinkDialog'
import { BubbleMenuComponent } from './BubbleMenu'

export interface SimpleRichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
  rows?: number  // Add this for backward compatibility
}

// Enhanced heading detection function
const detectHeading = (line: string, index: number, allLines: string[]): 'h1' | 'h2' | 'h3' | null => {
  // Skip empty lines
  if (!line || line.length === 0) return null

  const trimmedLine = line.trim()
  const lineLength = trimmedLine.length

  // Check for Vietnamese and other Unicode characters
  const hasUnicodeChars = /[^\x00-\x7F]/.test(trimmedLine)

  // Check if line is in ALL CAPS (likely a heading)
  const isAllCaps = trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 0 && /[A-ZÀ-Ỹ]/.test(trimmedLine)

  // Check if line starts with heading indicators
  const startsWithHeadingIndicator = /^(Chương|Chapter|Phần|Section|Mục|PHẦN|CHƯƠNG|DANH MỤC|ĐỀ MỤC|PHẦN \d+|CHƯƠNG \d+)/i.test(trimmedLine)

  // Check for Roman numerals (I, II, III, IV, V, etc.)
  const hasRomanNumeral = /^(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX|[IVX]+)\.?\s*/i.test(trimmedLine)

  // Check for number patterns (1., 2., 3., etc.)
  const hasNumberPattern = /^(\d+\.|\d+\))\s*/.test(trimmedLine)

  // Line length criteria (shorter lines are more likely to be headings)
  const isShort = lineLength < 80
  const isMedium = lineLength < 120

  // Position-based detection (first few lines more likely to be headings)
  const isEarlyInContent = index < 5

  // Enhanced heading detection logic
  if (isAllCaps && (isShort || isMedium) && isEarlyInContent) {
    // ALL CAPS lines are strong heading indicators
    return lineLength < 50 ? 'h1' : 'h2'
  }

  if (startsWithHeadingIndicator) {
    // Explicit heading markers
    return 'h2'
  }

  if (hasRomanNumeral || hasNumberPattern) {
    // Numbered lines
    return 'h2'
  }

  // Vietnamese specific patterns - check for common Vietnamese heading words
  const vietnameseHeadingWords = [
    'GIỚI THIỆU', 'LỜI LỜI', 'ĐẦM BẮO', 'TỔNG QUAN', 'MỤT TIÊU',
    'SƠ GIẢI', 'NỘI DUNG', 'TÓM TẮT', 'ĐẶC BIỆT',
    'MỤC ĐÍCH', 'PHẦN PHẦN', 'ĐIỀM MỤC', 'GIỚI THIỆU',
    'ĐỐNG TÁC', 'BỐ CỤC', 'LỊI THUỆT', 'CHỦNG MỤC',
    'MỤC TIÊU', 'THIẾT KẾT', 'ĐIỀM KẾT', 'GIỚI THIỆU'
  ]

  const isVietnameseHeading = vietnameseHeadingWords.some(word =>
    trimmedLine.toUpperCase().includes(word)
  )

  if (isVietnameseHeading && isShort && isEarlyInContent) {
    return 'h2'
  }

  // Multi-language detection for common heading patterns
  const headingPatterns = [
    // English
    /^(introduction|introduction|abstract|summary|conclusion|overview|background)/i,
    // Vietnamese
    /(?:giới thiệu|tổng quan|tóm tắt|kết luận|lời mở đầu|bối cảnh|sơ lược)/i,
    // Chinese/Japanese (common characters)
    /[第章第節引言结論]/,
    // Russian
    /^(введение|вывод|содержание|резюме)/i,
    // German/French
    /^(einleitung|conclusion|introduction|résumé)/i
  ]

  const isPatternHeading = headingPatterns.some(pattern => pattern.test(trimmedLine))

  if (isPatternHeading && (isShort || isMedium)) {
    return 'h3'
  }

  // Default heading detection for early content
  if (isEarlyInContent && isShort && !trimmedLine.includes('.') && !trimmedLine.includes(',')) {
    // Short, no punctuation, early in content - likely heading
    return hasUnicodeChars ? 'h2' : 'h1'
  }

  if (isEarlyInContent && isMedium && isAllCaps) {
    // Medium length, ALL CAPS, early in content
    return 'h2'
  }

  return null
}

// Custom keyboard shortcuts extension
const CustomKeyboardShortcuts = Extension.create({
  name: 'customKeyboardShortcuts',
  addKeyboardShortcuts() {
    return {
      'Mod-b': () => this.editor.chain().focus().toggleBold().run(),
      'Mod-i': () => this.editor.chain().focus().toggleItalic().run(),
      'Mod-u': () => this.editor.chain().focus().toggleUnderline().run(),
      'Mod-l': () => {
        if (this.editor.isActive('link')) {
          this.editor.chain().focus().unsetLink().run()
        } else {
          // This will be handled by the link dialog
          this.editor.commands.setLink({ href: '' })
        }
        return true
      },
      'Mod-a': () => {
        this.editor.chain().focus().selectAll().run()
        return true
      },
      // Smart Enter key: intelligent heading behavior
      'Enter': () => {
        const { state } = this.editor
        const { $from } = state.selection

        // Check if current node is a heading
        const currentDepth = $from.depth
        let currentNode = $from.node(currentDepth)

        // Helper function to check if we're at the end of current line
        const isAtEndOfLine = () => {
          return $from.parentOffset === $from.parent.content.size
        }

        // If we're inside a heading node
        if (currentNode && currentNode.type.name === 'heading') {
          if (isAtEndOfLine()) {
            // At end of heading: create new paragraph without extra spacing
            return this.editor.chain().focus().createParagraphNear().run()
          } else {
            // In middle of heading: create line break within heading
            return this.editor.chain().focus().setHardBreak().run()
          }
        }

        // Check parent nodes for heading context
        for (let depth = currentDepth; depth >= 0; depth--) {
          const node = $from.node(depth)
          if (node && node.type.name === 'heading') {
            if (isAtEndOfLine() || node.content.size === 0) {
              // At end of heading or empty heading: create new paragraph without extra spacing
              return this.editor.chain().focus().createParagraphNear().run()
            } else {
              // In middle of heading: split normally
              return false // Let TipTap handle default behavior
            }
          }
        }

        // For all other cases, use default TipTap behavior
        return false
      },
      'Shift-Enter': () => this.editor.chain().focus().setHardBreak().run(),
    }
  },
})

export default function SimpleRichEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  className = '',
  editable = true,
  rows, // Accept rows prop for backward compatibility but don't use it
}: SimpleRichEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-2'
          }
        },
        heading: {
          HTMLAttributes: {
            class: 'mb-2'
          }
        }
      }).configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        linkOnPaste: true,
      }),
      CustomKeyboardShortcuts,
    ],
    content: value,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none',
          'focus:outline-none min-h-[150px] p-4',
          '[&_.ProseMirror]:min-h-[150px] [&_.ProseMirror_focus]:outline-none',
          '[&_.ProseMirror]:cursor-text',
          '[&_.ProseMirror img]:cursor-default [&_.ProseMirror img]:pointer-events-none',
          '[&_p]:mb-0 [&_h1]:mb-0 [&_h0]:mb-0 [&_h3]:mb-0',
          '[&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6'
        ),
        spellcheck: "false",
      },
      handlePaste: (view, event) => {
        // Get plain text from clipboard to avoid Word formatting
        event.preventDefault()
        const text = event.clipboardData?.getData('text/plain') || ''

        if (text) {
          // Convert plain text lines to proper content
          const lines = text.split('\n')
          let htmlContent = ''

          lines.forEach((line, index) => {
            const trimmedLine = line.trim()

            if (trimmedLine === '') {
              // Empty line - just add a paragraph break
              htmlContent += '<p></p>'
            } else {
              // Enhanced heading detection
              const isHeading = detectHeading(trimmedLine, index, lines)

              if (isHeading) {
                const level = isHeading === 'h1' ? 1 : isHeading === 'h2' ? 2 : 3
                htmlContent += `<h${level}>${trimmedLine}</h${level}>`
              } else {
                // Regular paragraph
                htmlContent += `<p>${trimmedLine}</p>`
              }
            }
          })

          // Use TipTap's commands to insert cleaned HTML
          const { state, dispatch } = view
          const { from, to } = state.selection

          // Create a temporary div and parse with TipTap's DOM parser
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = htmlContent
          const parser = DOMParser.fromSchema(view.state.schema)
          const fragment = parser.parse(tempDiv, { preserveWhitespace: true })

          const tr = state.tr.replaceWith(from, to, fragment.content)
          dispatch(tr)

          return true
        }

        return false
      },
    },
  })

  // Sync editor content with value prop
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  const handleAddLink = (url: string, text?: string) => {
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run()
      if (text && editor?.state.selection.empty) {
        editor.chain().focus().insertContent(text).run()
      }
    } else {
      editor?.chain().focus().unsetLink().run()
    }
  }

  const handleLinkDialogOpen = () => {
    const selection = editor?.state.selection
    const selectedText = selection
      ? editor?.state.doc.textBetween(selection.from, selection.to)
      : ''

    setLinkText(selectedText || '')
    setLinkUrl('')
    setShowLinkDialog(true)
  }

  if (!editor) {
    return (
      <div className="border rounded-md p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('border rounded-md overflow-hidden bg-background relative', className)}>
      {editable && (
        <EditorToolbar
          editor={editor}
          onLinkDialogOpen={handleLinkDialogOpen}
        />
      )}

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none [&_.ProseMirror]:min-h-[150px]"
      />

      {!editor.getText() && (
        <div className="absolute top-[60px] left-4 pointer-events-none text-muted-foreground">
          {placeholder}
        </div>
      )}

      {/* Bubble Menu for selected text */}
      {editable && <BubbleMenuComponent editor={editor} />}

      <LinkDialog
        isOpen={showLinkDialog}
        onClose={() => setShowLinkDialog(false)}
        onAddLink={handleAddLink}
        initialUrl={linkUrl}
        initialText={linkText}
      />
    </div>
  )
}

// Export components for standalone usage
export { EditorToolbar } from './EditorToolbar'
export { LinkDialog } from './LinkDialog'
export { EditorButton } from './EditorButton'
export { FontFamilyDropdown, FontSizeDropdown } from './EditorDropdown'