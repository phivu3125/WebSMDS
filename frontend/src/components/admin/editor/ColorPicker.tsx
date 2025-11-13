import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Palette } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

interface ColorPickerProps {
  value?: string
  onChange: (color: string) => void
  className?: string
}

const presetColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#4B0082'
]

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState(value || '#000000')
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleColorSelect = (color: string) => {
    onChange(color)
    setCustomColor(color)
    setIsOpen(false)
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setCustomColor(color)
    onChange(color)
  }

  return (
    <div className={cn('relative', className)} ref={pickerRef}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0 relative"
      >
        <Palette className="h-4 w-4" />
        <div
          className="absolute bottom-0 right-0 w-3 h-3 rounded-sm border border-border"
          style={{ backgroundColor: value || '#000000' }}
        />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 p-3 rounded-md border bg-popover shadow-md">
          <div className="grid grid-cols-5 gap-2 mb-3">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={cn(
                  'w-6 h-6 rounded border-2 hover:scale-110 transition-transform',
                  value === color && 'border-primary',
                  color === '#FFFFFF' && 'border-gray-300'
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Custom:</label>
            <input
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="w-8 h-8 border border-border rounded cursor-pointer"
            />
            <input
              type="text"
              value={customColor}
              onChange={handleCustomColorChange}
              className="w-20 px-2 py-1 text-xs border border-border rounded"
              placeholder="#000000"
            />
          </div>
        </div>
      )}
    </div>
  )
}