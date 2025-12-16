"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlaceCard } from "@/components/place-card"
import { Loader2, Search } from "lucide-react"
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
        const data = await placesService.getAllPlaces()
        setPlaces(data)
        setFilteredPlaces(data)
      } catch (error) {
        console.error("Failed to fetch places:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlaces()
  }, [])

  useEffect(() => {
    let filtered = places

    if (selectedCity !== "all") {
      filtered = filtered.filter((place) => place.city === selectedCity)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredPlaces(filtered)
  }, [searchQuery, selectedCity, places])

  const cities = Array.from(new Set(places.map((place) => place.city)))

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Lieux Touristiques
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explorez les sites historiques et culturels de Taroudant
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un lieu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Ville" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">Aucun lieu trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  )
}
