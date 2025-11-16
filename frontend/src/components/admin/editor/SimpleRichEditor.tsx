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

          // Simplified heading logic: only handle end of heading case
        if (currentNode && currentNode.type.name === 'heading' && isAtEndOfLine()) {
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
          'prose prose-sm max-w-none',
          'focus:outline-none min-h-[150px] p-4 bg-white',
          '[&_.ProseMirror]:min-h-[150px] [&_.ProseMirror_focus]:outline-none',
          '[&_.ProseMirror]:cursor-text',
          '[&_.ProseMirror img]:cursor-default [&_.ProseMirror img]:pointer-events-none',
          // Override prose styles with !important to ensure our styles are applied
          '[&_p]:!text-base [&_p]:!font-normal [&_p]:!text-gray-900 [&_p]:!leading-relaxed [&_p]:!mb-3',
          // Heading styles with !important to override prose defaults
          '[&_h1]:!text-3xl [&_h1]:!font-bold [&_h1]:!text-purple-800 [&_h1]:!mt-0 [&_h1]:!mb-1',
          '[&_h2]:!text-2xl [&_h2]:!font-semibold [&_h2]:!text-purple-700 [&_h2]:!mt-0 [&_h2]:!mb-1',
          '[&_h3]:!text-xl [&_h3]:!font-semibold [&_h3]:!text-purple-600 [&_h3]:!mt-0 [&_h3]:!mb-1',
          // List styles
          '[&_ul]:!list-disc [&_ol]:!list-decimal [&_li]:!ml-6',
          // Blockquote styles
          // '[&_blockquote]:!border-l-4 [&_blockquote]:!border-purple-400 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_blockquote]:!bg-purple-50 [&_blockquote]:!py-2 [&_blockquote]:!my-4 [&_blockquote]:!font-serif'
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

          lines.forEach((line) => {
            const trimmedLine = line.trim()

            if (trimmedLine === '') {
              // Empty line - just add a paragraph break
              htmlContent += '<p></p>'
            } else {
              // Regular paragraph - simplified without complex heading detection
              htmlContent += `<p>${trimmedLine}</p>`
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