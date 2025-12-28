import { apiRequest } from "@/lib/api-client"
import type { Circuit } from "@/lib/types"

export const circuitsService = {
  // --- ACCÈS PUBLIC ---

  // Récupère les circuits validés (Status ACTIVE)
  async getActiveCircuits(): Promise<Circuit[]> {
    return apiRequest<Circuit[]>("/circuits", {
      method: "GET",
    })
  },

  // Récupère un circuit spécifique par son ID
  async getCircuitById(id: number): Promise<Circuit> {
    return apiRequest<Circuit>(`/circuits/${id}`, {
      method: "GET",
    })
  },

  // --- ACCÈS GUIDE ---

  // Récupère les circuits créés par le guide connecté (utilise le Token JWT)
  async getMyCircuits(): Promise<Circuit[]> {
    return apiRequest<Circuit[]>("/circuits/my-circuits", {
      method: "GET",
    })
  },

  // --- ACCÈS ADMIN (Modération) ---

  // Liste des circuits en attente de validation par l'Admin
  async getPendingCircuits(): Promise<Circuit[]> {
    return apiRequest<Circuit[]>("/circuits/pending", {
      method: "GET",
    })
  },

  // Valider un circuit (Change Status PENDING -> ACTIVE)
  async validateCircuit(id: number): Promise<Circuit> {
    return apiRequest<Circuit>(`/circuits/${id}/validate`, {
      method: "PUT",
    })
  },

  // --- GESTION CRUD (JSON UNIQUEMENT) ---

  // Création d'un circuit sans image
  async createCircuit(data: {
    title: string;
    description: string;
    duration: string;
    price: number;
  }): Promise<Circuit> {
    return apiRequest<Circuit>("/circuits", {
      method: "POST",
      body: JSON.stringify(data), // Envoi en JSON standard car pas d'image
    })
  },

  // Mise à jour des informations textuelles
  async updateCircuit(id: number, data: Partial<Circuit>): Promise<Circuit> {
    return apiRequest<Circuit>(`/circuits/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Suppression d'un circuit
  async deleteCircuit(id: number): Promise<void> {
    return apiRequest<void>(`/circuits/${id}`, {
      method: "DELETE",
    })
  },
}