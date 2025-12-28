"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlaceCard } from "@/components/place-card"
import { Loader2, Search, Map } from "lucide-react"
import { placesService } from "@/services/places.service"
import type { Place } from "@/lib/types"

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        // On appelle la route publique qui filtre par Status.ACTIVE côté Backend
        const data = await placesService.getAllActivePlaces()
        setPlaces(data)
        setFilteredPlaces(data)
      } catch (error) {
        console.error("Failed to fetch active places:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlaces()
  }, [])

  // Filtrage combiné (Recherche textuelle + Ville)
  useEffect(() => {
    let filtered = places
    if (selectedCity !== "all") {
      filtered = filtered.filter((place) => place.city === selectedCity)
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    setFilteredPlaces(filtered)
  }, [searchQuery, selectedCity, places])

  const cities = Array.from(new Set(places.map((place) => place.city)))

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
          Patrimoine de Taroudant
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto flex items-center justify-center gap-2">
          <Map className="h-5 w-5" /> Découvrez les trésors historiques de la petite Marrakech
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 sticky top-20 z-10 bg-background/80 backdrop-blur-md p-2 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un monument, une porte..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-none shadow-none focus-visible:ring-1"
          />
        </div>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-full md:w-[220px] border-none shadow-none focus:ring-1">
            <SelectValue placeholder="Toutes les zones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tout Taroudant</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grille de résultats */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Chargement des merveilles...</p>
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl">
          <p className="text-xl text-muted-foreground italic">Aucun lieu ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  )
}