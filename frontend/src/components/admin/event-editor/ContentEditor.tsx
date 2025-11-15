"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Extension } from '@tiptap/core'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { EditorToolbar } from '../editor/EditorToolbar'
import { LinkDialog } from '../editor/LinkDialog'
import { CustomImage } from './ImageExtension'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, Heading1, Heading2, Heading3, Quote, Minus } from 'lucide-react'

interface ContentEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
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
    }
  },
})

export function ContentEditor({
  value,
  onChange,
  placeholder = 'Bắt đầu viết nội dung chi tiết về sự kiện...',
  className = '',
  editable = true,
}: ContentEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
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
          '[&_p]:mb-4 [&_h1]:mb-4 [&_h2]:mb-4 [&_h3]:mb-4',
          '[&_h1]:text-3xl [&_h1]:font-serif [&_h1]:font-bold [&_h1]:text-purple-800 [&_h1]:mt-8',
          '[&_h2]:text-2xl [&_h2]:font-serif [&_h2]:font-semibold [&_h2]:text-purple-700 [&_h2]:mt-6',
          '[&_h3]:text-xl [&_h3]:font-serif [&_h3]:font-semibold [&_h3]:text-purple-600 [&_h3]:mt-4',
          '[&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-purple-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:bg-purple-50 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:font-serif'
        ),
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
    const selectedText = editor?.state.doc.textBetween(
      selection.from,
      selection.to
    )

    setLinkText(selectedText || '')
    setLinkUrl('')
    setShowLinkDialog(true)
  }

  const insertHeading = (level: number) => {
    editor?.chain().focus().toggleHeading({ level }).run()
  }

  const insertQuote = () => {
    editor?.chain().focus().toggleBlockquote().run()
  }

  const insertHorizontalRule = () => {
    editor?.chain().focus().setHorizontalRule().run()
  }

  const insertImage = () => {
    editor?.chain().focus().setCustomImage({
      src: '',
      alt: '',
      title: '',
      align: 'center'
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
        <div className={cn('border rounded-md overflow-hidden bg-background', className)}>
          {editable && (
            <EditorToolbar
              editor={editor}
              onLinkDialogOpen={handleLinkDialogOpen}
            />
          )}

          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none [&_.ProseMirror]:min-h-[300px]"
          />

          {!editor.getText() && (
            <div className="absolute top-[140px] left-6 pointer-events-none text-muted-foreground">
              {placeholder}
            </div>
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