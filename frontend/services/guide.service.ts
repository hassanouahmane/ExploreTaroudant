import { apiRequest } from "@/lib/api-client"
import type { User, Circuit } from "@/lib/types"

export const guideService = {
  // --- GESTION DU PROFIL ---

 
  async getProfile(): Promise<User> {
    return apiRequest<User>("/guide/profile", {
      method: "GET",
    })
  },

  
   // Met à jour les informations du profil du guide.
   
  async updateProfile(data: Partial<User>): Promise<User> {
    return apiRequest<User>("/guide/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // --- GESTION DES CIRCUITS (ESPACE GUIDE) ---

  
    //Récupère uniquement les circuits créés par ce guide.
   
  async getMyCircuits(): Promise<Circuit[]> {
    return apiRequest<Circuit[]>("/guide/circuits", {
      method: "GET",
    })
  },

  /**
   * Récupère un de ses propres circuits par son ID.
   */
  async getMyCircuitById(id: number): Promise<Circuit> {
    return apiRequest<Circuit>(`/guide/circuits/${id}`, {
      method: "GET",
    })
  },

  /**
   * Crée un nouveau circuit rattaché au guide connecté.
   */
  async createCircuit(data: Omit<Circuit, "id" | "status">): Promise<Circuit> {
    return apiRequest<Circuit>("/guide/circuits", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  /**
   * Met à jour un circuit appartenant au guide.
   */
  async updateCircuit(id: number, data: Partial<Circuit>): Promise<Circuit> {
    return apiRequest<Circuit>(`/guide/circuits/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  /**
   * Supprime un circuit appartenant au guide.
   */
  async deleteCircuit(id: number): Promise<void> {
    return apiRequest<void>(`/guide/circuits/${id}`, {
      method: "DELETE",
    })
  },
}