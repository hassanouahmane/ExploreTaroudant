import { apiRequest } from "@/lib/api-client"
import type { User, AuthResponse } from "@/lib/types"

export const authService = {
  async register(data: {
    fullName: string
    email: string
    password: string
    phone?: string
    role: "TOURIST" | "GUIDE"
  }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  async getCurrentUser(): Promise<User> {
    return apiRequest<User>("/auth/me")
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiRequest<User>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userName")
    }
  },

  saveAuthData(data: AuthResponse) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data.id.toString())
      localStorage.setItem("userRole", data.role)
      localStorage.setItem("userName", data.fullName)
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("token")
  },

  getUserRole(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("userRole")
  },
}
