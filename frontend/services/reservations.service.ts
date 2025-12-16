import { apiRequest } from "@/lib/api-client"
import type { Reservation } from "@/lib/types"

export const reservationsService = {
    // Pour les activités
    async createActivityReservation(activityId: number, reservationDate: string): Promise<Reservation> {
        // FORMAT CORRECT pour le backend
        const requestBody = {
            reservationDate: reservationDate,
            activity: {
                id: activityId
            }
        }

        console.log("Envoi réservation activité:", requestBody)

        return apiRequest<Reservation>("/tourist/reservations", {
            method: "POST",
            body: JSON.stringify(requestBody),
        })
    },

    // Pour les circuits
    async createCircuitReservation(circuitId: number, reservationDate: string): Promise<Reservation> {
        // FORMAT CORRECT pour le backend
        const requestBody = {
            reservationDate: reservationDate,
            circuit: {
                id: circuitId
            }
        }

        console.log("Envoi réservation circuit:", requestBody)

        return apiRequest<Reservation>("/tourist/reservations", {
            method: "POST",
            body: JSON.stringify(requestBody),
        })
    },

    // Méthode générique (optionnelle)
    async createReservation(data: {
        activityId?: number
        circuitId?: number
        reservationDate: string
    }): Promise<Reservation> {
        const requestBody: any = {
            reservationDate: data.reservationDate
        }

        if (data.activityId) {
            requestBody.activity = { id: data.activityId }
        } else if (data.circuitId) {
            requestBody.circuit = { id: data.circuitId }
        }

        console.log("Envoi réservation:", requestBody)

        return apiRequest<Reservation>("/tourist/reservations", {
            method: "POST",
            body: JSON.stringify(requestBody),
        })
    },

    async getMyReservations(): Promise<Reservation[]> {
        return apiRequest<Reservation[]>("/tourist/reservations/my")
    },

    async cancelReservation(id: number): Promise<void> {
        return apiRequest<void>(`/tourist/reservations/${id}`, {
            method: "DELETE",
        })
    },
}