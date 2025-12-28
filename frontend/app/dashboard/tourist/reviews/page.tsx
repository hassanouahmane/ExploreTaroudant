"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { ReviewCard } from "@/components/review-card"
import { reviewsService } from "@/services/reviews.service"
import { useToast } from "@/hooks/use-toast"
import type { Review } from "@/lib/types"
import { Loader2, MessageSquareText } from "lucide-react"

function ReviewsContent() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (userId) {
          const data = await reviewsService.getReviewsByUser(Number(userId))
          setReviews(data)
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger vos avis",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchReviews()
  }, [toast])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center gap-4">
        <MessageSquareText className="h-10 w-10 text-accent" />
        <div>
          <h1 className="text-3xl font-bold">Mes Avis</h1>
          <p className="text-muted-foreground">Vos partages d'expérience sur les lieux visités</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">Vous n'avez pas encore laissé d'avis.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <ProtectedRoute allowedRoles={["TOURIST"]}>
      <ReviewsContent />
    </ProtectedRoute>
  )
}