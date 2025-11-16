'use client'

import { Editor } from '@tiptap/core'
import {
  Plus,
  Image,
  Link,
  Quote,
  Minus
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface FloatingActionMenuProps {
  editor: Editor | null
  onInsertImage: () => void
  onOpenLinkDialog: () => void
}

export function FloatingActionMenu({ editor, onInsertImage, onOpenLinkDialog }: FloatingActionMenuProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showFab, setShowFab] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!editor) return

    const handleUpdate = () => {
      // Immediate synchronous check for responsiveness
      const { state } = editor
      const { selection } = state
      const { $from } = selection

      // Check if text is selected
      const hasSelection = !selection.empty

      // Don't show FAB if text is selected (bubble menu handles that)
      if (hasSelection) {
        setShowFab(false)
        setShowMenu(false)
        return
      }

      // Get the parent node (paragraph, heading, etc.)
      const parentNode = $from.parent
      const nodeType = parentNode?.type.name

      // Check if we're in a text block that can contain the FAB
      const isInTextBlock = ['paragraph', 'heading'].includes(nodeType || '')

      if (isInTextBlock && parentNode) {
        // Simple and direct empty check
        const nodeText = parentNode.textContent || ''
        const isBlockEmpty = nodeText.trim().length === 0

        console.log('FAB Debug:', {
          nodeType,
          nodeText: `"${nodeText}"`,
          isBlockEmpty,
          nodeSize: parentNode.content.size
        })

        if (isBlockEmpty) {
          setShowFab(true)
          setShowMenu(false)
        } else {
          setShowFab(false)
          setShowMenu(false)
        }
      } else {
        setShowFab(false)
        setShowMenu(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
        fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    // Listen to multiple events to track cursor movement accurately
    editor.on('selectionUpdate', handleUpdate)
    editor.on('update', handleUpdate)
    editor.on('transaction', handleUpdate) // Track all editor transactions including Enter key
    document.addEventListener('mousedown', handleClickOutside)

    // Initial check
    handleUpdate()

    return () => {
      editor.off('selectionUpdate', handleUpdate)
      editor.off('update', handleUpdate)
      editor.off('transaction', handleUpdate)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editor])

  // Update position whenever FAB is visible
  useEffect(() => {
    if (!showFab || !editor) return

    const updatePosition = () => {
      const { $from } = editor.state.selection
      const coords = editor.view.coordsAtPos($from.pos)
      const editorElement = editor.view.dom
      const editorRect = editorElement.getBoundingClientRect()

      setPosition({
        x: editorRect.left - 30, // Right next to editor edge
        y: coords.top
      })
    }

    // Update position initially
    updatePosition()

    // Update position on any scroll or change
    editor.on('selectionUpdate', updatePosition)
    editor.on('update', updatePosition)
    editor.on('transaction', updatePosition) // Track cursor movement for positioning
    const scrollListener = () => updatePosition()
    window.addEventListener('scroll', scrollListener)

    return () => {
      editor.off('selectionUpdate', updatePosition)
      editor.off('update', updatePosition)
      editor.off('transaction', updatePosition)
      window.removeEventListener('scroll', scrollListener)
    }
  }, [showFab, editor])

  const handleFabClick = () => {
    setShowMenu(!showMenu)
  }

  if (!showFab) return null

  return (
    <>
      {/* Compact FAB Button */}
      <button
        ref={fabRef}
        onClick={handleFabClick}
        className={`
          fixed z-40 flex items-center justify-center w-8 h-8
          bg-primary text-primary-foreground rounded-full
          shadow-lg hover:shadow-lg hover:scale-105
          transition-all duration-200 border-2 border-background
          ${showMenu ? 'rotate-45 bg-destructive' : 'bg-blue-600'}
        `}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translateY(-50%)'
        }}
      >
        <Plus className="h-4 w-4" />
      </button>

      {/* Compact Horizontal Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="fixed z-30 bg-background border border-border rounded-lg shadow-xl p-1"
          style={{
            left: `${position.x + 35}px`, // Right next to FAB
            top: `${position.y}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="flex gap-1">
            <button
              onClick={() => {
                onInsertImage()
                setShowMenu(false)
              }}
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors"
              title="Chèn hình ảnh"
            >
              <Image className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                onOpenLinkDialog()
                setShowMenu(false)
              }}
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors"
              title="Thêm liên kết"
            >
              <Link className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().toggleBlockquote().run()
                setShowMenu(false)
              }}
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors"
              title="Trích dẫn"
            >
              <Quote className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().setHorizontalRule().run()
                setShowMenu(false)
              }}
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors"
              title="Đường kẻ"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}