import { apiRequest } from "@/lib/api-client"
import type { Place, User } from "@/lib/types"

export const placesService = {
  // --- ROUTES PUBLIQUES ---

  // Récupère uniquement les lieux actifs (ceux validés par l'admin)
  async getAllActivePlaces(): Promise<Place[]> {
    return apiRequest<Place[]>("/places")
  },

  async getPlaceById(id: number): Promise<Place> {
    return apiRequest<Place>(`/places/${id}`)
  },

  async searchPlaces(query: string): Promise<Place[]> {
    return apiRequest<Place[]>(`/places/search?query=${encodeURIComponent(query)}`)
  },

  async getPlacesByCity(city: string): Promise<Place[]> {
    return apiRequest<Place[]>(`/places/city/${encodeURIComponent(city)}`)
  },

  // --- ROUTES GUIDES & ADMIN ---

  // Création d'un lieu 
  async createPlace(data: Omit<Place, "id" | "createdAt">): Promise<Place> {
    return apiRequest<Place>("/places", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // --- ROUTES ADMIN UNIQUEMENT ---

  // Récupère TOUS les lieux (pour le dashboard admin)
  async getAllPlacesForAdmin(): Promise<Place[]> {
    return apiRequest<Place[]>("/places/all")
  },

  // Récupère uniquement les lieux en attente de validation
  async getPendingPlaces(): Promise<Place[]> {
    return apiRequest<Place[]>("/places/pending")
  },

  // Valide un lieu (change son statut de PENDING à ACTIVE)
  async validatePlace(id: number): Promise<Place> {
    return apiRequest<Place>(`/places/${id}/validate`, {
      method: "PUT",
    })
  },

  async updatePlace(id: number, data: Partial<Place>): Promise<Place> {
    return apiRequest<Place>(`/places/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async deletePlace(id: number): Promise<void> {
    return apiRequest<void>(`/places/${id}`, {
      method: "DELETE",
    })
  },
}