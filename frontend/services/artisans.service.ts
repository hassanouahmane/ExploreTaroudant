import { apiRequest } from "@/lib/api-client"
import type { Artisan } from "@/lib/types"

export const artisansService = {
  async getAllActiveArtisans(): Promise<Artisan[]> {
    return apiRequest<Artisan[]>("/artisans")
  },

  async getPendingArtisans(): Promise<Artisan[]> {
    return apiRequest<Artisan[]>("/artisans/pending")
  },

  async validateArtisan(id: number): Promise<Artisan> {
    return apiRequest<Artisan>(`/artisans/${id}/validate`, {
      method: "PUT",
    })
  },

  async deleteArtisan(id: number): Promise<void> {
    return apiRequest<void>(`/artisans/${id}`, {
      method: "DELETE",
    })
  },

  // CORRECTION : On envoie un objet simple correspondant à l'entité Java
  async createArtisan(data: {
    name: string;
    speciality: string;
    phone: string;
    city: string;
  }): Promise<Artisan> {
    return apiRequest<Artisan>("/artisans", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}