"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        router.push("/auth/login")
        return
      }

      if (allowedRoles) {
        const userRole = authService.getUserRole()
        if (!userRole || !allowedRoles.includes(userRole)) {
          router.push("/")
          return
        }
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [router, allowedRoles])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
