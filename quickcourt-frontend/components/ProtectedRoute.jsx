"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children, allowedRoles = [], redirectTo = "/auth/login" }) {
  const { user, isAuthenticated, isLoading, getUserRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (allowedRoles.length > 0) {
        const userRole = getUserRole()
        if (!allowedRoles.includes(userRole)) {
          // Redirect based on user role
          if (userRole === 'admin') {
            router.push('/admin/dashboard')
          } else if (userRole === 'facility_owner') {
            router.push('/owner/dashboard')
          } else {
            router.push('/')
          }
          return
        }
      }
    }
  }, [isAuthenticated, isLoading, allowedRoles, redirectTo, router, getUserRole])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(getUserRole())) {
    return null
  }

  return children
}
