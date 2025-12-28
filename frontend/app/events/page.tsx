"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCard } from "@/components/event-card"
import { Loader2, Sparkles } from "lucide-react"
import { eventsService } from "@/services/events.service"
import type { Event } from "@/lib/types"
import { Badge } from "@/components/ui/badge" // Ajout du composant UI manquant
export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // On récupère uniquement les événements validés (Status: ACTIVE)
        const data = await eventsService.getAllActiveEvents()
        setEvents(data)
      } catch (error) {
        console.error("Erreur chargement événements:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const now = new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
  const upcomingEvents = events.filter((event) => event.startDate >= now)
  const pastEvents = events.filter((event) => event.endDate < now)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <div className="flex justify-center mb-4">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-primary/20 gap-2 px-4 py-1">
            <Sparkles className="h-4 w-4" /> Agenda Culturel
          </Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
          Événements à Taroudant
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ne manquez rien des festivités, moussems et rencontres de la ville.
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 h-12 shadow-sm border">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            À venir ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past">Passés ({pastEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed">
              <p className="text-muted-foreground italic">Aucun événement prévu prochainement.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-75 grayscale-[0.5]">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}