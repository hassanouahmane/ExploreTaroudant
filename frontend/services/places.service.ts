import { apiRequest } from "@/lib/api-client"
import type { Place } from "@/lib/types"

export const placesService = {
  async getAllPlaces(): Promise<Place[]> {
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

  async createPlace(data: Omit<Place, "id" | "createdAt">): Promise<Place> {
    return apiRequest<Place>("/places", {
      method: "POST",
      body: JSON.stringify(data),
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
