import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface LinkDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddLink: (url: string, text?: string) => void
  initialUrl?: string
  initialText?: string
}

export function LinkDialog({
  isOpen,
  onClose,
  onAddLink,
  initialUrl = '',
  initialText = '',
}: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl)
  const [text, setText] = useState(initialText)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl)
      setText(initialText)
      setError('')
    }
  }, [isOpen, initialUrl, initialText])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      setError('URL is required')
      return
    }

    // Basic URL validation
    let finalUrl = url.trim()
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`
    }

    try {
      new URL(finalUrl)
      onAddLink(finalUrl, text.trim() || undefined)
      onClose()
    } catch {
      setError('Please enter a valid URL')
    }
  }

  const handleRemoveLink = () => {
    onAddLink('', '')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Add Link
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-text">Display Text (Optional)</Label>
            <Input
              id="link-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Link text"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveLink}
              className="flex-1"
            >
              Remove Link
            </Button>
            <Button type="submit" className="flex-1">
              Add Link
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface QuickLinkButtonProps {
  editor: any
  onOpenDialog: () => void
}

export function QuickLinkButton({ editor, onOpenDialog }: QuickLinkButtonProps) {
  const isLinkActive = editor.isActive('link')

  const handleToggleLink = () => {
    if (isLinkActive) {
      editor.chain().focus().unsetLink().run()
    } else {
      const existingText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      )
      onOpenDialog()
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggleLink}
      className={cn(
        'relative h-8 w-8 p-0 rounded-sm border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center',
        isLinkActive && 'bg-accent text-accent-foreground'
      )}
      title={isLinkActive ? 'Remove link' : 'Add link'}
    >
      <Link className="h-4 w-4" />
    </button>
  )
}