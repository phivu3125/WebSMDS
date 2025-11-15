'use client'

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
import { EditorToolbar } from './EditorToolbar'
import { LinkDialog } from './LinkDialog'

export interface SimpleRichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
  rows?: number  // Add this for backward compatibility
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
      // Removed Enter handler completely to let TipTap handle default behavior
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
            class: 'mb-3'
          }
        },
        heading: {
          HTMLAttributes: {
            class: 'mb-3'
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
          '[&_.ProseMirror_*]:cursor-text [&_.ProseMirror_*]:select-none',
          '[&_.ProseMirror img]:cursor-default [&_.ProseMirror img]:select-none [&_.ProseMirror img]:pointer-events-none',
          '[&_.ProseMirror *]:cursor-text [&&_.ProseMirror *]:select-none',
          '[&_p]:mb-3 [&_h1]:mb-3 [&_h2]:mb-3 [&_h3]:mb-3',
          '[&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6'
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
    <div className={cn('border rounded-md overflow-hidden bg-background', className)}>
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