// Re-export PastEventRichEditor as SimpleRichEditor for backward compatibility
import PastEventRichEditor from './editor/PastEventRichEditor'
import type { SimpleRichEditorProps } from './editor/PastEventRichEditor'
import { EditorToolbar, EditorButton } from './editor/PastEventRichEditor'

export default PastEventRichEditor
export type { SimpleRichEditorProps }
export { EditorToolbar, EditorButton }