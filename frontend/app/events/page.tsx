"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCard } from "@/components/event-card"
// CORRECTION : Changement de "lucide-material" vers "lucide-react"
import { Loader2, Sparkles, Calendar as CalendarIcon, History } from "lucide-react" 
import { eventsService } from "@/services/events.service"
import type { Event } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsService.getAllActiveEvents()
        setEvents(data || [])
      } catch (error) {
        console.error("Erreur chargement événements:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  // Filtrage des événements
  const upcomingEvents = events.filter((event) => new Date(event.endDate) >= now)
  const pastEvents = events.filter((event) => new Date(event.endDate) < now)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-slate-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <CalendarIcon className="absolute -left-10 -top-10 h-64 w-64 rotate-12 text-white" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-6 bg-pink-500 hover:bg-pink-600 text-white border-none px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3 w-3 mr-2 inline" /> Agenda Culturel
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
              Agenda <span className="text-pink-500">Taroudant</span>
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex flex-col items-center mb-16">
            <TabsList className="bg-slate-100 p-1 rounded-2xl h-14 border shadow-inner w-full max-w-md">
              <TabsTrigger 
                value="upcoming" 
                className="rounded-xl px-10 h-full font-bold data-[state=active]:bg-white data-[state=active]:text-pink-600 flex-1"
              >
                À venir ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="rounded-xl px-10 h-full font-bold data-[state=active]:bg-white data-[state=active]:text-slate-600 flex-1"
              >
                <History className="h-4 w-4 mr-2" /> Archives
              </TabsTrigger>
            </TabsList>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin text-pink-500 h-12 w-12" />
              <p className="text-slate-400 font-bold uppercase text-xs">Chargement...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <TabsContent value="upcoming" key="upcoming-content-area">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed">
                    <p className="text-xl text-slate-400 italic">Aucun événement prévu.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.map((event, index) => (
                      <motion.div 
                        key={`up-${event.id || 'no-id'}-${index}`} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <EventCard event={event} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" key="past-content-area">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-70 grayscale-[0.5]">
                  {pastEvents.map((event, index) => (
                    <motion.div 
                      key={`past-${event.id || 'no-id'}-${index}`} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </AnimatePresence>
          )}
        </Tabs>
      </div>
    </div>
  )
}