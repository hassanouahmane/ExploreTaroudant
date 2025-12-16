"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { ReviewCard } from "@/components/review-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { reviewsService } from "@/services/reviews.service"
import { authService } from "@/services/auth.service"
import type { Review } from "@/lib/types"
import { Loader2, Trash2, Star } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

function ReviewsContent() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const user = authService.getCurrentUser()
        if (user) {
          const data = await reviewsService.getReviewsByUser(user.id)
          setReviews(data)
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les avis",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [toast])

  const handleDeleteReview = async (id: number) => {
    setDeletingId(id)

    try {
      await reviewsService.deleteReview(id)
      setReviews((prev) => prev.filter((r) => r.id !== id))

      toast({
        title: "Avis supprimé",
        description: "Votre avis a été supprimé avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'avis",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Mes Avis</h1>
          <p className="text-muted-foreground">Gérez tous vos avis sur les lieux visités</p>
        </div>
        <Button asChild>
          <Link href="/places">
            <Star className="mr-2 h-4 w-4" />
            Écrire un avis
          </Link>
        </Button>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucun avis</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">Vous n&apos;avez pas encore donné d&apos;avis</p>
            <Button asChild>
              <Link href="/places">Explorer les lieux</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="relative">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/places/${review.placeId}`}>
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">
                          {review.place?.name || `Lieu #${review.placeId}`}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{review.place?.city}</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deletingId === review.id}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {deletingId === review.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cet avis?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Votre avis sera définitivement supprimé.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteReview(review.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <ReviewCard review={review} />
                </CardContent>
              </Card>
            </div>
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
