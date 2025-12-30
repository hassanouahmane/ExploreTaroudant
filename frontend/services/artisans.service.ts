// services/artisans.service.ts
import { apiRequest } from "@/lib/api-client"
import type { Artisan } from "@/lib/types"

export const artisansService = {
  // Lecture
  async getAllActiveArtisans(): Promise<Artisan[]> {
    return apiRequest<Artisan[]>("/artisans");
  },
  
  async getAllArtisans(): Promise<Artisan[]> {
    return apiRequest<Artisan[]>("/artisans/all");
  },

  async getArtisanById(id: number): Promise<Artisan> {
    return apiRequest<Artisan>(`/artisans/${id}`);
  },

  // Création
  async createArtisan(data: Partial<Artisan>): Promise<Artisan> {
    return apiRequest<Artisan>("/artisans", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Mise à jour (Celle qui posait problème)
  async updateArtisan(id: number, data: Partial<Artisan>): Promise<Artisan> {
    return apiRequest<Artisan>(`/artisans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Admin uniquement
  async validateArtisan(id: number): Promise<Artisan> {
    return apiRequest<Artisan>(`/artisans/${id}/validate`, {
      method: "PUT",
    });
  },

  async deleteArtisan(id: number): Promise<void> {
    return apiRequest<void>(`/artisans/${id}`, {
      method: "DELETE",
    });
  }
};