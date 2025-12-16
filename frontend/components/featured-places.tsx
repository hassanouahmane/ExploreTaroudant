"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { placesService } from "@/services/places.service"

// Type temporaire si votre lib/types.ts n'est pas correct
interface Place {
    id: number
    name: string
    description?: string
    city?: string
    imageUrl?: string
    createdAt?: string
    // Ajoutez d'autres champs selon votre backend
}

export default function FeaturedPlaces() {
    const [places, setPlaces] = useState<Place[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                setLoading(true)
                // Récupérer tous les lieux depuis votre backend
                const allPlaces = await placesService.getAllPlaces()
                console.log("Places reçues:", allPlaces) // Debug

                // Prendre les 3 premiers (ou filtrer si vous voulez)
                const featuredPlaces = allPlaces.slice(0, 3)

                // S'assurer que chaque lieu a une image
                const placesWithImages = featuredPlaces.map(place => ({
                    ...place,
                    imageUrl: place.imageUrl || getPlaceImage(place.name)
                }))

                setPlaces(placesWithImages)
            } catch (err: any) {
                console.error("Erreur chargement lieux:", err)
                setError(err.message || "Erreur de chargement")
                // Données de secours
                setPlaces(getFallbackPlaces())
            } finally {
                setLoading(false)
            }
        }

        fetchPlaces()
    }, [])

    // Fonction pour obtenir une image selon le nom du lieu
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

        const key = Object.keys(imageMap).find(key =>
            placeName.toLowerCase().includes(key)
        )

        return key ? `${imageMap[key]}?auto=format&fit=crop&w=800&h=400&q=80`
            : 'https://images.unsplash.com/photo-1585506787138-60868c0b5d52?auto=format&fit=crop&w=800&h=400&q=80'
    }

    // Données de secours si l'API échoue - CORRIGÉES
    const getFallbackPlaces = (): Place[] => [
        {
            id: 1,
            name: "Les Remparts de Taroudant",
            description: "Murailles historiques du XVIe siècle entourant la vieille ville",
            city: "Taroudant",
            imageUrl: "https://images.unsplash.com/photo-1585506787138-60868c0b5d52?auto=format&fit=crop&w=800&h=400&q=80"
        },
        {
            id: 2,
            name: "Place Assarag",
            description: "Place principale animée avec son marché traditionnel",
            city: "Taroudant",
            imageUrl: "https://images.unsplash.com/photo-1513611779871-47c8c05e7d3a?auto=format&fit=crop&w=800&h=400&q=80"
        },
        {
            id: 3,
            name: "Palais Claudio Bravo",
            description: "Ancien palais transformé en musée et centre culturel",
            city: "Taroudant",
            imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&h=400&q=80"
        }
    ]

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-t-lg" />
                        <CardHeader>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </CardHeader>
                    </Card>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">Erreur: {error}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {getFallbackPlaces().map((place) => (
                        <Link key={place.id} href={`/places/${place.id}`}>
                            <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 h-full">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={place.imageUrl}
                                        alt={place.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{place.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{place.city}</span>
                                    </CardDescription>
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                        {place.description}
                                    </p>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {places.map((place) => (
                    <Link key={place.id} href={`/places/${place.id}`}>
                        <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 h-full">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={place.imageUrl}
                                    alt={place.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{place.name}</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{place.city || "Taroudant"}</span>
                                </CardDescription>
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {place.description || "Lieu touristique à découvrir"}
                                </p>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
            <div className="text-center mt-8">
                <Link href="/places">
                    <button className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md">
                        Voir tous les lieux
                    </button>
                </Link>
            </div>
        </>
    )
}