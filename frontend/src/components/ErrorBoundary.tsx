import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        return <>{this.props.fallback}</>
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20 dark:border-red-800">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />

          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Something went wrong
          </h2>

          <p className="text-sm text-red-600 dark:text-red-400 text-center mb-6 max-w-md">
            {process.env.NODE_ENV === 'development'
              ? this.state.error?.message || 'An unexpected error occurred'
              : 'An unexpected error occurred. Please try again or contact support if the problem persists.'
            }
          </p>

          <div className="flex gap-3">
            <Button onClick={this.handleRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 rounded text-left">
              <summary className="cursor-pointer text-sm font-mono text-red-800 dark:text-red-200">
                Error Details
              </summary>
              <pre className="mt-2 text-xs overflow-auto text-red-700 dark:text-red-300">
                {this.state.error?.stack}
                {'\n\n'}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

// Specialized error boundary for API components
interface ApiErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onApiError?: (error: Error) => void
}

export function ApiErrorBoundary({ children, fallback, onApiError }: ApiErrorBoundaryProps) {
  const handleApiError = (error: Error, errorInfo: ErrorInfo) => {
    // Check if it's an API-related error
    if (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('API')
    ) {
      onApiError?.(error)
    }
  }

  return (
    <ErrorBoundary
      onError={handleApiError}
      fallback={
        fallback || (
          <div className="flex flex-col items-center justify-center min-h-[200px] p-6 border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
            <AlertTriangle className="h-10 w-10 text-orange-500 mb-3" />
            <h3 className="text-base font-medium text-orange-800 dark:text-orange-200 mb-2">
              Connection Error
            </h3>
            <p className="text-sm text-orange-600 dark:text-orange-400 text-center">
              Unable to connect to the server. Please check your internet connection and try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Reload
            </Button>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  )
}

// Hook for handling errors in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by error handler:', error, errorInfo)

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToErrorReportingService(error, errorInfo)
    }
  }
}

// Default export for convenience
export default ErrorBoundary