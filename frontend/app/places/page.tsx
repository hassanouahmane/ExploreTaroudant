"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlaceCard } from "@/components/place-card"
import { Loader2, Search, Map, Landmark, Navigation, Badge } from "lucide-react"
import { placesService } from "@/services/places.service"
import type { Place } from "@/lib/types"
import { Separator } from "@/components/ui/separator"

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
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
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4 py-1">
              Exploration Historique
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-900 to-emerald-800 bg-clip-text text-transparent tracking-tighter">
              Patrimoine de Taroudant
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto flex items-center justify-center gap-2 font-medium">
              <Landmark className="h-5 w-5 text-emerald-600" /> 
              Découvrez les trésors architecturaux et l'âme de la petite Marrakech
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Barre de recherche et filtres - Sticky glassmorphism */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 sticky top-24 z-20 bg-white/80 backdrop-blur-xl p-4 rounded-[2rem] border shadow-xl shadow-slate-200/50">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Rechercher un monument, une porte historique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 border-none bg-transparent text-lg focus-visible:ring-0"
            />
          </div>
          <Separator orientation="vertical" className="hidden md:block h-8 self-center bg-slate-200" />
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full md:w-[240px] h-12 border-none bg-transparent font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <Navigation size={18} className="text-emerald-600" />
                <SelectValue placeholder="Toutes les zones" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100">
              <SelectItem value="all">Tout Taroudant</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grille de résultats avec animation */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
            <p className="text-slate-500 font-bold animate-pulse tracking-widest uppercase text-xs">Immersion en cours...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredPlaces.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                <Map className="h-16 w-16 mx-auto text-slate-200 mb-4" />
                <p className="text-xl text-slate-400 font-medium italic">Aucun trésor ne correspond à votre recherche.</p>
              </motion.div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}