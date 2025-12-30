"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ActivityCard } from "@/components/activity-card"
import { Loader2, Search, Compass } from "lucide-react"
import { activitiesService } from "@/services/activities.service"
import type { Activity } from "@/lib/types"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000])
  const [maxPrice, setMaxPrice] = useState(1000)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activitiesService.getAllActiveActivities()
        setActivities(data || [])
        setFilteredActivities(data || [])

        if (data && data.length > 0) {
          const max = Math.max(...data.map((a) => a.price))
          setMaxPrice(max)
          setPriceRange([0, max])
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchActivities()
  }, [])

  useEffect(() => {
    let filtered = activities || []

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.place?.name?.toLowerCase().includes(query) || false
      )
    }

    filtered = filtered.filter((activity) => activity.price >= priceRange[0] && activity.price <= priceRange[1])

    setFilteredActivities(filtered)
  }, [searchQuery, priceRange, activities])

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
        {/* Header Textuel Simple (Au lieu de l'image Hero) */}
        <div className="bg-slate-950 pt-32 pb-16 text-center relative overflow-hidden">
            {/* Motif de fond subtil (optionnel, peut être retiré pour un fond uni) */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Badge className="mb-4 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-none px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                      <Compass className="h-3 w-3 mr-2 inline" /> Expériences Locales
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Activités & Ateliers
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
                        Découvrez Taroudant autrement à travers des expériences authentiques proposées par nos guides.
                    </p>
                </motion.div>
            </div>
        </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 space-y-6 bg-white p-6 rounded-3xl shadow-md h-fit sticky top-24 border border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Search className="h-5 w-5 text-amber-500" /> Filtrer
            </h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="search" className="mb-2 block font-medium text-slate-700 text-sm">Recherche textuelle</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="search"
                    placeholder="Titre, lieu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                    <Label className="font-medium text-slate-700 text-sm">Budget Maximum</Label>
                    <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">{priceRange[1]} MAD</span>
                </div>
                <div className="pt-2 px-2">
                  <Slider 
                    value={[priceRange[1]]} // On n'utilise qu'un seul curseur pour le max
                    onValueChange={(val) => setPriceRange([0, val[0]])}
                    max={maxPrice || 1000} 
                    step={50} 
                    className="my-4" 
                  />
                   <div className="flex justify-between text-xs font-medium text-slate-400">
                    <span>0 MAD</span>
                    <span>{maxPrice || 1000} MAD</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-500 text-center bg-slate-50 py-2 rounded-lg">
                  {filteredActivities.length} résultat{filteredActivities.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </aside>

          {/* Activities Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                <p className="text-slate-500 font-medium">Chargement des activités...</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4">
                <div className="bg-slate-50 p-4 rounded-full">
                    <Compass className="h-10 w-10 text-slate-300" />
                </div>
                <p className="text-lg text-slate-500 font-medium max-w-md mx-auto">Aucune activité ne correspond à vos critères de recherche pour le moment.</p>
                <button onClick={() => {setSearchQuery(""); setPriceRange([0, maxPrice])}} className="text-amber-600 font-bold text-sm hover:underline">Réinitialiser les filtres</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}