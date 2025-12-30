"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { eventsService } from "@/services/events.service"
import type { Event } from "@/lib/types"
import { MapPin, Calendar, Loader2, Clock, Info, ArrowLeft, Share2, Bookmark } from "lucide-react"
import { motion } from "framer-motion"

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventsService.getEventById(Number(resolvedParams.id))
        setEvent(data)
      } catch (error) {
        toast({ title: "Erreur", description: "L'événement est introuvable", variant: "destructive" })
        router.push("/events")
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvent()
  }, [resolvedParams.id, toast, router])

  if (isLoading) return <div className="flex flex-col justify-center h-screen items-center gap-4">
    <Loader2 className="animate-spin text-pink-600 h-12 w-12" />
    <p className="font-bold text-slate-400 uppercase text-xs tracking-widest">Immersion...</p>
  </div>
  
  if (!event) return null

  // Formatage des dates pour le français
  const displayStartDate = format(parseISO(event.startDate), "EEEE d MMMM yyyy", { locale: fr })
  const displayEndDate = format(parseISO(event.endDate), "EEEE d MMMM yyyy", { locale: fr })

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Section Immersive */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-slate-950">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={`/api/placeholder/1200/800`} 
          alt={event.title}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />
        
        <div className="absolute bottom-20 left-0 right-0">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Badge className="mb-6 bg-pink-500 hover:bg-pink-600 text-white border-none px-6 py-1.5 rounded-full font-bold shadow-xl">
                ÉVÉNEMENT CULTUREL
              </Badge>
              <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3 text-white bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-lg">
                  <Calendar className="text-pink-400 h-6 w-6" />
                  <div className="text-sm font-bold uppercase tracking-tighter leading-none">
                    <p className="text-pink-300 mb-1">Période</p>
                    <p>Du {format(parseISO(event.startDate), "d MMM")} au {format(parseISO(event.endDate), "d MMM yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-lg">
                  <MapPin className="text-pink-400 h-6 w-6" />
                  <div className="text-sm font-bold uppercase tracking-tighter leading-none">
                    <p className="text-pink-300 mb-1">Localisation</p>
                    <p>{event.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Section Présentation */}
          <div className="lg:col-span-2 space-y-10">
            <Card className="shadow-2xl border-none rounded-[3rem] overflow-hidden bg-white">
              <CardContent className="p-10 md:p-16">
                <div className="flex items-center gap-4 mb-10">
                   <div className="h-12 w-1 bg-pink-500 rounded-full" />
                   <h3 className="text-3xl font-black text-slate-900 tracking-tight">Programme & Détails</h3>
                </div>
                <div className="prose prose-pink prose-xl max-w-none text-slate-600 leading-relaxed italic">
                  {event.description}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between px-8 py-6 bg-white rounded-[2rem] border shadow-sm">
               <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Partagez cet événement</span>
               <div className="flex gap-2">
                 <Button variant="outline" size="icon" className="rounded-full hover:bg-pink-50 hover:text-pink-600 transition-colors"><Share2 size={18} /></Button>
                 <Button variant="outline" size="icon" className="rounded-full hover:bg-pink-50 hover:text-pink-600 transition-colors"><Bookmark size={18} /></Button>
               </div>
            </div>
          </div>

          {/* Sidebar Informations Pratiques */}
          <div className="space-y-8">
            <Card className="border-none shadow-xl rounded-[3rem] bg-gradient-to-br from-pink-600 to-rose-700 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Clock size={120} />
              </div>
              <CardHeader className="p-10 pb-0">
                <CardTitle className="text-2xl font-black uppercase tracking-tighter">Infos Pratiques</CardTitle>
              </CardHeader>
              <CardContent className="p-10 pt-6 space-y-8 relative z-10">
                <Separator className="bg-white/20" />
                <div className="space-y-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-200">Date de début</span>
                    <span className="text-lg font-bold">{displayStartDate}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-200">Date de fin</span>
                    <span className="text-lg font-bold">{displayEndDate}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-200">Organisateur</span>
                    <span className="text-lg font-bold underline decoration-2 decoration-pink-300 underline-offset-4">Ville de Taroudant</span>
                  </div>
                </div>
                
                <Button className="w-full bg-white text-pink-700 hover:bg-slate-100 rounded-2xl h-16 text-lg font-black shadow-2xl transition-transform active:scale-95">
                  S'inscrire à l'événement
                </Button>
                <p className="text-[10px] text-center text-pink-100 font-medium opacity-70">
                  Inscription gratuite • Places limitées selon le lieu
                </p>
              </CardContent>
            </Card>

            <Button variant="ghost" className="w-full text-slate-400 font-bold hover:bg-slate-100" onClick={() => router.back()}>
              <ArrowLeft size={16} className="mr-2" /> Retour à l'agenda
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}