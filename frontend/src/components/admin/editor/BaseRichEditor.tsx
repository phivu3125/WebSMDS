'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Extension } from '@tiptap/core'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'
import { DOMParser } from 'prosemirror-model'
import { cn } from '@/lib/utils'
import { processDocumentHtml } from './processDocumentHtml'
import { useImagePasteBlocking } from './useImagePasteBlocking'

// Editor theme types
export type EditorTheme = 'event' | 'past-event'

interface BaseRichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
  theme?: EditorTheme
  minHeight?: string
  showToolbar?: boolean
  extensions?: any[]
  toolbar?: React.ReactNode
  onEditorReady?: (editor: any) => void
}

// Theme configurations
const getThemeClasses = (theme: EditorTheme, minHeight: string = '150px') => {
  const baseClasses = 'prose prose-sm max-w-none focus:outline-none p-4 bg-white'
  const heightClasses = `min-h-[${minHeight}] [&_.ProseMirror]:min-h-[${minHeight}] [&_.ProseMirror_focus]:outline-none [&_.ProseMirror]:cursor-text`

  if (theme === 'event') {
    return cn(
      baseClasses,
      heightClasses,
      // Event theme styling (CSS variables based)
      '[&_h1]:!text-3xl [&_h1]:!font-bold [&_h1]:!mb-1',
      '[&_h2]:!text-2xl [&_h2]:!font-semibold [&_h2]:!mb-1',
      '[&_h3]:!text-xl [&_h3]:!font-semibold [&_h3]:!mb-1',
      // List styles
      '[&_ul]:!list-disc [&_ol]:!list-decimal [&_li]:!ml-6'
    )
  } else {
    // Past-event theme (inline Tailwind classes with purple theme)
    return cn(
      baseClasses,
      heightClasses,
      // Purple-themed headings with inline styles
      '[&_h1]:!text-3xl [&_h1]:!font-bold [&_h1]:!text-purple-800 [&_h1]:!mt-0 [&_h1]:!mb-1',
      '[&_h2]:!text-2xl [&_h2]:!font-semibold [&_h2]:!text-purple-700 [&_h2]:!mt-0 [&_h2]:!mb-1',
      '[&_h3]:!text-xl [&_h3]:!font-semibold [&_h3]:!text-purple-600 [&_h3]:!mt-0 [&_h3]:!mb-1',
      // List styles
      '[&_ul]:!list-disc [&_ol]:!list-decimal [&_li]:!ml-6',
      // Paragraph styles
      '[&_p]:!text-base [&_p]:!font-normal [&_p]:!text-gray-900 [&_p]:!leading-relaxed [&_p]:!mb-3'
    )
  }
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

export function BaseRichEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  className = '',
  editable = true,
  theme = 'event',
  minHeight = '150px',
  showToolbar = true,
  extensions = [],
  toolbar,
  onEditorReady,
}: BaseRichEditorProps) {
  const { handlePasteWithBlocking, imagePasteNotification, setImagePasteNotification } = useImagePasteBlocking()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: theme === 'event' ? '' : 'mb-2'
          }
        },
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: theme === 'event' ? '' : 'mb-2'
          }
        }
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
      ...extensions,
    ],
    content: value,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: getThemeClasses(theme, minHeight),
        spellcheck: "false",
      },
      handlePaste: (view, event) => {
        return handlePasteWithBlocking(event, view, processDocumentHtml)
      },
    },
  })

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor)
    }
  }, [editor, onEditorReady])

  // Sync editor content with value prop
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

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
      {showToolbar && editable && toolbar}

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none"
      />

      {!editor.getText() && (
        <div className="absolute top-[60px] left-4 pointer-events-none text-muted-foreground">
          {placeholder}
        </div>
      )}

      {/* Image Paste Notification */}
      {imagePasteNotification && (
        <div className="absolute top-[60px] left-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Không thể dán hình ảnh
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Vui lòng sử dụng nút tải lên hình ảnh để chèn hình vào nội dung.
              </p>
            </div>
            <button
              onClick={() => setImagePasteNotification(false)}
              className="text-yellow-500 hover:text-yellow-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}