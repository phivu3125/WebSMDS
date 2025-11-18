'use client'

import { Editor } from '@tiptap/core'
import { EditorButton, EditorButtonGroup } from './EditorButton'
import {
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface PastEventBubbleMenuProps {
  editor: Editor | null
}

export function PastEventBubbleMenu({ editor }: PastEventBubbleMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Update menu position when selection changes
  useEffect(() => {
    const updateMenuPosition = () => {
      if (!editor) return

      const { from, to, empty } = editor.state.selection
      if (empty || !menuRef.current) {
        setMenuOpen(false)
        return
      }

      // Get selection bounds
      const { view } = editor
      const start = view.coordsAtPos(from)
      const end = view.coordsAtPos(to)

      // Calculate position
      const menuEl = menuRef.current
      if (menuEl) {
        const menuRect = menuEl.getBoundingClientRect()
        const left = Math.min(start.left, end.left) + (Math.abs(end.left - start.left) / 2) - (menuRect.width / 2)
        const top = Math.min(start.top, end.top) - menuRect.height - 8

        menuEl.style.position = 'fixed'
        menuEl.style.left = `${left}px`
        menuEl.style.top = `${top}px`
        menuEl.style.zIndex = '1000'

        setMenuOpen(true)
      }
    }

    if (editor) {
      editor.on('selectionUpdate', updateMenuPosition)
      editor.on('transaction', updateMenuPosition)

      return () => {
        if (editor) {
          editor.off('selectionUpdate', updateMenuPosition)
          editor.off('transaction', updateMenuPosition)
        }
      }
    }
  }, [editor])

  const handleLinkClick = () => {
    if (editor?.isActive('link')) {
      editor.chain().focus().unsetLink().run()
    } else if (editor) {
      const { from, to } = editor.state.selection
      const selectedText = editor.state.doc.textBetween(from, to)
      setLinkText(selectedText)
      setLinkUrl('')
      setIsLinkDialogOpen(true)
    }
  }

  const handleLinkSave = () => {
    if (editor && linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
    }
    setIsLinkDialogOpen(false)
    setLinkUrl('')
    setLinkText('')
  }

  const handleLinkCancel = () => {
    setIsLinkDialogOpen(false)
    setLinkUrl('')
    setLinkText('')
  }

  const handleHeadingClick = (level: number) => {
    if (!editor) return

    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to)

    if (selectedText) {
      editor.chain().focus()
        .toggleHeading({ level: level as any })
        .run()
    } else {
      editor.chain().focus()
        .setHeading({ level: level as any })
        .insertContent('Heading')
        .run()
    }

    setMenuOpen(false)
  }

  const handleListClick = (type: 'bullet' | 'ordered') => {
    if (!editor) return

    if (type === 'bullet') {
      editor.chain().focus().toggleBulletList().run()
    } else {
      editor.chain().focus().toggleOrderedList().run()
    }

    setMenuOpen(false)
  }

  const handleAlignClick = (align: 'left' | 'center' | 'right' | 'justify') => {
    if (!editor) return

    editor.chain().focus().setTextAlign(align).run()
    setMenuOpen(false)
  }

  if (!menuOpen || !editor) return null

  return (
    <>
      <div
        ref={menuRef}
        className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1"
        style={{
          position: 'fixed',
          zIndex: 1000,
        }}
      >
        {/* Text Formatting */}
        <EditorButtonGroup>
          <EditorButton
            icon={Bold}
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="In đậm (Ctrl+B)"
          />
          <EditorButton
            icon={Italic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="In nghiêng (Ctrl+I)"
          />
          <EditorButton
            icon={Underline}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Gạch chân (Ctrl+U)"
          />
        </EditorButtonGroup>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Headings */}
        <EditorButtonGroup>
          <EditorButton
            icon={Heading1}
            onClick={() => handleHeadingClick(1)}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Tiêu đề 1"
          />
          <EditorButton
            icon={Heading2}
            onClick={() => handleHeadingClick(2)}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Tiêu đề 2"
          />
          <EditorButton
            icon={Heading3}
            onClick={() => handleHeadingClick(3)}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Tiêu đề 3"
          />
        </EditorButtonGroup>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Lists */}
        <EditorButtonGroup>
          <EditorButton
            icon={List}
            onClick={() => handleListClick('bullet')}
            isActive={editor.isActive('bulletList')}
            title="Danh sách gạch đầu dòng"
          />
          <EditorButton
            icon={ListOrdered}
            onClick={() => handleListClick('ordered')}
            isActive={editor.isActive('orderedList')}
            title="Danh sách số thứ tự"
          />
        </EditorButtonGroup>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Alignment */}
        <EditorButtonGroup>
          <EditorButton
            icon={AlignLeft}
            onClick={() => handleAlignClick('left')}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Canh trái"
          />
          <EditorButton
            icon={AlignCenter}
            onClick={() => handleAlignClick('center')}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Canh giữa"
          />
          <EditorButton
            icon={AlignRight}
            onClick={() => handleAlignClick('right')}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Canh phải"
          />
          <EditorButton
            icon={AlignJustify}
            onClick={() => handleAlignClick('justify')}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Canh đều hai bên"
          />
        </EditorButtonGroup>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Link */}
        <EditorButton
          icon={Link}
          onClick={handleLinkClick}
          isActive={editor.isActive('link')}
          title={editor.isActive('link') ? 'Gỡ link' : 'Thêm link (Ctrl+L)'}
        />
      </div>

      {/* Link Dialog */}
      {isLinkDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editor.isActive('link') ? 'Chỉnh sửa link' : 'Thêm link'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://example.com"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Link text"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleLinkCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleLinkSave}
                disabled={!linkUrl}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editor.isActive('link') ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}