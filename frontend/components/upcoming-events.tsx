"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { eventsService } from "@/services/events.service"
import type { Event } from "@/lib/types"

export default function UpcomingEvents() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await eventsService.getUpcomingEvents()
                setEvents(data.slice(0, 3))
            } catch (error) {
                console.error("Erreur chargement événements:", error)
                // Données de secours
                setEvents([
                    {
                        id: 1,
                        title: "Festival des Roses",
                        description: "Célébration annuelle des roses de la vallée",
                        startDate: "2024-05-10T10:00:00",
                        endDate: "2024-05-12T22:00:00",
                        location: "Jardin Public de Taroudant",
                        price: 0,
                        maxParticipants: 500
                    },
                    {
                        id: 2,
                        title: "Marché Artisanal Nocturne",
                        description: "Marché traditionnel avec artisans locaux",
                        startDate: "2024-06-15T18:00:00",
                        endDate: "2024-06-15T23:00:00",
                        location: "Place Assarag",
                        price: 0,
                        maxParticipants: 300
                    },
                    {
                        id: 3,
                        title: "Visite Guidée Historique",
                        description: "Découverte des secrets des remparts",
                        startDate: "2024-06-20T09:00:00",
                        endDate: "2024-06-20T12:00:00",
                        location: "Porte Bab Taroudant",
                        price: 150,
                        maxParticipants: 25
                    }
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-5/6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        })
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>
                        {event.maxParticipants && (
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{event.maxParticipants} places max</span>
                            </div>
                        )}
                        <div className="pt-2">
                            <Link href={`/events/${event.id}`}>
                                <Button size="sm" className="w-full" variant="outline">
                                    Plus d'infos
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}