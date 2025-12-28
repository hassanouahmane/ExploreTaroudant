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
import { MapPin, Clock, Loader2, Star, } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge" // Ajout du composant UI manquant

export default function PlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [place, setPlace] = useState<Place | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated())
    
    const fetchData = async () => {
      try {
        const placeId = Number.parseInt(resolvedParams.id)
        
        // Appels parallèles pour optimiser le temps de chargement
        const [placeData, activitiesData, reviewsData, rating] = await Promise.all([
          placesService.getPlaceById(placeId),
          activitiesService.getActivitiesByPlace(placeId),
          reviewsService.getReviewsByPlace(placeId),
          reviewsService.getAverageRating(placeId),
        ])

        setPlace(placeData)
        setActivities(activitiesData)
        setReviews(reviewsData)
        setAverageRating(rating) // Le backend renvoie un Double
      } catch (error) {
        toast({ title: "Erreur", description: "Lieu introuvable", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [resolvedParams.id, toast])

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>
  if (!place) return null

  return (
    <div className="pb-20">
      {/* Hero dynamique avec image du Backend */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <img
          src={place.imageUrl || "/images/taroudant-hero.jpg"}
          alt={place.name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-12 container mx-auto text-white">
          <Badge className="mb-4 bg-accent/80 hover:bg-accent">{place.city}</Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-md">{place.name}</h1>
          <div className="flex items-center gap-4 text-lg">
             <Star className="fill-yellow-400 text-yellow-400" />
             <span className="font-bold">{averageRating.toFixed(1)} / 5</span>
             <span className="opacity-80">({reviews.length} avis)</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Description stockée en TEXT */}
          <section>
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-primary pl-4">Histoire et Culture</h2>
            <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">{place.description}</p>
          </section>

          {/* Avis des visiteurs */}
          <section className="bg-slate-50 p-8 rounded-3xl border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Expériences des voyageurs</h2>
              {isAuthenticated ? (
                <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                  {showReviewForm ? "Fermer" : "Laisser un avis"}
                </Button>
              ) : (
                <Button variant="outline" onClick={() => router.push("/auth/login")}>Se connecter pour noter</Button>
              )}
            </div>

            {showReviewForm && (
               <div className="mb-10 animate-in fade-in slide-in-from-top-4">
                  <ReviewForm 
                    placeId={place.id} 
                    placeName={place.name}
                    onSuccess={() => {
                        setShowReviewForm(false);
                        router.refresh();
                    }} 
                  />
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
              {reviews.length === 0 && <p className="col-span-full text-center py-10 text-muted-foreground italic">Soyez le premier à donner votre avis !</p>}
            </div>
          </section>
        </div>

        {/* Sidebar avec Activités */}
        <aside className="space-y-6">
           <Card className="shadow-xl border-none bg-primary text-white">
              <CardContent className="p-6">
                 <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin /> Localisation</h3>
                 <p className="opacity-90">{place.city}, Souss-Massa</p>
                 <p className="text-xs mt-2 opacity-70">GPS: {place.latitude}, {place.longitude}</p>
              </CardContent>
           </Card>

           <Card>
              <CardContent className="p-6">
                 <h3 className="text-xl font-bold mb-4">À faire sur place</h3>
                 <div className="space-y-4">
                    {activities.map(act => (
                       <Link key={act.id} href={`/activities/${act.id}`} className="group block">
                          <div className="p-3 border rounded-xl group-hover:border-primary group-hover:bg-primary/5 transition-all">
                             <p className="font-semibold group-hover:text-primary">{act.title}</p>
                             <p className="text-xs text-muted-foreground">{act.duration} • {act.price} MAD</p>
                          </div>
                       </Link>
                    ))}
                    {activities.length === 0 && <p className="text-sm text-muted-foreground italic text-center">Aucune activité pour le moment.</p>}
                 </div>
              </CardContent>
           </Card>
        </aside>
      </div>
    </div>
  )
}
