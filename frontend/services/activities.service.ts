import { apiRequest } from "@/lib/api-client"
import type { Activity } from "@/lib/types"

export const activitiesService = {
  // --- ROUTES PUBLIQUES ---

  // Récupère uniquement les activités validées par l'admin
  async getAllActiveActivities(): Promise<Activity[]> {
    return apiRequest<Activity[]>("/activities")
  },

  async getActivityById(id: number): Promise<Activity> {
    return apiRequest<Activity>(`/activities/${id}`)
  },

  async getActivitiesByPlace(placeId: number): Promise<Activity[]> {
    return apiRequest<Activity[]>(`/activities/place/${placeId}`)
  },

  async getActivitiesByGuide(guideId: number): Promise<Activity[]> {
    return apiRequest<Activity[]>(`/activities/guide/${guideId}`)
  },
  // activities.service.ts
async getMyActivities(): Promise<Activity[]> {
    return apiRequest<Activity[]>("/activities/my-activities");
},

  // --- ROUTES GUIDES & ADMIN ---

  // Création d'une activité (le guide doit inclure l'imageUrl du Cloud)
  async createActivity(data: Omit<Activity, "id">): Promise<Activity> {
    return apiRequest<Activity>("/activities", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // --- ROUTES ADMIN UNIQUEMENT ---

  // Récupère TOUTES les activités pour le dashboard admin
  async getAllActivities(): Promise<Activity[]> {
    return apiRequest<Activity[]>("/activities/all")
  },

  // Liste des activités en attente de validation
  async getPendingActivities(): Promise<Activity[]> {
    return apiRequest<Activity[]>("/activities/pending")
  },

  // Valider une activité pour la rendre publique
  async validateActivity(id: number): Promise<Activity> {
    return apiRequest<Activity>(`/activities/${id}/validate`, {
      method: "PUT",
    })
  },

  async updateActivity(id: number, data: Partial<Activity>): Promise<Activity> {
    return apiRequest<Activity>(`/activities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async deleteActivity(id: number): Promise<void> {
    return apiRequest<void>(`/activities/${id}`, {
      method: "DELETE",
    })
  },
}