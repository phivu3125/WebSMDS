'use client'

import React, { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { cn } from '@/lib/utils'
import { AlertCircle, Save, X } from 'lucide-react'

interface FormContainerProps {
  title?: string
  description?: string
  children: ReactNode
  onSubmit?: (e: React.FormEvent) => void
  isLoading?: boolean
  error?: string | null
  success?: string | null
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact' | 'minimal'
}

export function FormContainer({
  title,
  description,
  children,
  onSubmit,
  isLoading = false,
  error = null,
  success = null,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onCancel,
  disabled = false,
  className,
  size = 'md',
  variant = 'default',
}: FormContainerProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(e)
  }

  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
  }

  const renderContent = () => {
    switch (variant) {
      case 'compact':
        return (
          <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {children}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading || disabled}
                >
                  <X className="h-4 w-4 mr-2" />
                  {cancelLabel}
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading || disabled}
              >
                {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                <Save className="h-4 w-4 mr-2" />
                {submitLabel}
              </Button>
            </div>
          </form>
        )

      case 'minimal':
        return (
          <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {children}

            {(onCancel || onSubmit) && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading || disabled}
                  >
                    {cancelLabel}
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isLoading || disabled}
                >
                  {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                  {submitLabel}
                </Button>
              </div>
            )}
          </form>
        )

      case 'default':
      default:
        return (
          <Card className={cn(sizeClasses[size], className)}>
            <CardHeader>
              {title && (
                <CardTitle className="flex items-center gap-2">
                  {isLoading && <LoadingSpinner className="h-5 w-5" />}
                  {title}
                </CardTitle>
              )}
              {description && (
                <CardDescription>{description}</CardDescription>
              )}
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {children}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  {onCancel && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      disabled={isLoading || disabled}
                    >
                      <X className="h-4 w-4 mr-2" />
                      {cancelLabel}
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isLoading || disabled}
                  >
                    {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                    <Save className="h-4 w-4 mr-2" />
                    {submitLabel}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )
    }
  }

  return renderContent()
}

// Form section component for grouping fields
interface FormSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export function FormSection({
  title,
  description,
  children,
  className,
  collapsible = false,
  defaultCollapsed = false,
}: FormSectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  if (collapsible) {
    return (
      <div className={cn('border rounded-lg', className)}>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div>
            {title && <h3 className="font-medium">{title}</h3>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
          <div className={cn(
            'transform transition-transform duration-200',
            isCollapsed ? 'rotate-0' : 'rotate-180'
          )}>
            ▼
          </div>
        </button>
        {!isCollapsed && (
          <div className="px-4 pb-4 space-y-4">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {title && <h3 className="font-medium">{title}</h3>}
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {children}
    </div>
  )
}

// Form field wrapper for consistent styling
interface FieldWrapperProps {
  label?: string
  description?: string
  error?: string | null
  required?: boolean
  children: ReactNode
  className?: string
}

export function FieldWrapper({
  label,
  description,
  error,
  required,
  children,
  className,
}: FieldWrapperProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

// Form actions component for consistent button layout
interface FormActionsProps {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
  className?: string
}

export function FormActions({
  children,
  align = 'right',
  className,
}: FormActionsProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  return (
    <div className={cn(
      'flex gap-3 pt-4 border-t',
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  )
}