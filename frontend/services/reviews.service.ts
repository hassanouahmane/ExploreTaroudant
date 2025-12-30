import { apiRequest } from "@/lib/api-client"
import type { Review } from "@/lib/types"

export const reviewsService = {
  
  
    //Créer un nouvel avis pour un lieu. 
  // services/reviews.service.ts
// services/reviews.service.ts

async createReview(placeId: number, rating: number, comment: string): Promise<Review> {
  const params = new URLSearchParams();
  params.append("placeId", String(placeId));
  params.append("rating", String(rating));
  params.append("comment", comment.trim());

  return apiRequest<Review>(`/reviews?${params.toString()}`, {
    method: "POST"
  });
},
  async getReviewsByPlace(placeId: number): Promise<Review[]> {
    return apiRequest<Review[]>(`/reviews/place/${placeId}`);
  },

  async getAverageRating(placeId: number): Promise<number> {
    return apiRequest<number>(`/reviews/place/${placeId}/average`);
  },

async updateReview(id: number, rating: number, comment: string): Promise<Review> {
  const query = `rating=${rating}&comment=${encodeURIComponent(comment)}`;
  
  return apiRequest<Review>(`/reviews/${id}?${query}`, {
    method: "PUT"
  });
},
  // Admin: Récupérer tous les avis.
async getAllReviewsAdmin(): Promise<Review[]> {
  return apiRequest<Review[]>("/reviews/all", { 
    method: "GET" 
  });
},
  
    //Récupérer tous les avis d'un lieu spécifiq

  
  //  Récupérer les avis d'un utilisateur spécifique.
   
  async getReviewsByUser(userId: number): Promise<Review[]> {
    return apiRequest<Review[]>(`/reviews/user/${userId}`, {
      method: "GET"
    });
  },

  /**
   * Mettre à jour un avis existant.
   */
  

   

  /**
   * Supprimer un avis.
   */
  async deleteReview(id: number): Promise<void> {
    return apiRequest<void>(`/reviews/${id}`, {
      method: "DELETE"
    });
  }
};