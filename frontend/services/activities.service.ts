import { apiRequest } from "@/lib/api-client"
import type { Activity } from "@/lib/types"

export const activitiesService = {
  async getAllActivities(): Promise<Activity[]> {
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

  async createActivity(data: Omit<Activity, "id">): Promise<Activity> {
    return apiRequest<Activity>("/activities", {
      method: "POST",
      body: JSON.stringify(data),
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
