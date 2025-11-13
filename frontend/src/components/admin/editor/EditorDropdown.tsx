import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronDown, Type } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

interface DropdownOption {
  label: string
  value: string
  onClick?: () => void
}

interface EditorDropdownProps {
  trigger: React.ReactNode
  options: DropdownOption[]
  placeholder?: string
  value?: string
  onSelect?: (value: string) => void
  className?: string
}

export function EditorDropdown({
  trigger,
  options,
  placeholder,
  value,
  onSelect,
  className,
}: EditorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: DropdownOption) => {
    setIsOpen(false)
    onSelect?.(option.value)
    option.onClick?.()
  }

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-2 text-sm gap-1 min-w-[100px] justify-between"
      >
        <span className="truncate">
          {selectedOption?.label || placeholder || 'Select...'}
        </span>
        <ChevronDown className="h-3 w-3 shrink-0" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 min-w-[140px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={cn(
                'w-full cursor-pointer rounded-sm px-2 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground',
                option.value === value && 'bg-accent text-accent-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export const FontFamilyDropdown = ({
  value,
  onChange,
}: {
  value?: string
  onChange: (value: string) => void
}) => {
  const fontFamilies = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Courier New', value: 'Courier New, monospace' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Tahoma', value: 'Tahoma, sans-serif' },
  ]

  return (
    <EditorDropdown
      trigger={<Type className="h-4 w-4" />}
      options={fontFamilies}
      value={value}
      onSelect={onChange}
      placeholder="Font"
    />
  )
}

export const FontSizeDropdown = ({
  value,
  onChange,
}: {
  value?: string
  onChange: (value: string) => void
}) => {
  const fontSizes = [
    { label: 'Nhỏ', value: '12px' },
    { label: 'Bình thường', value: '14px' },
    { label: 'Vừa', value: '16px' },
    { label: 'Lớn', value: '18px' },
    { label: 'Rất lớn', value: '24px' },
    { label: 'Khổng lồ', value: '32px' },
  ]

  const getLabel = (size: string) => {
    return fontSizes.find(f => f.value === size)?.label || size
  }

  return (
    <EditorDropdown
      trigger={<span className="text-sm">{getLabel(value || '14px')}</span>}
      options={fontSizes}
      value={value}
      onSelect={onChange}
      placeholder="Size"
    />
  )
}