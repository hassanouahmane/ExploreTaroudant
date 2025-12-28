import { apiRequest } from "@/lib/api-client"
import type { User, Status } from "@/lib/types"

export const adminService = {
  // Récupérer tous les guides 
  async getAllGuides(): Promise<User[]> {
    return apiRequest<User[]>("/admin/guides", {
      method: "GET",
    })
  },

  // Récupérer tous les touristes
  async getAllTourists(): Promise<User[]> {
    return apiRequest<User[]>("/admin/tourists", {
      method: "GET",
    })
  },

  // Récupérer la liste globale de tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    return apiRequest<User[]>("/admin/users", {
      method: "GET",
    })
  },

  // ACTIVER/BLOQUER UN GUIDE (ex: passer de PENDING à ACTIVE)
  async updateGuideStatus(id: number, status: Status): Promise<User> {
    return apiRequest<User>(`/admin/guides/${id}/status?status=${status}`, {
      method: "PUT",
    })
  },

  // Supprimer un guide
  async deleteGuide(id: number): Promise<void> {
    return apiRequest<void>(`/admin/guides/${id}`, {
      method: "DELETE",
    })
  },

  // Supprimer un touriste
  async deleteTourist(id: number): Promise<void> {
    return apiRequest<void>(`/admin/tourists/${id}`, {
      method: "DELETE",
    })
  },

  // Récupérer les statistiques pour le Dashboard (Total guides, touristes, etc.)
  async getUserStats(): Promise<Record<string, number>> {
    return apiRequest<Record<string, number>>("/admin/stats/users", {
      method: "GET",
    })
  }
}