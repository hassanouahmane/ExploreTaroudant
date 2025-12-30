"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { placesService } from "@/services/places.service"
import { reviewsService } from "@/services/reviews.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft, MapPin, Clock, CheckCircle2, Star, 
  Loader2, Info, MessageSquare, Globe 
} from "lucide-react"
import type { Place, Review } from "@/lib/types"

export default function GuidePlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [place, setPlace] = useState<Place | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadPlaceDetails = async () => {
      try {
        setLoading(true)
        const [placeData, reviewsData] = await Promise.all([
          placesService.getPlaceById(Number(resolvedParams.id)),
          reviewsService.getReviewsByPlace(Number(resolvedParams.id))
        ])
        setPlace(placeData)
        setReviews(reviewsData)
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de charger les détails", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    loadPlaceDetails()
  }, [resolvedParams.id, toast])

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
  if (!place) return <div className="p-10 text-center">Lieu introuvable</div>

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <button onClick={() => window.history.back()} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </button>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Section Image & Titre */}
          <Card className="shadow-md overflow-hidden border-t-4 border-t-emerald-500">
            {place.imageUrl && (
              <div className="h-64 w-full overflow-hidden">
                <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold">{place.name}</CardTitle>
                  <p className="text-emerald-600 flex items-center gap-1 mt-1">
                    <MapPin size={16} /> {place.city}
                  </p>
                </div>
                <Badge className={place.status === "ACTIVE" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}>
                  {place.status === "ACTIVE" ? "Validé" : "En attente"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold flex items-center gap-2 mb-2"><Info size={18} /> Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{place.description}</p>
              </div>

              {/* Coordonnées Géographiques */}
              <div className="flex gap-4 p-4 border rounded-lg bg-blue-50/30">
                <Globe className="text-blue-500" />
                <div>
                  <h4 className="text-sm font-bold">Coordonnées GPS</h4>
                  <p className="text-xs text-muted-foreground">Lat: {place.latitude} | Long: {place.longitude}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Avis */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="text-blue-500" /> Avis ({reviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground italic">Aucun avis publié.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-blue-600">{review.user?.fullName}</span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          <Card className="bg-emerald-50/50 border-emerald-100">
            <CardHeader><CardTitle className="text-lg">Résumé</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Status :</span>
                <span className="font-bold">{place.status}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Créé le :</span>
                <span className="font-bold">{new Date(place.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}