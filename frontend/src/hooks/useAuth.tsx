import React, { useState, useCallback, useEffect, createContext, useContext, ReactNode } from 'react'

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }

      const data = await response.json()

      setState({
        user: data.user,
        loading: false,
        error: null,
      })

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      return false
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setState({
        user: null,
        loading: false,
        error: null,
      })
    }
  }, [])

  const checkAuth = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }))

    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setState({
          user: data.user,
          loading: false,
          error: null,
        })
      } else {
        setState({
          user: null,
          loading: false,
          error: null,
        })
      }
    } catch (error) {
      setState({
        user: null,
        loading: false,
        error: null,
      })
    }
  }, [])

  const updateUser = useCallback((userData: Partial<User>): void => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }))
  }, [])

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    checkAuth,
    updateUser,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protecting routes
interface WithAuthProps {
  children: ReactNode
  requireRole?: string
  fallback?: ReactNode
}

export function WithAuth({ children, requireRole, fallback }: WithAuthProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return fallback || <div>Please log in to continue.</div>
  }

  if (requireRole && user.role !== requireRole) {
    return fallback || <div>Access denied. Insufficient permissions.</div>
  }

  return <>{children}</>
}

// Hook for authentication state with convenience methods
export function useAuthActions() {
  const { user, login, logout, checkAuth, updateUser } = useAuth()

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    checkAuth,
    updateUser,
  }
}

// Hook for admin-only access
export function useAdminAuth() {
  const auth = useAuth()

  return {
    ...auth,
    isAdmin: auth.user?.role === 'admin',
    canAccessAdmin: !!auth.user && auth.user.role === 'admin',
  }
}