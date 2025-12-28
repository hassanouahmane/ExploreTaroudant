"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { eventsService } from "@/services/events.service"
import { authService } from "@/services/auth.service"
import type { Event } from "@/lib/types"
import { MapPin, Calendar, Loader2, Clock ,Info} from "lucide-react"

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventsService.getEventById(Number(resolvedParams.id))
        setEvent(data)
      } catch (error) {
        toast({ title: "Erreur", description: "L'événement est introuvable", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvent()
  }, [resolvedParams.id, toast])

  if (isLoading) return <div className="flex justify-center h-screen items-center"><Loader2 className="animate-spin" /></div>
  if (!event) return null

  // Formatage des dates LocalDate
  const displayStartDate = format(parseISO(event.startDate), "d MMMM yyyy", { locale: fr })
  const displayEndDate = format(parseISO(event.endDate), "d MMMM yyyy", { locale: fr })

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative h-[450px] w-full overflow-hidden bg-slate-900">
        <img
          src={`/api/placeholder/1200/450`} // Remplacez par votre logique d'image
          alt={event.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 container mx-auto">
           <Badge className="mb-4 bg-primary px-3 py-1 uppercase tracking-widest text-xs">Événement</Badge>
           <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">{event.title}</h1>
           <div className="flex gap-6 text-white/90">
              <span className="flex items-center gap-2 font-medium"><Calendar className="h-5 w-5" /> Du {displayStartDate} au {displayEndDate}</span>
              <span className="flex items-center gap-2 font-medium"><MapPin className="h-5 w-5" /> {event.location}</span>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2 shadow-xl border-none">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                   <Info className="text-primary h-6 w-6" /> Présentation
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">{event.description}</p>
              </CardContent>
           </Card>

           <div className="space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                   <h4 className="font-bold mb-4">Informations Pratiques</h4>
                   <Separator className="mb-4" />
                   <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                         <span className="text-muted-foreground">Lieu</span>
                         <span className="font-semibold">{event.location}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-muted-foreground">Organisateur</span>
                         <span className="font-semibold">Explore Taroudant</span>
                      </div>
                   </div>
                   <Button className="w-full mt-6 shadow-lg shadow-primary/20">S'inscrire à l'événement</Button>
                </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </div>
  )
}