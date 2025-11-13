// Re-export the refactored SimpleRichEditor for backward compatibility
export { default } from './editor/SimpleRichEditor'

// Re-export types and other components for convenience
export type { SimpleRichEditorProps } from './editor/SimpleRichEditor'
export {
  EditorToolbar,
  LinkDialog,
  EditorButton,
  FontFamilyDropdown,
  FontSizeDropdown,
  ColorPicker,
} from './editor/SimpleRichEditor'