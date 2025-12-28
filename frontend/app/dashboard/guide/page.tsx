"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { activitiesService } from "@/services/activities.service"
import { guideService } from "@/services/guide.service"
import type { Activity } from "@/lib/types" 
// AJOUT DE MapPin DANS L'IMPORT lucide-react
import { 
  PlusCircle, 
  Calendar, 
  DollarSign, 
  ActivityIcon, 
  Loader2, 
  Edit, 
  MapPin 
} from "lucide-react"
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
        setIsLoading(true)
        const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        
        if (!storedUserId) {
          router.push("/auth/login");
          return;
        }

        const userIdNum = Number.parseInt(storedUserId);

        const [activitiesData, profileData] = await Promise.all([
          activitiesService.getActivitiesByGuide(userIdNum),
          guideService.getProfile() 
        ])

        setActivities(activitiesData)
        setUserName(profileData.fullName)
      } catch (error) {
        console.error("Erreur dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const totalRevenue = activities.reduce((sum, activity) => sum + activity.price, 0)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">Bienvenue, {userName}</h1>
          <p className="text-muted-foreground">Gérez vos activités et réservations pour Taroudant</p>
        </div>
        <Button size="lg" asChild className="shadow-md">
          <Link href="/dashboard/guide/activities/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            Créer une activité
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<ActivityIcon className="h-8 w-8" />} value={activities.length} label="Activités créées" iconColor="text-primary" />
        <StatCard icon={<Calendar className="h-8 w-8" />} value={0} label="Réservations actives" iconColor="text-amber-500" />
        <StatCard icon={<DollarSign className="h-8 w-8" />} value={`${totalRevenue} MAD`} label="Revenus potentiels" iconColor="text-emerald-600" />
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mes Activités</CardTitle>
            <Badge variant="outline">{activities.length} total</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between p-4 border rounded-lg hover:border-primary/50 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className="font-semibold text-lg">{activity.title}</h3>
                       {activity.status && (
                         <Badge variant={activity.status === 'ACTIVE' ? 'default' : 'secondary'}>
                           {activity.status}
                         </Badge>
                       )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{activity.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        ID Lieu: {activity.placeId}
                      </div>
                      <span className="font-bold text-emerald-600">{activity.price} MAD</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{activity.duration}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/guide/activities/${activity.id}/edit`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-lg border-2 border-dashed">
              <ActivityIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Vous n'avez pas encore créé d'activité</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/dashboard/guide/activities/create">Commencer maintenant</Link>
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