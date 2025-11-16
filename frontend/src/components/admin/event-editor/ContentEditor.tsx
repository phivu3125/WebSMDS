"use client"

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
import { EditorToolbar } from '../editor/EditorToolbar'
import { LinkDialog } from '../editor/LinkDialog'
import { CustomImage } from './ImageExtension'
import { EventBubbleMenu } from './EventBubbleMenu'
import { FloatingActionMenu } from '../editor/FloatingActionMenu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, Heading1, Heading2, Heading3, Quote, Minus } from 'lucide-react'

interface ContentEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  editable?: boolean
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
    /[第章第節引言結論]/,
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
          this.editor.commands.setLink({ href: '' })
        }
        return true
      },
      'Mod-a': () => {
        this.editor.chain().focus().selectAll().run()
        return true
      },
      // Smart Enter key: exit headings to paragraph without extra spacing
      'Enter': () => {
        const { state } = this.editor
        const { $from } = state.selection

        // Get parent node
        const parentNode = $from.parent
        const isHeading = parentNode.type.name === 'heading'
        const isAtEnd = $from.parentOffset === parentNode.content.size
        const isEmpty = parentNode.content.size === 0

        // If in heading at end or empty heading, exit to paragraph
        if (isHeading && (isAtEnd || isEmpty)) {
          // Split the current node and ensure the new node is a paragraph
          return this.editor.chain().focus().splitBlock().setNode('paragraph').run()
        }

        // If in middle of heading, split normally
        if (isHeading) {
          return false // Let TipTap handle default behavior
        }

        // For paragraphs and other nodes, use default behavior
        return false
      },
      'Shift-Enter': () => this.editor.chain().focus().setHardBreak().run(),
    }
  },
})

export function ContentEditor({
  value,
  onChange,
  className = '',
  editable = true,
}: ContentEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-0'
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
      CustomImage,
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
          'focus:outline-none min-h-[300px] p-6',
          '[&_.ProseMirror]:min-h-[300px] [&_.ProseMirror_focus]:outline-none',
          '[&_.ProseMirror]:cursor-text',
          '[&_.ProseMirror img]:cursor-default [&_.ProseMirror img]:pointer-events-none',
          '[&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto',
          '[&_p]:mb-0 [&_h1]:mb-2 [&_h2]:mb-2 [&_h3]:mb-2',
          '[&_h1]:text-3xl [&_h1]:font-serif [&_h1]:font-bold [&_h1]:text-purple-800 [&_h1]:mt-0',
          '[&_h2]:text-2xl [&_h2]:font-serif [&_h2]:font-semibold [&_h2]:text-purple-700 [&_h2]:mt-0',
          '[&_h3]:text-xl [&_h3]:font-serif [&_h3]:font-semibold [&_h3]:text-purple-600 [&_h3]:mt-0',
          '[&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-purple-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:bg-purple-50 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:font-serif'
        ),
        spellcheck: "false",
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

  const insertHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor?.chain().focus().toggleHeading({ level }).run()
  }

  const insertQuote = () => {
    editor?.chain().focus().toggleBlockquote().run()
  }

  const insertHorizontalRule = () => {
    editor?.chain().focus().setHorizontalRule().run()
  }

  const insertImage = () => {
    editor?.chain().focus().insertContent({
      type: 'customImage',
      attrs: {
        src: '',
        alt: '',
        title: '',
        align: 'center',
        width: '100%',
        height: 'auto'
      }
    }).run()
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Nội dung chi tiết</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertHeading(1)}
              className="h-8 w-8 p-0"
              title="Thêm Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertHeading(2)}
              className="h-8 w-8 p-0"
              title="Thêm Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertHeading(3)}
              className="h-8 w-8 p-0"
              title="Thêm Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={insertQuote}
              className="h-8 w-8 p-0"
              title="Thêm Trích dẫn"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={insertImage}
              className="h-8 w-8 p-0"
              title="Thêm Hình ảnh"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={insertHorizontalRule}
              className="h-8 w-8 p-0"
              title="Thêm Đường kẻ"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className={cn('border rounded-md overflow-hidden bg-background relative', className)}>
          {editable && (
            <EditorToolbar
              editor={editor}
              onLinkDialogOpen={handleLinkDialogOpen}
              showExtendedActions={true}
            />
          )}

          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none [&_.ProseMirror]:min-h-[300px]"
          />

          {/* Event Bubble Menu for selected text */}
          {editable && <EventBubbleMenu editor={editor} />}

          {/* Floating Action Menu for empty lines */}
          {editable && (
            <FloatingActionMenu
              editor={editor}
              onInsertImage={insertImage}
              onOpenLinkDialog={handleLinkDialogOpen}
            />
          )}

          <LinkDialog
            isOpen={showLinkDialog}
            onClose={() => setShowLinkDialog(false)}
            onAddLink={handleAddLink}
            initialUrl={linkUrl}
            initialText={linkText}
          />
        </div>
      </CardContent>
    </Card>
  )
}