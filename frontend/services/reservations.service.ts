import { apiRequest } from "@/lib/api-client"
import type { Reservation } from "@/lib/types"

export const reservationsService = {
  // --- TOURISTE ---
  async createReservation(data: Partial<Reservation>): Promise<Reservation> {
    return apiRequest<Reservation>("/tourist/reservations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMyReservations(): Promise<Reservation[]> {
    return apiRequest<Reservation[]>("/tourist/reservations/my", {
      method: "GET",
    });
  },

  async cancelReservation(id: number): Promise<void> {
    return apiRequest<void>(`/tourist/reservations/${id}`, {
      method: "DELETE",
    });
  },

  // --- ADMIN ---
  async getAllReservationsAdmin(): Promise<Reservation[]> {
    return apiRequest<Reservation[]>("/tourist/reservations/all", {
      method: "GET",
    });
  },
  async updateStatus(id: number, status: string): Promise<Reservation> {
  return apiRequest<Reservation>(`/tourist/reservations/${id}/status?status=${status}`, {
    method: "PUT",
  });
},

/**
 * Admin : Récupérer toutes les réservations du système
 */


  async updateReservationStatus(id: number, status: string): Promise<Reservation> {
    return apiRequest<Reservation>(`/tourist/reservations/${id}/status?status=${status}`, {
      method: "PUT",
    });
  }
};