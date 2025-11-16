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

interface BubbleMenuComponentProps {
  editor: Editor | null
}

export function BubbleMenuComponent({ editor }: BubbleMenuComponentProps) {
  const [showBubbleMenu, setShowBubbleMenu] = useState(false)
  const [bubbleMenuPosition, setBubbleMenuPosition] = useState({ x: 0, y: 0 })
  const bubbleMenuRef = useRef<HTMLDivElement>(null)

  // Helper function to update bubble menu position (accessible to all functions)
  const updateBubbleMenuPosition = (pos: number) => {
    if (!editor) return
    const coords = editor.view.coordsAtPos(pos)
    const editorElement = editor.view.dom
    const editorRect = editorElement.getBoundingClientRect()

    // Calculate position relative to viewport, but bubble menu will be positioned absolutely
    setBubbleMenuPosition({
      x: coords.left - editorRect.left, // Position relative to editor element
      y: coords.top - editorRect.top - 10 // Position above selection relative to editor
    })
  }

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection
      const hasSelection = from !== to

      if (hasSelection) {
        updateBubbleMenuPosition(from)
        setShowBubbleMenu(true)
      } else {
        setShowBubbleMenu(false)
      }
    }

    // Remove scroll handling - bubble menu should stay fixed relative to selected text
    // const handleScroll = () => {
    //   if (showBubbleMenu) {
    //     const { from } = editor.state.selection
    //     updateBubbleMenuPosition(from)
    //   }
    // }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (bubbleMenuRef.current && !bubbleMenuRef.current.contains(event.target as Node)) {
        setShowBubbleMenu(false)
      }
    }

    // Handle both mouse and touch events
    const handleMouseUp = () => {
      // Small delay to ensure selection is updated after mouse/touch release
      setTimeout(handleSelectionUpdate, 50)
    }

    editor.on('selectionUpdate', handleSelectionUpdate)
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [editor])

  // Keep bubble menu open after formatting with enhanced heading precision
  const executeCommand = (command: () => void, isHeadingToggle = false) => {
    if (isHeadingToggle) {
      // For heading toggles, apply only to current line for precision
      const { state } = editor!
      const { $from, from, to, empty } = state.selection

      if (!empty) {
        // Get current line boundaries when text is selected
        const $pos = state.doc.resolve(from)
        const lineStart = $pos.start()
        const lineEnd = $pos.end()

        // Apply heading only to current line
        editor!.chain()
          .focus()
          .setTextSelection({ from: lineStart, to: lineEnd })
          .run()

        command() // Execute the heading toggle

        // Restore original selection
        editor!.chain().focus().setTextSelection({ from, to }).run()
      } else {
        // For empty selection, apply normally
        command()
      }
    } else {
      command()
    }

    // Don't hide bubble menu - let selection change handle it
    setTimeout(() => {
      const { from, to } = editor!.state.selection
      const hasSelection = from !== to
      if (hasSelection) {
        updateBubbleMenuPosition(from)
        setShowBubbleMenu(true)
      }
    }, 10) // Small delay to allow selection to update
  }

  if (!editor || !showBubbleMenu) {
    return null
  }

  return (
    <div
      ref={bubbleMenuRef}
      className="absolute z-[9999] flex items-center gap-1 bg-background border border-border rounded-md shadow-lg p-1 md:p-1"
      style={{
        left: `${bubbleMenuPosition.x}px`,
        top: `${bubbleMenuPosition.y}px`,
        transform: 'translateX(-50%)',
        // Ensure bubble menu stays within viewport on mobile
        maxWidth: '90vw',
        overflow: 'auto'
      }}
    >
      {/* Text Formatting */}
      <EditorButtonGroup>
        <EditorButton
          onClick={() => executeCommand(() => editor.chain().focus().toggleBold().run())}
          isActive={editor.isActive('bold')}
          icon={Bold}
          title="Bold (Ctrl+B)"
          size="sm"
        />
        <EditorButton
          onClick={() => executeCommand(() => editor.chain().focus().toggleItalic().run())}
          isActive={editor.isActive('italic')}
          icon={Italic}
          title="Italic (Ctrl+I)"
          size="sm"
        />
        <EditorButton
          onClick={() => executeCommand(() => editor.chain().focus().toggleUnderline().run())}
          isActive={editor.isActive('underline')}
          icon={Underline}
          title="Underline (Ctrl+U)"
          size="sm"
        />
      </EditorButtonGroup>

      {/* Headings */}
      <EditorButtonGroup>
        <EditorButton
          onClick={() => executeCommand(() => editor.chain().focus().toggleHeading({ level: 1 }).run(), true)}
          isActive={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
          title="Heading 1"
          size="sm"
        />
        <EditorButton
          onClick={() => executeCommand(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), true)}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
          title="Heading 2"
          size="sm"
        />
        <EditorButton
          onClick={() => executeCommand(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), true)}
          isActive={editor.isActive('heading', { level: 3 })}
          icon={Heading3}
          title="Heading 3"
          size="sm"
        />
      </EditorButtonGroup>

      {/* Lists */}
      <EditorButtonGroup>
        <EditorButton
          onClick={() => executeCommand(() => editor.chain().focus().toggleBulletList().run())}
          isActive={editor.isActive('bulletList')}
          icon={List}
          title="Bullet List"
          size="sm"
        />
        <EditorButton
          onClick={() => executeCommand(() => editor.chain().focus().toggleOrderedList().run())}
          isActive={editor.isActive('orderedList')}
          icon={ListOrdered}
          title="Numbered List"
          size="sm"
        />
      </EditorButtonGroup>

      {/* Text Alignment */}
      <EditorButtonGroup>
        <EditorButton
          onClick={() => executeCommand(() => editor.chain().focus().setTextAlign('left').run())}
          isActive={editor.isActive({ textAlign: 'left' })}
          icon={AlignLeft}
          title="Align Left"
          size="sm"
        />
        <EditorButton
          onClick={() => executeCommand(() => editor.chain().focus().setTextAlign('center').run())}
          isActive={editor.isActive({ textAlign: 'center' })}
          icon={AlignCenter}
          title="Align Center"
          size="sm"
        />
        <EditorButton
          onClick={() => executeCommand(() => editor.chain().focus().setTextAlign('right').run())}
          isActive={editor.isActive({ textAlign: 'right' })}
          icon={AlignRight}
          title="Align Right"
          size="sm"
        />
        <EditorButton
          onClick={() => executeCommand(() => editor.chain().focus().setTextAlign('justify').run())}
          isActive={editor.isActive({ textAlign: 'justify' })}
          icon={AlignJustify}
          title="Align Justify"
          size="sm"
        />
      </EditorButtonGroup>
    </div>
  )
}