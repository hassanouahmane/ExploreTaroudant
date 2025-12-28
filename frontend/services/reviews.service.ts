import { apiRequest } from "@/lib/api-client"
import type { Review } from "@/lib/types"

export const reviewsService = {
  
  
    //Créer un nouvel avis pour un lieu. 
  async createReview(placeId: number, rating: number, comment: string): Promise<Review> {
    const params = new URLSearchParams({
      placeId: placeId.toString(),
      rating: rating.toString(),
      comment: comment
    });

    return apiRequest<Review>(`/reviews?${params.toString()}`, {
      method: "POST"
    });
  },

  // Admin: Récupérer tous les avis.
async getAllReviewsAdmin(): Promise<Review[]> {
  return apiRequest<Review[]>("/reviews/all", { 
    method: "GET" 
  });
},
  
    //Récupérer tous les avis d'un lieu spécifique.
   
  async getReviewsByPlace(placeId: number): Promise<Review[]> {
    return apiRequest<Review[]>(`/reviews/place/${placeId}`, {
      method: "GET"
    });
  },

  
   // Récupérer la note moyenne d'un lieu.
   
  async getAverageRating(placeId: number): Promise<number> {
    return apiRequest<number>(`/reviews/place/${placeId}/average`, {
      method: "GET"
    });
  },

  
  //  Récupérer les avis d'un utilisateur spécifique.
   
  async getReviewsByUser(userId: number): Promise<Review[]> {
    return apiRequest<Review[]>(`/reviews/user/${userId}`, {
      method: "GET"
    });
  },

  /**
   * Mettre à jour un avis existant.
   */
  async updateReview(id: number, rating: number, comment: string): Promise<Review> {
    const params = new URLSearchParams({
      rating: rating.toString(),
      comment: comment
    });

    return apiRequest<Review>(`/reviews/${id}?${params.toString()}`, {
      method: "PUT"
    });
  },

  /**
   * Supprimer un avis.
   */
  async deleteReview(id: number): Promise<void> {
    return apiRequest<void>(`/reviews/${id}`, {
      method: "DELETE"
    });
  }
};