"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { activitiesService } from "@/services/activities.service"
import type { Activity } from "@/lib/types"
import { PlusCircle, Calendar, DollarSign, ActivityIcon, Loader2, Edit } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

function GuideDashboardContent() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId")
        setUserName(localStorage.getItem("userName") || "")

        if (userId) {
          const activitiesData = await activitiesService.getActivitiesByGuide(Number.parseInt(userId))
          setActivities(activitiesData)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalRevenue = activities.reduce((sum, activity) => sum + activity.price, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Bienvenue, {userName}</h1>
          <p className="text-muted-foreground">Gérez vos activités et réservations</p>
        </div>
        <Button size="lg" asChild>
          <Link href="/dashboard/guide/activities/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            Créer une activité
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<ActivityIcon className="h-8 w-8" />}
          value={activities.length}
          label="Activités créées"
          iconColor="text-primary"
        />
        <StatCard
          icon={<Calendar className="h-8 w-8" />}
          value={0}
          label="Réservations actives"
          iconColor="text-accent"
        />
        <StatCard
          icon={<DollarSign className="h-8 w-8" />}
          value={`${totalRevenue} MAD`}
          label="Revenus potentiels"
          iconColor="text-green-600"
        />
      </div>

      {/* Activities Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mes Activités</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/guide/activities">Voir tout</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between p-4 border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{activity.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="secondary">{activity.place?.name}</Badge>
                      <span className="font-semibold text-primary">{activity.price} MAD</span>
                      <span className="text-muted-foreground">{activity.duration}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/dashboard/guide/activities/${activity.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ActivityIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Aucune activité créée</p>
              <Button asChild>
                <Link href="/dashboard/guide/activities/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Créer votre première activité
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function GuideDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["GUIDE"]}>
      <GuideDashboardContent />
    </ProtectedRoute>
  )
}
