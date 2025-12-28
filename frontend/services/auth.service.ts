import { apiRequest } from "@/lib/api-client"
import type { User, AuthResponse } from "@/lib/types"

export const authService = {
  async register(data: {
    fullName: string
    email: string
    password: string
    phone?: string
    role: "TOURIST" | "GUIDE" | "ADMIN" 
  }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.token) {
        throw new Error("Votre compte est en attente de validation par l'administrateur.");
      }
      
      return response;
    } catch (error: any) {
      // Gestion des erreurs personnalisée selon vos messages Backend
      if (error.message.includes("suspendu") || error.message.includes("locked")) {
        throw new Error("Compte non activé. Veuillez contacter l'admin.");
      }
      throw error;
    }
  },

  async getCurrentUser(userId: string): Promise<User> {
    // Note: Dans votre backend, c'est /api/auth/current-user ou similaire
    return apiRequest<User>(`/auth/users/me`)
  },

  // Stockage des données après succès
  saveAuthData(data: AuthResponse) {
    if (typeof window !== "undefined" && data.token) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data.id.toString())
      localStorage.setItem("userRole", data.role)
      localStorage.setItem("userName", data.fullName)
    }
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.clear(); // Plus propre pour tout vider
      window.location.href = "/login"; // Redirection forcée
    }
  },

  // Helpers utiles pour les interfaces Next.js
  isAdmin(): boolean {
    return this.getUserRole() === "ADMIN";
  },

  isGuide(): boolean {
    return this.getUserRole() === "GUIDE";
  },

  getUserRole(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("userRole")
  },
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  },
}