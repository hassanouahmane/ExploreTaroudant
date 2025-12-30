import { apiRequest } from "@/lib/api-client"
import type { Event } from "@/lib/types"

export const eventsService = {
  // --- ROUTES PUBLIQUES ---

  // Récupère uniquement les événements actifs (validés)
  async getAllActiveEvents(): Promise<Event[]> {
    return apiRequest<Event[]>("/events")
  },

  async getUpcomingEvents(): Promise<Event[]> {
    return apiRequest<Event[]>("/events/upcoming")
  },

  async getEventById(id: number): Promise<Event> {
    return apiRequest<Event>(`/events/${id}`)
  },

  // --- ROUTES GUIDES & ADMIN ---

  // Création d'un événement 
  async createEvent(data: Omit<Event, "id">): Promise<Event> {
    return apiRequest<Event>("/events", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Mise à jour d'un événement
  async updateEvent(id: number, data: Partial<Event>): Promise<Event> {
    return apiRequest<Event>(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // --- ROUTES ADMIN UNIQUEMENT ---

  // Récupérer absolument tous les événements (Dashboard Admin)
  async getAllEventsForAdmin(): Promise<Event[]> {
    return apiRequest<Event[]>("/events/all")
  },

  // Récupérer les événements en attente de validation
  async getPendingEvents(): Promise<Event[]> {
    return apiRequest<Event[]>("/events/pending")
  },

  // Valider un événement (Hamza en propose un, l'Admin le valide)
  async validateEvent(id: number): Promise<Event> {
    return apiRequest<Event>(`/events/${id}/validate`, {
      method: "PUT",
    })
  },

async getMyProposedEvents(): Promise<Event[]> {
  return apiRequest<Event[]>("/events/my-proposals", {
    method: "GET",
  })
},

  async deleteEvent(id: number): Promise<void> {
    return apiRequest<void>(`/events/${id}`, {
      method: "DELETE",
    })
  },
}