import { EditorButton, EditorButtonGroup } from './EditorButton'
import { FontFamilyDropdown, FontSizeDropdown } from './EditorDropdown'
import { ColorPicker } from './ColorPicker'
import { QuickLinkButton } from './LinkDialog'
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
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

  const setFontFamily = (fontFamily: string) => {
    editor.chain().focus().setFontFamily(fontFamily).run()
  }

  const setFontSize = (fontSize: string) => {
    editor.chain().focus().setFontSize(fontSize).run()
  }

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  const currentFontFamily = editor.getAttributes('textStyle').fontFamily
  const currentFontSize = editor.getAttributes('textStyle').fontSize
  const currentColor = editor.getAttributes('textStyle').color || '#000000'

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
        <EditorButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={Strikethrough}
          title="Strikethrough (Ctrl+Shift+X)"
        />
      </EditorButtonGroup>

      {/* Superscript/Subscript */}
      <EditorButtonGroup>
        <EditorButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive('superscript')}
          icon={SuperscriptIcon}
          title="Superscript (Ctrl+.)"
        />
        <EditorButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive('subscript')}
          icon={SubscriptIcon}
          title="Subscript (Ctrl+,)"
        />
      </EditorButtonGroup>

      {/* Text Styles */}
      <EditorButtonGroup>
        <FontFamilyDropdown
          value={currentFontFamily}
          onChange={setFontFamily}
        />
        <FontSizeDropdown
          value={currentFontSize}
          onChange={setFontSize}
        />
        <ColorPicker
          value={currentColor}
          onChange={setColor}
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