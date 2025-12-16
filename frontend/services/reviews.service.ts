import { apiRequest } from "@/lib/api-client"
import type { Review } from "@/lib/types"

export const reviewsService = {
    async createReview(data: {
        placeId: number
        rating: number
        comment: string
    }): Promise<Review> {
        // ENVOYEZ les paramètres dans l'URL comme le backend l'attend
        return apiRequest<Review>(
            `/reviews?placeId=${data.placeId}&rating=${data.rating}&comment=${encodeURIComponent(data.comment)}`,
            {
                method: "POST",
            }
        )
    },

    // Autres méthodes restent inchangées
    async getReviewsByPlace(placeId: number): Promise<Review[]> {
        return apiRequest<Review[]>(`/reviews/place/${placeId}`)
    },

    async getReviewsByUser(userId: number): Promise<Review[]> {
        return apiRequest<Review[]>(`/reviews/user/${userId}`)
    },

    async getReviewById(id: number): Promise<Review> {
        return apiRequest<Review>(`/reviews/${id}`)
    },

    async updateReview(id: number, data: { rating: number; comment: string }): Promise<Review> {
        return apiRequest<Review>(
            `/reviews/${id}?rating=${data.rating}&comment=${encodeURIComponent(data.comment)}`,
            {
                method: "PUT",
            }
        )
    },

    async deleteReview(id: number): Promise<void> {
        return apiRequest<void>(`/reviews/${id}`, {
            method: "DELETE",
        })
    },

    async getAverageRating(placeId: number): Promise<{ average: number; count: number }> {
        return apiRequest<{ average: number; count: number }>(`/reviews/place/${placeId}/average`)
    },
}