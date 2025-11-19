import { useState, useCallback, useRef } from 'react'

export interface FormField<T = unknown> {
  value: T
  error: string | null
  touched: boolean
}

export interface FormState<T extends Record<string, unknown>> {
  fields: T
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
}

export interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T
  validation?: Partial<Record<keyof T, (value: unknown) => string | null>>
  onSubmit?: (values: T) => Promise<void> | void
}

export interface UseFormReturn<T extends Record<string, unknown>> {
  state: FormState<T>
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void
  setFieldError: <K extends keyof T>(field: K, error: string | null) => void
  setFieldTouched: <K extends keyof T>(field: K, touched: boolean) => void
  handleSubmit: () => Promise<void>
  resetForm: () => void
  resetField: <K extends keyof T>(field: K) => void
  validateField: <K extends keyof T>(field: K) => boolean
  validateForm: () => boolean
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validation,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const isMountedRef = useRef(true)

  const createInitialFields = useCallback((values: T): Record<keyof T, FormField<T[keyof T]>> => {
    const fields = {} as Record<keyof T, FormField<T[keyof T]>>
    Object.keys(values).forEach(key => {
      const k = key as keyof T
      fields[k] = {
        value: values[k],
        error: null,
        touched: false,
      }
    })
    return fields
  }, [])

  const [fields, setFields] = useState<Record<keyof T, FormField<T[keyof T]>>>(() => createInitialFields(initialValues))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = useCallback(
    <K extends keyof T>(field: K): boolean => {
      if (!validation?.[field]) return true

      const validator = validation[field]
      if (!validator) return true

      const error = validator(fields[field].value)
      const isValid = !error

      if (isMountedRef.current) {
        setFields(prev => ({
          ...prev,
          [field]: { ...prev[field], error },
        }))
      }

      return isValid
    },
    [validation, fields]
  )

  const validateForm = useCallback((): boolean => {
    let isValid = true

    Object.keys(fields).forEach(key => {
      const k = key as keyof T
      if (!validateField(k)) {
        isValid = false
      }
    })

    return isValid
  }, [fields, validateField])

  const setFieldValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setFields(prev => ({
        ...prev,
        [field]: { ...prev[field], value, touched: true },
      }))
    },
    []
  )

  const setFieldError = useCallback(
    <K extends keyof T>(field: K, error: string | null) => {
      setFields(prev => ({
        ...prev,
        [field]: { ...prev[field], error },
      }))
    },
    []
  )

  const setFieldTouched = useCallback(
    <K extends keyof T>(field: K, touched: boolean) => {
      setFields(prev => ({
        ...prev,
        [field]: { ...prev[field], touched },
      }))
    },
    []
  )

  const resetField = useCallback(
    <K extends keyof T>(field: K) => {
      setFields(prev => ({
        ...prev,
        [field]: {
          value: initialValues[field],
          error: null,
          touched: false,
        },
      }))
    },
    [initialValues]
  )

  const resetForm = useCallback(() => {
    setFields(createInitialFields(initialValues))
    setIsSubmitting(false)
  }, [initialValues, createInitialFields])

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const values = {} as T
      Object.keys(fields).forEach(key => {
        const k = key as keyof T
        values[k] = fields[k].value
      })

      await onSubmit?.(values)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false)
      }
    }
  }, [fields, validateForm, onSubmit])

  // Computed values
  const isValid = Object.values(fields).every(field => !field.error)
  const isDirty = Object.values(fields).some(field => field.touched)

  return {
    state: {
      fields: fields as T,
      isSubmitting,
      isValid,
      isDirty,
    },
    setFieldValue,
    setFieldError,
    setFieldTouched,
    handleSubmit,
    resetForm,
    resetField,
    validateField,
    validateForm,
  }
}

// Helper for common validation functions
export const validators = {
  required: (message = 'This field is required') => (value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return message
    }
    return null
  },

  email: (message = 'Please enter a valid email') => (value: string) => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? null : message
  },

  minLength: (min: number, message?: string) => (value: string) => {
    if (!value) return null
    return value.length >= min ? null : message || `Must be at least ${min} characters`
  },

  maxLength: (max: number, message?: string) => (value: string) => {
    if (!value) return null
    return value.length <= max ? null : message || `Must be no more than ${max} characters`
  },

  pattern: (regex: RegExp, message = 'Invalid format') => (value: string) => {
    if (!value) return null
    return regex.test(value) ? null : message
  },

  url: (message = 'Please enter a valid URL') => (value: string) => {
    if (!value) return null
    try {
      new URL(value)
      return null
    } catch {
      return message
    }
  },
}