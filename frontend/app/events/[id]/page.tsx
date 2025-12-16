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
import { MapPin, Calendar, Loader2, Clock } from "lucide-react"

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated())
  }, [])

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventId = Number.parseInt(resolvedParams.id)
        const data = await eventsService.getEventById(eventId)
        setEvent(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'événement",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [resolvedParams.id, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg text-muted-foreground">Événement non trouvé</p>
      </div>
    )
  }

  const startDate = parseISO(event.startDate)
  const endDate = parseISO(event.endDate)
  const isUpcoming = startDate > new Date()
  const isPast = endDate < new Date()
  const isOngoing = !isUpcoming && !isPast

  return (
    <div className="pb-20">
      {/* Hero Image */}
      <div className="relative h-[400px] w-full">
        <img
          src={`/.jpg?height=400&width=1200&query=${event.title}+Morocco+festival+event`}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
              <p className="flex items-center gap-2 text-white/90 text-lg">
                <MapPin className="h-5 w-5" />
                {event.location}
              </p>
            </div>
            {isUpcoming && <Badge className="bg-accent text-accent-foreground text-lg px-4 py-2">À venir</Badge>}
            {isOngoing && <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">En cours</Badge>}
            {isPast && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Terminé
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">À propos de l&apos;événement</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-bold text-lg">Informations</h3>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Date de début</p>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{format(startDate, "EEEE d MMMM yyyy", { locale: fr })}</p>
                      <p className="text-sm text-muted-foreground">{format(startDate, "HH:mm")}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Date de fin</p>
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{format(endDate, "EEEE d MMMM yyyy", { locale: fr })}</p>
                      <p className="text-sm text-muted-foreground">{format(endDate, "HH:mm")}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Lieu</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isUpcoming && (
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-bold text-lg">Inscription</h3>
                  <Separator />
                  {isAuthenticated ? (
                    <Button className="w-full" size="lg">
                      S&apos;inscrire à l&apos;événement
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" onClick={() => router.push("/auth/login")}>
                      Connectez-vous pour vous inscrire
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
