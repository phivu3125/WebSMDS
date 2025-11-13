import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface AdminErrorBoundaryProps {
  error: Error
  resetError: () => void
}

export function AdminErrorFallback({ error, resetError }: AdminErrorBoundaryProps) {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto mt-20">
        <div className="border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-6">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />

          <h1 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
            Admin Dashboard Error
          </h1>

          <p className="text-sm text-red-600 dark:text-red-400 mb-6">
            {process.env.NODE_ENV === 'development'
              ? error.message
              : 'An error occurred in the admin dashboard. Please try again or contact the development team if the problem persists.'}
          </p>

          <div className="flex flex-col gap-3">
            <Button onClick={resetError} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 rounded">
              <summary className="cursor-pointer text-sm font-mono text-red-800 dark:text-red-200">
                Stack Trace
              </summary>
              <pre className="mt-2 text-xs overflow-auto text-red-700 dark:text-red-300 whitespace-pre-wrap">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}

// Special error boundary for admin sections
export function AdminSectionErrorBoundary({
  children,
  section,
}: {
  children: React.ReactNode
  section: string
}) {
  return (
    <div
      className="border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800 p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
          {section} Section Error
        </h3>
      </div>

      <p className="text-sm text-orange-600 dark:text-orange-400 mb-4">
        This section failed to load. The rest of the admin dashboard continues to work.
      </p>

      <Button
        variant="outline"
        size="sm"
        onClick={() => window.location.reload()}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Reload Section
      </Button>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4">
          <details className="text-xs">
            <summary className="cursor-pointer font-mono text-orange-800 dark:text-orange-200">
              Debug Info
            </summary>
            <div className="mt-2 p-2 bg-orange-100 dark:bg-orange-900/30 rounded text-orange-700 dark:text-orange-300">
              Section: {section}
              <br />
              Check the console for more details.
            </div>
          </details>
        </div>
      )}
    </div>
  )
}