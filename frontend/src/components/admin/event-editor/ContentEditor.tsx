"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
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
import { EventBubbleMenu } from './EventBubbleMenu'
import { FloatingActionMenu } from '../editor/FloatingActionMenu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ContentEditorProps {
  value: string
  onChange: (value: string) => void
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
      'Mod-a': () => {
        this.editor.chain().focus().selectAll().run()
        return true
      },
      // Smart Enter key: simplified logic for headings
      'Enter': () => {
        const { state } = this.editor
        const { $from } = state.selection

        // Get parent node
        const parentNode = $from.parent
        const isHeading = parentNode.type.name === 'heading'
        const isAtEnd = $from.parentOffset === parentNode.content.size

        // If in heading at end, create new paragraph
        if (isHeading && isAtEnd) {
          // Use createParagraphNear instead of enter to avoid recursion
          return this.editor.chain().focus().createParagraphNear().run()
        }

        // For all other cases, use default TipTap behavior
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
          // Remove HTMLAttributes - styles now in CSS
        },
        heading: false, // Disable default heading to add custom one
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
        // Remove HTMLAttributes - styles now in CSS
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
        class: 'tiptap prose prose-sm max-w-none focus:outline-none min-h-[300px] p-6 bg-white [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror_focus]:outline-none [&_.ProseMirror]:cursor-text [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto',
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