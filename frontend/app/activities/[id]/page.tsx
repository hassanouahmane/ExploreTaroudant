"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReservationForm } from "@/components/reservation-form"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { activitiesService } from "@/services/activities.service"
import { authService } from "@/services/auth.service"
import type { Activity } from "@/lib/types"
import { MapPin, Clock, Loader2, User, ArrowLeft, Compass, Share2, Bookmark, Tag, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function ActivityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [activity, setActivity] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated())
  }, [])

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activityId = Number.parseInt(resolvedParams.id)
        if (isNaN(activityId)) throw new Error("ID invalide")
        const data = await activitiesService.getActivityById(activityId)
        setActivity(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'activité",
          variant: "destructive",
        })
        router.push("/activities")
      } finally {
        setIsLoading(false)
      }
    }
    fetchActivity()
  }, [resolvedParams.id])

  const handleReservationSuccess = () => {
    router.push("/dashboard/tourist/reservations")
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest animate-pulse">Chargement...</p>
      </div>
    )
  }

  if (!activity) return null

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Textuel (Sans Image) */}
      <div className="bg-slate-950 pt-28 pb-16 relative overflow-hidden">
        {/* Bouton Retour */}
        <div className="container mx-auto px-4 relative z-30 mb-8">
            <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-300 hover:text-white hover:bg-white/10 transition-colors pl-0"
            onClick={() => router.back()}
            >
            <ArrowLeft size={16} className="mr-2" /> Retour aux activités
            </Button>
        </div>

        <div className="container mx-auto px-4 z-20 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge className="bg-amber-500/20 text-amber-300 border-none px-4 py-1.5 rounded-full font-bold shadow-sm uppercase tracking-wider w-fit flex items-center gap-2">
                    <Compass className="h-4 w-4" /> Activité
                </Badge>
                {activity.status === 'ACTIVE' && (
                     <Badge className="bg-emerald-500/20 text-emerald-300 border-none px-4 py-1.5 rounded-full font-bold shadow-sm uppercase tracking-wider w-fit flex items-center gap-2">
                     Disponible
                 </Badge>
                )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter max-w-4xl leading-tight">{activity.title}</h1>
            
            <div className="flex flex-wrap gap-6 items-center bg-white/5 p-4 rounded-2xl border border-white/10 w-fit backdrop-blur-sm">
               <div className="flex items-center gap-3">
                 <div className="bg-amber-500/20 p-2 rounded-full"><Clock className="text-amber-400 h-5 w-5" /></div>
                 <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Durée</p>
                    <p className="text-white font-bold">{activity.duration}</p>
                 </div>
               </div>
               <Separator orientation="vertical" className="h-10 bg-white/10" />
               <div className="flex items-center gap-3">
                <div className="bg-amber-500/20 p-2 rounded-full"><Tag className="text-amber-400 h-5 w-5" /></div>
                 <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Tarif</p>
                    <p className="text-2xl font-black text-amber-400">{activity.price} <span className="text-sm font-bold">MAD</span></p>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="shadow-md border-none rounded-[2rem] overflow-hidden bg-white">
              <CardContent className="p-8 md:p-10">
                 <div className="flex items-center gap-4 mb-6">
                   <div className="h-8 w-1.5 bg-amber-500 rounded-full" />
                   <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Détails de l'expérience</h2>
                 </div>
                <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line font-medium">{activity.description}</p>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between px-8 py-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
               <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Partager</span>
               <div className="flex gap-3">
                 <Button variant="ghost" size="icon" className="rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"><Share2 size={20} /></Button>
                 <Button variant="ghost" size="icon" className="rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"><Bookmark size={20} /></Button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Place Info */}
                {activity.place && (
                <Link href={`/places/${activity.place.id}`} className="block h-full">
                    <Card className="shadow-md hover:shadow-xl border-none rounded-[2rem] overflow-hidden bg-white h-full transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-amber-500">
                        <CardHeader className="p-6 pb-3">
                            <CardTitle className="text-lg font-black flex items-center gap-3 group-hover:text-amber-600 transition-colors">
                                <div className="bg-slate-100 p-2 rounded-full group-hover:bg-amber-100 transition-colors"><MapPin className="h-5 w-5 text-slate-500 group-hover:text-amber-500" /></div>
                                Lieu du rendez-vous
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 pl-[4.5rem]">
                            <h3 className="font-bold text-xl mb-1">{activity.place.name}</h3>
                            <p className="text-slate-500 font-medium flex items-center gap-1 text-sm"><MapPin size={14}/> {activity.place.city}</p>
                        </CardContent>
                    </Card>
                </Link>
                )}

                {/* Guide Info */}
                {activity.guide?.user && (
                <Card className="shadow-md border-none rounded-[2rem] overflow-hidden bg-white h-full">
                    <CardHeader className="p-6 pb-3">
                        <CardTitle className="text-lg font-black flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-full"><User className="h-5 w-5 text-slate-500" /></div> 
                        Votre Guide
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 pl-[4.5rem] flex items-center gap-4">
                        <div>
                            <p className="font-bold text-xl">{activity.guide.user.fullName}</p>
                            <Badge variant="outline" className="mt-1 border-amber-200 text-amber-600 bg-amber-50 font-bold">Guide Certifié</Badge>
                        </div>
                    </CardContent>
                </Card>
                )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6 sticky top-24 h-fit">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative">
              <CardHeader className="p-8 pb-4 relative z-10">
                <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <Tag className="text-amber-500" /> Réserver
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6 relative z-10">
                <div className="bg-white/5 p-4 rounded-2xl space-y-3 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium text-sm">Prix total</span>
                    <span className="font-black text-2xl text-amber-400">{activity.price} MAD</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium text-sm">Durée</span>
                    <span className="font-bold flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-amber-500" /> {activity.duration}</span>
                  </div>
                </div>
                
                 {isAuthenticated ? (
                  <ReservationForm
                    activityId={activity.id}
                    activityTitle={activity.title}
                    activityPrice={activity.price}
                    onSuccess={handleReservationSuccess}
                  />
                ) : (
                  <div className="space-y-4 pt-2">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-12 text-base font-bold shadow-lg transition-all active:scale-95" onClick={() => router.push("/auth/login")}>
                        Se connecter pour réserver
                      </Button>
                      <p className="text-xs text-center text-slate-400 font-medium leading-tight px-4">Créez un compte gratuitement en quelques secondes pour accéder à la réservation.</p>
                  </div>
                )}
              </CardContent>
            </Card>
             <p className="text-center text-xs text-slate-500 font-medium px-8 leading-relaxed">
                <ShieldCheck className="inline h-4 w-4 mr-1 text-emerald-500" />
                Réservation sécurisée. Annulation gratuite jusqu'à 24h avant.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}