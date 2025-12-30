"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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
import { MapPin, Clock, Loader2, Star, Activity as ActivityIcon, ArrowLeft, History, Info, Landmark } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

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
        if (isNaN(placeId)) return;

        const [placeData, activitiesData, reviewsData, rating] = await Promise.all([
          placesService.getPlaceById(placeId),
          activitiesService.getActivitiesByPlace(placeId),
          reviewsService.getReviewsByPlace(placeId),
          reviewsService.getAverageRating(placeId),
        ])

        setPlace(placeData)
        setActivities(activitiesData)
        setReviews(reviewsData)
        
        // Sécurisation du rating (force number)
        const numericRating = typeof rating === 'number' ? rating : parseFloat(rating as any) || 0
        setAverageRating(numericRating)

      } catch (error) {
        console.error("Fetch error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    // On ne met QUE l'ID ici pour éviter l'erreur de "changed size" liée à l'objet toast
  }, [resolvedParams.id]); 

  if (isLoading) return (
    <div className="flex flex-col h-screen items-center justify-center gap-4 bg-slate-50">
      <Loader2 className="animate-spin h-12 w-12 text-emerald-600" />
      <p className="text-slate-500 animate-pulse font-medium text-xs uppercase tracking-widest text-center">
        Immersion dans l'histoire de Taroudant...
      </p>
    </div>
  )
  
  if (!place) return null

  const formattedRating = (Number(averageRating) || 0).toFixed(1)

  return (
    <div className="pb-24 bg-white">
      {/* Bouton Retour Flottant */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="fixed top-28 left-8 z-30">
         <Button variant="outline" size="icon" className="rounded-full bg-white/90 backdrop-blur shadow-xl border-none hover:scale-110 transition-transform" onClick={() => router.back()}>
            <ArrowLeft className="text-slate-900" />
         </Button>
      </motion.div>

      {/* Hero Header */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={place.imageUrl || "/images/taroudant-hero.jpg"}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Badge className="mb-6 bg-emerald-500 text-white border-none px-6 py-2 text-sm font-bold rounded-full shadow-lg">
                {place.city}
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
                {place.name}
              </h1>
              <div className="flex items-center gap-6 text-white bg-white/10 backdrop-blur-md w-fit p-4 rounded-3xl border border-white/20 shadow-2xl">
                 <div className="flex items-center gap-2">
                    <Star className="fill-amber-400 text-amber-400 h-6 w-6" />
                    <span className="text-2xl font-black">{formattedRating}</span>
                 </div>
                 <Separator orientation="vertical" className="h-8 bg-white/30" />
                 <span className="font-medium opacity-90">{reviews.length} témoignages</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16">
          <section>
            <div className="flex items-center gap-3 mb-8 text-emerald-700">
               <History size={32} />
               <h2 className="text-4xl font-black tracking-tight text-slate-900 italic">L'épopée de Taroudant</h2>
            </div>
            <p className="text-xl text-slate-600 leading-relaxed font-medium whitespace-pre-line bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner italic">
                "{place.description}"
            </p>
          </section>

          {/* Avis des visiteurs */}
          <section className="bg-slate-950 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-5">
               <Landmark size={300} />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-3xl font-black mb-2 tracking-tight">Expériences Voyageurs</h2>
                  <p className="text-slate-400 font-medium text-sm uppercase tracking-widest">Partagez votre histoire</p>
                </div>
                {isAuthenticated ? (
                  <Button 
                    onClick={() => setShowReviewForm(!showReviewForm)} 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8 h-14 font-bold transition-all active:scale-95"
                  >
                    {showReviewForm ? "Fermer" : "Rédiger un avis"}
                  </Button>
                ) : (
                  <Button variant="outline" className="border-white/20 text-white rounded-full h-14 px-8" onClick={() => router.push("/auth/login")}>
                    Connectez-vous pour noter
                  </Button>
                )}
              </div>

              <AnimatePresence>
                {showReviewForm && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-12 bg-white rounded-[2.5rem] p-8 text-slate-900 shadow-2xl overflow-hidden">
                    {/* CORRECTION : On s'assure de passer place.id (nombre) et non resolvedParams (objet) */}
                  <ReviewForm 
  placeId={Number(place.id)} // FORCEZ LE PASSAGE DE L'ID NUMÉRIQUE ICI
  placeName={place.name} 
  onSuccess={() => {
    setShowReviewForm(false);
    router.refresh(); // Rafraîchit les données sans recharger toute la page
  }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
                {reviews.length === 0 && (
                  <p className="col-span-full text-center py-20 text-slate-500 italic text-lg border-2 border-dashed border-slate-800 rounded-[3rem]">
                    Soyez le premier à explorer et noter ce lieu !
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <Card className="shadow-2xl border-none bg-gradient-to-br from-emerald-900 to-slate-950 text-white rounded-[3rem] overflow-hidden">
            <CardContent className="p-10">
              <div className="h-16 w-16 bg-emerald-400/20 rounded-[1.5rem] flex items-center justify-center mb-8">
                <MapPin className="text-emerald-400 h-8 w-8 animate-bounce" />
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight text-white">Coordonnées</h3>
              <p className="text-slate-400 font-medium mb-8 leading-relaxed">Province de {place.city}, Souss-Massa.</p>
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4">
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">Données Satellite</p>
                <div className="font-mono text-sm space-y-2 opacity-80">
                  <p>LAT: {place.latitude}</p>
                  <p>LNG: {place.longitude}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] shadow-xl border-slate-100 bg-white sticky top-28">
            <CardContent className="p-8">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900 tracking-tight">
                <ActivityIcon className="text-emerald-600" size={24} /> À vivre ici
              </h3>
              <div className="space-y-6">
                {activities.length > 0 ? (
                  activities.map(act => (
                    <Link key={act.id} href={`/activities/${act.id}`} className="group block">
                      <div className="p-6 border border-slate-100 rounded-[2rem] group-hover:border-emerald-500 group-hover:bg-emerald-50/30 transition-all duration-500">
                        <p className="font-black text-slate-800 group-hover:text-emerald-900 text-lg leading-tight mb-3">{act.title}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary" className="px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                            <Clock size={12} className="mr-1" /> {act.duration}
                          </Badge>
                          <span className="text-xl font-black text-emerald-600">{act.price} MAD</span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-slate-400 italic text-sm text-center py-6">Aucune activité prévue.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}