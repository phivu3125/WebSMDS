import { EditorButton, EditorButtonGroup } from './EditorButton'
import { QuickLinkButton } from './LinkDialog'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
} from 'lucide-react'
import React from 'react'

interface EditorToolbarProps {
  editor: any
  onLinkDialogOpen: () => void
}

export function EditorToolbar({ editor, onLinkDialogOpen }: EditorToolbarProps) {
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

      {/* Text Formatting */}
      <EditorButtonGroup>
        <EditorButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={Bold}
          title="Bold (Ctrl+B)"
        />
        <EditorButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={Italic}
          title="Italic (Ctrl+I)"
        />
        <EditorButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={Underline}
          title="Underline (Ctrl+U)"
        />
      </EditorButtonGroup>

      {/* Lists */}
      <EditorButtonGroup>
        <EditorButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={List}
          title="Bullet List"
        />
        <EditorButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={ListOrdered}
          title="Numbered List"
        />
      </EditorButtonGroup>

      {/* Alignment */}
      <EditorButtonGroup>
        <EditorButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          icon={AlignLeft}
          title="Align Left"
        />
        <EditorButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          icon={AlignCenter}
          title="Align Center"
        />
        <EditorButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          icon={AlignRight}
          title="Align Right"
        />
        <EditorButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          icon={AlignJustify}
          title="Justify"
        />
      </EditorButtonGroup>

      {/* Link */}
      <EditorButtonGroup>
        <QuickLinkButton editor={editor} onOpenDialog={onLinkDialogOpen} />
      </EditorButtonGroup>
    </div>
  )
}