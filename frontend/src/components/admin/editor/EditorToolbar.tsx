import { EditorButton, EditorButtonGroup } from './EditorButton'
import {
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { type Editor } from '@tiptap/react'

interface EditorToolbarProps {
  editor: Editor | null
  showExtendedActions?: boolean // For event editor with headings only
}

export function EditorToolbar({ editor, showExtendedActions = false }: EditorToolbarProps) {
  const [forceUpdate, setForceUpdate] = useState(0)

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setForceUpdate(prev => prev + 1)
    }

    const handleTransaction = () => {
      setForceUpdate(prev => prev + 1)
    }

    editor.on('selectionUpdate', handleSelectionUpdate)
    editor.on('transaction', handleTransaction)

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate)
      editor.off('transaction', handleTransaction)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/50">
      {/* History */}
      <EditorButtonGroup>
        <EditorButton
          onClick={() => editor.chain().focus().undo().run()}
          isDisabled={!editor.can().undo()}
          icon={Undo}
          title="Undo (Ctrl+Z)"
        />
        <EditorButton
          onClick={() => editor.chain().focus().redo().run()}
          isDisabled={!editor.can().redo()}
          icon={Redo}
          title="Redo (Ctrl+Y)"
        />
      </EditorButtonGroup>

      {/* Extended Actions for Event Editor */}
      {showExtendedActions && (
        <>
          {/* Headings */}
          <EditorButtonGroup>
            <EditorButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              icon={Heading1}
              title="Heading 1"
            />
            <EditorButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              icon={Heading2}
              title="Heading 2"
            />
            <EditorButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              icon={Heading3}
              title="Heading 3"
            />
          </EditorButtonGroup>
        </>
      )}
    </div>
  )
}