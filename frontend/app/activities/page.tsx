"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ActivityCard } from "@/components/activity-card"
import { Loader2, Search } from "lucide-react"
import { activitiesService } from "@/services/activities.service"
import type { Activity } from "@/lib/types"

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
        const data = await activitiesService.getAllActivities()
        setActivities(data)
        setFilteredActivities(data)

        // Calculate max price
        if (data.length > 0) {
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
    let filtered = activities

    if (searchQuery) {
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.place?.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    filtered = filtered.filter((activity) => activity.price >= priceRange[0] && activity.price <= priceRange[1])

    setFilteredActivities(filtered)
  }, [searchQuery, priceRange, activities])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Activités
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez des expériences uniques avec nos guides locaux
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 space-y-6">
          <div className="space-y-4 sticky top-20">
            <div>
              <Label htmlFor="search" className="mb-2 block">
                Rechercher
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Prix (MAD)</Label>
              <div className="space-y-2">
                <Slider value={priceRange} onValueChange={setPriceRange} max={maxPrice} step={50} className="mt-2" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{priceRange[0]} MAD</span>
                  <span>{priceRange[1]} MAD</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {filteredActivities.length} activité{filteredActivities.length !== 1 ? "s" : ""} trouvée
                {filteredActivities.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </aside>

        {/* Activities Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">Aucune activité trouvée</p>
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
  )
}
