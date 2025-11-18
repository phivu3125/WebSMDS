'use client'

import { Editor } from '@tiptap/core'
import { useState, useEffect, useRef } from 'react'
import { Image, Link, Minus } from 'lucide-react'

interface PastEventFloatingActionMenuProps {
  editor: Editor | null
  onInsertImage?: () => void
}

export function PastEventFloatingActionMenu({ editor, onInsertImage }: PastEventFloatingActionMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Check if cursor is at empty line
  const isEmptyLine = () => {
    if (!editor) return false

    const { state } = editor
    const { $from } = state.selection
    const node = state.doc.nodeAt($from.pos)

    if (!node) return false

    // Check if current node is empty paragraph
    return node.type.name === 'paragraph' && node.content.size === 0
  }

  // Update menu visibility
  useEffect(() => {
    const updateMenuVisibility = () => {
      if (!editor) {
        setMenuOpen(false)
        return
      }

      const shouldShow = isEmptyLine()
      setMenuOpen(shouldShow)

      if (!shouldShow) {
        setIsExpanded(false)
      }
    }

    editor.on('selectionUpdate', updateMenuVisibility)
    editor.on('transaction', updateMenuVisibility)

    return () => {
      if (editor) {
        editor.off('selectionUpdate', updateMenuVisibility)
        editor.off('transaction', updateMenuVisibility)
      }
    }
  }, [editor])

  // Update menu position
  useEffect(() => {
    const updateMenuPosition = () => {
      if (!editor || !menuRef.current) return

      const { state } = editor
      const { $from } = state.selection
      const coords = state.view.coordsAtPos($from.pos)

      const menuEl = menuRef.current
      if (menuEl) {
        const menuRect = menuEl.getBoundingClientRect()
        const left = coords.left - (menuRect.width / 2)
        const top = coords.top - menuRect.height - 10

        menuEl.style.position = 'fixed'
        menuEl.style.left = `${left}px`
        menuEl.style.top = `${top}px`
        menuEl.style.zIndex = '1000'
      }
    }

    if (editor && menuOpen) {
      updateMenuVisibility()
      editor.on('update', updateMenuPosition)
      editor.on('selectionUpdate', updateMenuPosition)

      return () => {
        if (editor) {
          editor.off('update', updateMenuPosition)
          editor.off('selectionUpdate', updateMenuPosition)
        }
      }
    }
  }, [editor, menuOpen])

  const handleMenuToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleImageClick = () => {
    if (onInsertImage) {
      onInsertImage()
    }
    setMenuOpen(false)
    setIsExpanded(false)
  }

  const handleLinkClick = () => {
    if (editor) {
      editor.chain().focus().setLink({ href: '' }).run()
    }
    setMenuOpen(false)
    setIsExpanded(false)
  }

  const handleQuoteClick = () => {
    if (editor) {
      editor.chain().focus().toggleBlockquote().run()
    }
    setMenuOpen(false)
    setIsExpanded(false)
  }

  const handleSeparatorClick = () => {
    if (editor) {
      editor.chain().focus().setHorizontalRule().run()
    }
    setMenuOpen(false)
    setIsExpanded(false)
  }

  if (!menuOpen || !editor) return null

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* FAB Button */}
      <button
        onClick={handleMenuToggle}
        className={`flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-110 ${
          isExpanded ? 'rotate-45' : ''
        }`}
        title="Thêm nội dung"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Expanded Menu */}
      {isExpanded && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
          <button
            onClick={handleImageClick}
            className="flex items-center justify-center w-8 h-8 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-md transition-colors"
            title="Chèn ảnh"
          >
            <Image className="w-4 h-4" />
          </button>

          <button
            onClick={handleLinkClick}
            className="flex items-center justify-center w-8 h-8 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-md transition-colors"
            title="Thêm link"
          >
            <Link className="w-4 h-4" />
          </button>

          <button
            onClick={handleQuoteClick}
            className="flex items-center justify-center w-8 h-8 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-md transition-colors"
            title="Thêm trích dẫn"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            onClick={handleSeparatorClick}
            className="flex items-center justify-center w-8 h-8 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-md transition-colors"
            title="Thêm đường kẻ ngang"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}