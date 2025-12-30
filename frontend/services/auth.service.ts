import { apiRequest } from "@/lib/api-client"
import type { User, AuthResponse } from "@/lib/types"

export const authService = {
  // --- INSCRIPTION ---
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

  // --- CONNEXION ---
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
      if (error.message && (error.message.includes("suspendu") || error.message.includes("locked"))) {
        throw new Error("Compte non activé. Veuillez contacter l'admin.");
      }
      throw error;
    }
  },

  // --- UTILISATEUR COURANT ---
  async getCurrentUser(): Promise<User> {
    return apiRequest<User>(`/auth/me`)
  },

  // --- MISE À JOUR PROFIL ---
  // Accepte les champs communs + password + champs spécifiques aux guides
  async updateProfile(data: { 
    fullName?: string; 
    phone?: string; 
    password?: string; 
    email?: string;
    bio?: string;       // Pour le Guide
    languages?: string; // Pour le Guide
  }): Promise<User> {
    return apiRequest<User>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // --- GESTION DU STOCKAGE LOCAL ---
  saveAuthData(data: AuthResponse) {
    if (typeof window !== "undefined" && data.token) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data.id.toString())
      localStorage.setItem("userRole", data.role)
      localStorage.setItem("userName", data.fullName)
    }
  },

  // --- DÉCONNEXION ---
  logout() {
    if (typeof window !== "undefined") {
      localStorage.clear(); 
      // Correction : Ajout du "/" au début pour une redirection absolue
      window.location.href = "/auth/login"; 
    }
  },

  // --- HELPERS (Rôles) ---
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