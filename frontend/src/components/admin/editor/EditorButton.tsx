import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import React from 'react'

interface EditorButtonProps {
  onClick: () => void
  isActive?: boolean
  isDisabled?: boolean
  icon: LucideIcon
  title?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
  children?: React.ReactNode
}

export function EditorButton({
  onClick,
  isActive = false,
  isDisabled = false,
  icon: Icon,
  title,
  size = 'sm',
  variant = 'ghost',
  children,
}: EditorButtonProps) {
  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={onClick}
      disabled={isDisabled}
      title={title}
      className={cn(
        'relative',
        isActive && 'bg-accent text-accent-foreground',
        'h-8 w-8 p-0'
      )}
    >
      {children || <Icon className="h-4 w-4" />}
    </Button>
  )
}

interface EditorButtonGroupProps {
  children: React.ReactNode
  className?: string
}

export function EditorButtonGroup({ children, className }: EditorButtonGroupProps) {
  return (
    <div className={cn('flex items-center gap-1 border-r border-border pr-1 mr-1', className)}>
      {children}
    </div>
  )
}