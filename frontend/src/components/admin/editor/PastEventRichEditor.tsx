'use client'

import { EditorToolbar } from './EditorToolbar'
import { BaseRichEditor, type EditorTheme } from './BaseRichEditor'

export interface PastEventRichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
  rows?: number  // Add this for backward compatibility
  theme?: EditorTheme
  showToolbar?: boolean
}

/**
 * Past Event Rich Editor
 * Uses BaseRichEditor internally with past-event theme by default
 * Designed specifically for past-event content with purple-themed headings
 */
export default function PastEventRichEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  className = '',
  editable = true,
  rows, // Accept rows prop for backward compatibility but don't use it
  theme = 'past-event', // Default to past-event theme
  showToolbar = true,
}: PastEventRichEditorProps) {
  return (
    <BaseRichEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      editable={editable}
      theme={theme}
      minHeight="150px"
      showToolbar={showToolbar}
      toolbar={
        showToolbar && editable ? (
          <EditorToolbar editor={undefined} showExtendedActions={false} />
        ) : undefined
      }
    />
  )
}

// Export components for standalone usage
export { EditorToolbar } from './EditorToolbar'
export { EditorButton } from './EditorButton'

// Export with backward compatibility alias
export { PastEventRichEditor as SimpleRichEditor }
export type { PastEventRichEditorProps as SimpleRichEditorProps }