"use client"

import { useState } from 'react'
import { BaseRichEditor } from '../editor/BaseRichEditor'
import { EditorToolbar } from '../editor/EditorToolbar'
import { CustomImage } from './ImageExtension'
import { BubbleMenuComponent } from '../editor/BubbleMenu'
import { FloatingActionMenu } from '../editor/FloatingActionMenu'
import { Card, CardContent } from '@/components/ui/card'

interface ContentEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  editable?: boolean
}


export function ContentEditor({
  value,
  onChange,
  className = '',
  editable = true,
}: ContentEditorProps) {
  const [editor, setEditor] = useState<any>(null)

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

  return (
    <Card className="py-0">
      <CardContent className="p-0">
        <div className="relative">
          <BaseRichEditor
            value={value}
            onChange={onChange}
            className={className}
            editable={editable}
            theme="past-event"
            minHeight="300px"
            extensions={[CustomImage]}
            onEditorReady={setEditor}
            toolbar={
              editable && editor ? (
                <EditorToolbar
                  editor={editor}
                  showExtendedActions={true}
                />
              ) : undefined
            }
          />

          {/* Bubble Menu for selected text */}
          {editable && editor && <BubbleMenuComponent editor={editor} />}

          {/* Floating Action Menu for empty lines */}
          {editable && editor && (
            <FloatingActionMenu
              editor={editor}
              onInsertImage={insertImage}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}