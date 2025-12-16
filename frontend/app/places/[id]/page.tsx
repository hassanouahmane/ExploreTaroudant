"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ReviewCard } from "@/components/review-card"
import { ReviewForm } from "@/components/review-form"
import { useToast } from "@/hooks/use-toast"
import { placesService } from "@/services/places.service"
import { activitiesService } from "@/services/activities.service"
import { reviewsService } from "@/services/reviews.service"
import { authService } from "@/services/auth.service"
import type { Place, Activity, Review } from "@/lib/types"
import { MapPin, Clock, Loader2, Star } from "lucide-react"
import Link from "next/link"

export default function PlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [place, setPlace] = useState<Place | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState<number>(0)
  const [reviewCount, setReviewCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated())
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const placeId = Number.parseInt(resolvedParams.id)

        const [placeData, activitiesData, reviewsData, ratingData] = await Promise.all([
          placesService.getPlaceById(placeId),
          activitiesService.getActivitiesByPlace(placeId),
          reviewsService.getReviewsByPlace(placeId),
          reviewsService.getAverageRating(placeId),
        ])

        setPlace(placeData)
        setActivities(activitiesData)
        setReviews(reviewsData)
        setAverageRating(ratingData.average)
        setReviewCount(ratingData.count)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du lieu",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [resolvedParams.id, toast])

  const handleReviewSuccess = async () => {
    setShowReviewForm(false)

    try {
      const placeId = Number.parseInt(resolvedParams.id)
      const [reviewsData, ratingData] = await Promise.all([
        reviewsService.getReviewsByPlace(placeId),
        reviewsService.getAverageRating(placeId),
      ])

      setReviews(reviewsData)
      setAverageRating(ratingData.average)
      setReviewCount(ratingData.count)
    } catch (error) {
      console.error("Failed to refresh reviews:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!place) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg text-muted-foreground">Lieu non trouvé</p>
      </div>
    )
  }

  return (
    <div className="pb-20">
      {/* Hero Image */}
      <div className="relative h-[400px] w-full">
        <img
          src={place.imageUrl || `/placeholder.svg?height=400&width=1200&query=${place.name}+${place.city}`}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{place.name}</h1>
          <p className="flex items-center gap-2 text-white/90 text-lg">
            <MapPin className="h-5 w-5" />
            {place.city}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{place.description}</p>
              </CardContent>
            </Card>

            {/* Activities */}
            {activities.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Activités disponibles</h2>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <Link key={activity.id} href={`/activities/${activity.id}`}>
                        <div className="flex items-start justify-between p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{activity.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{activity.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {activity.duration}
                              </span>
                              <span className="font-semibold text-primary">{activity.price} MAD</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Avis</h2>
                    {reviewCount > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.round(averageRating) ? "fill-accent text-accent" : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({reviewCount} avis)</span>
                      </div>
                    )}
                  </div>
                  {isAuthenticated && !showReviewForm && (
                    <Button onClick={() => setShowReviewForm(true)}>Écrire un avis</Button>
                  )}
                  {!isAuthenticated && (
                    <Button onClick={() => router.push("/auth/login")}>Connectez-vous pour donner votre avis</Button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="mb-6">
                    <ReviewForm placeId={place.id} placeName={place.name} onSuccess={handleReviewSuccess} />
                    <Button variant="outline" onClick={() => setShowReviewForm(false)} className="w-full mt-4">
                      Annuler
                    </Button>
                  </div>
                )}

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Aucun avis pour le moment</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-bold text-lg">Informations</h3>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ville</p>
                  <p className="font-medium">{place.city}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Coordonnées</p>
                  <p className="font-medium">
                    {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                  </p>
                </div>
                {reviewCount > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Note moyenne</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-accent text-accent" />
                      <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                      <span className="text-muted-foreground">/ 5</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
