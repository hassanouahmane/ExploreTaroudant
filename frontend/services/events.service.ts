import { apiRequest } from "@/lib/api-client"
import type { Event } from "@/lib/types"

export const eventsService = {
  async getAllEvents(): Promise<Event[]> {
    return apiRequest<Event[]>("/events")
  },

  async getUpcomingEvents(): Promise<Event[]> {
    return apiRequest<Event[]>("/events/upcoming")
  },

  async getEventById(id: number): Promise<Event> {
    return apiRequest<Event>(`/events/${id}`)
  },

  async createEvent(data: Omit<Event, "id">): Promise<Event> {
    return apiRequest<Event>("/events", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async updateEvent(id: number, data: Partial<Event>): Promise<Event> {
    return apiRequest<Event>(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async deleteEvent(id: number): Promise<void> {
    return apiRequest<void>(`/events/${id}`, {
      method: "DELETE",
    })
  },
}
