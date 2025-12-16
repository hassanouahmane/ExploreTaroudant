"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCard } from "@/components/event-card"
import { Loader2 } from "lucide-react"
import { eventsService } from "@/services/events.service"
import type { Event } from "@/lib/types"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsService.getAllEvents()
        setEvents(data)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const now = new Date()
  const upcomingEvents = events.filter((event) => new Date(event.startDate) > now)
  const pastEvents = events.filter((event) => new Date(event.endDate) <= now)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Événements
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez les festivals et événements culturels de Taroudant
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">
            À venir
            {upcomingEvents.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                {upcomingEvents.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">
            Passés
            {pastEvents.length > 0 && (
              <span className="ml-2 bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                {pastEvents.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">Aucun événement à venir pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : pastEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">Aucun événement passé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
