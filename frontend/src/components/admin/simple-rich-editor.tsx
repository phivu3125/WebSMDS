"use client"

import { useEffect, useRef, useState } from "react"
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react"

interface SimpleRichEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    rows?: number
    className?: string
}

export default function SimpleRichEditor({
    value,
    onChange,
    placeholder = "Nhập nội dung...",
    rows = 6,
    className = "",
}: SimpleRichEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = useState(false)
    const [isEmpty, setIsEmpty] = useState(true)

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value
            setIsEmpty(checkEditorEmpty(editorRef.current))
        }
    }, [value])

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
    }

    const checkEditorEmpty = (element: HTMLDivElement | null) => {
        if (!element) return true
        const text = element.innerText.replace(/\u00a0/g, "").trim()
        if (text.length > 0) return false
        return !element.querySelector("img, video, iframe, ul li, ol li")
    }

    const execFormatCommand = (command: string) => {
        const selection = window.getSelection()
        if (selection && !selection.isCollapsed) {
            const selectedText = selection.toString()
            if (!selectedText.replace(/\s+/g, "")) {
                editorRef.current?.focus()
                return
            }
        }
        execCommand(command)
    }

    const handleListCommand = (command: "insertUnorderedList" | "insertOrderedList") => {
        // Ensure the editor is focused first
        editorRef.current?.focus()

        // Execute the list command
        document.execCommand(command, false)

        // Trigger onChange to update the parent state
        handleInput()
    }

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
            setIsEmpty(checkEditorEmpty(editorRef.current))
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // Handle Tab key for indentation
        if (e.key === "Tab") {
            e.preventDefault()

            const selection = window.getSelection()
            if (!selection || !editorRef.current) return

            const range = selection.getRangeAt(0)

            // Check if we're in a list
            let listItem = range.startContainer.parentElement
            while (listItem && listItem.tagName !== "LI" && listItem !== editorRef.current) {
                listItem = listItem.parentElement
            }

            if (listItem && listItem.tagName === "LI") {
                // In a list - use indent/outdent
                if (e.shiftKey) {
                    document.execCommand("outdent", false)
                } else {
                    document.execCommand("indent", false)
                }
            } else {
                // Not in a list - insert tab spaces
                const tabSpaces = "\u00a0\u00a0\u00a0\u00a0" // 4 non-breaking spaces
                document.execCommand("insertText", false, tabSpaces)
            }

            handleInput()
        }
    }

    const sanitizedPlaceholder = placeholder
        ? placeholder.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
        : ""

    return (
        <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
            <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300 relative">
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault()
                        execFormatCommand("bold")
                    }}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="In đậm"
                >
                    <Bold size={18} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault()
                        execFormatCommand("italic")
                    }}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="In nghiêng"
                >
                    <Italic size={18} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault()
                        execFormatCommand("underline")
                    }}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Gạch chân"
                >
                    <Underline size={18} />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault()
                        handleListCommand("insertUnorderedList")
                    }}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Danh sách không thứ tự"
                >
                    <List size={18} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault()
                        handleListCommand("insertOrderedList")
                    }}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Danh sách có thứ tự"
                >
                    <ListOrdered size={18} />
                </button>
            </div>

            <div className="relative">
                {sanitizedPlaceholder && isEmpty && !isFocused && (
                    <div className="absolute inset-0 px-4 py-3 text-sm text-gray-400 pointer-events-none">
                        {sanitizedPlaceholder}
                    </div>
                )}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="px-4 py-3 outline-none text-sm prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1"
                    aria-label={sanitizedPlaceholder || undefined}
                    style={{ minHeight: `${rows * 24}px` }}
                />
            </div>
        </div>
    )
}
