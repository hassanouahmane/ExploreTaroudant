import { apiRequest } from "@/lib/api-client"
import type { Report, ReportStatus } from "@/lib/types"

export const reportsService = {
  /**
   * Envoyer un nouveau signalement.
   * Accessible par tout utilisateur authentifié.
   * @param data Type de rapport et description.
   */
  async submitReport(data: {
    reportType: string;
    description: string;
  }): Promise<Report> {
    return apiRequest<Report>("/reports", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  /**
   * Récupérer tous les signalements (Dashboard Admin).
   * Nécessite le rôle ADMIN.
   */
  async getAllReports(): Promise<Report[]> {
    return apiRequest<Report[]>("/reports", {
      method: "GET",
    })
  },

  /**
   * Mettre à jour le statut d'un signalement (ex: OPEN -> RESOLVED).
   * Nécessite le rôle ADMIN.
   * @param id ID du rapport.
   * @param status Nouveau statut (utilisant @RequestParam côté Java).
   */
  async updateStatus(id: number, status: ReportStatus): Promise<Report> {
    return apiRequest<Report>(`/reports/${id}/status?status=${status}`, {
      method: "PUT",
    })
  }
}