"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { MapPin, Loader2 } from "lucide-react"
import { placesService } from "@/services/places.service"
import { Place } from "@/lib/types"

/** * HELPER FUNCTIONS
 * Defined outside the component to avoid initialization errors 
 * and unnecessary re-renders.
 */

const getPlaceImage = (placeName: string): string => {
    const imageMap: Record<string, string> = {
        'remparts': 'https://images.unsplash.com/photo-1585506787138-60868c0b5d52',
        'assarag': 'https://images.unsplash.com/photo-1513611779871-47c8c05e7d3a',
        'palais': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
        'médina': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
        'souk': 'https://images.unsplash.com/photo-1548013146-72479768bada',
        'jardin': 'https://images.unsplash.com/photo-1569336415962-a1bd76165604',
        'taroudant': 'https://images.unsplash.com/photo-1585506787138-60868c0b5d52'
    }

    const key = Object.keys(imageMap).find(k => placeName.toLowerCase().includes(k))
    const baseUrl = key ? imageMap[key] : 'https://images.unsplash.com/photo-1585506787138-60868c0b5d52'
    
    return `${baseUrl}?auto=format&fit=crop&w=800&h=450&q=80`
}

const getFallbackPlaces = (): Place[] => [
    {
        id: 1,
        name: "Les Remparts de Taroudant",
        description: "Murailles historiques du XVIe siècle entourant la vieille ville, l'une des mieux préservées du Maroc.",
        city: "Taroudant",
        imageUrl: getPlaceImage("remparts"),
        latitude: 0, longitude: 0, status: "ACTIVE", createdAt: ""
    },
    {
        id: 2,
        name: "Place Assarag",
        description: "Le cœur battant de la ville où se rencontrent locaux et voyageurs sous les arcades.",
        city: "Taroudant",
        imageUrl: getPlaceImage("assarag"),
        latitude: 0, longitude: 0, status: "ACTIVE", createdAt: ""
    },
    {
        id: 3,
        name: "La Grande Médina",
        description: "Explorez les ruelles labyrinthiques et découvrez l'artisanat ancestral des tanneurs.",
        city: "Taroudant",
        imageUrl: getPlaceImage("médina"),
        latitude: 0, longitude: 0, status: "ACTIVE", createdAt: ""
    }
]

export default function FeaturedPlaces() {
    const [places, setPlaces] = useState<Place[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                setLoading(true)
                const allPlaces = await placesService.getAllActivePlaces()
                
                // Take first 3 and ensure images exist
                const featured = (allPlaces || []).slice(0, 3).map(place => ({
                    ...place,
                    imageUrl: place.imageUrl || getPlaceImage(place.name)
                }))

                if (featured.length === 0) {
                    setPlaces(getFallbackPlaces())
                } else {
                    setPlaces(featured)
                }
            } catch (err: any) {
                console.error("Fetch error:", err)
                setError("Utilisation des données locales")
                setPlaces(getFallbackPlaces())
            } finally {
                setLoading(false)
            }
        }

        fetchPlaces()
    }, [])

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse overflow-hidden">
                        <div className="h-48 bg-slate-200" />
                        <CardHeader className="space-y-2">
                            <div className="h-6 bg-slate-200 rounded w-3/4" />
                            <div className="h-4 bg-slate-200 rounded w-1/2" />
                        </CardHeader>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {error && (
                <p className="text-center text-xs text-muted-foreground opacity-50">
                    Note: Affichage du mode hors-ligne
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {places.map((place) => (
                    <Link key={place.id} href={`/places/${place.id}`}>
                        <Card className="overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 h-full border-slate-100">
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={place.imageUrl}
                                    alt={place.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-1 group-hover:text-amber-600 transition-colors">
                                    {place.name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-amber-500" />
                                    <span>{place.city || "Taroudant"}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {place.description || "Découvrez ce lieu magnifique chargé d'histoire au cœur de Taroudant."}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="text-center pt-4">
                <Link href="/places">
                    <button className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold tracking-wide uppercase transition-all bg-slate-900 text-white hover:bg-amber-600 rounded-full shadow-lg hover:shadow-amber-200">
                        Explorer tout le patrimoine
                    </button>
                </Link>
            </div>
        </div>
    )
}