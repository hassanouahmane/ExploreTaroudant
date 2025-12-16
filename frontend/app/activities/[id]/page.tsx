"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ReservationForm } from "@/components/reservation-form"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { activitiesService } from "@/services/activities.service"
import { authService } from "@/services/auth.service"
import type { Activity } from "@/lib/types"
import { MapPin, Clock, Loader2, User } from "lucide-react"
import Link from "next/link"

export default function ActivityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [activity, setActivity] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated())
  }, [])

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activityId = Number.parseInt(resolvedParams.id)
        const data = await activitiesService.getActivityById(activityId)
        setActivity(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'activité",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivity()
  }, [resolvedParams.id, toast])

  const handleReservationSuccess = () => {
    router.push("/dashboard/tourist/reservations")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg text-muted-foreground">Activité non trouvée</p>
      </div>
    )
  }

  return (
    <div className="pb-20">
      {/* Hero Image */}
      <div className="relative h-[400px] w-full">
        <img
          src={`/.jpg?height=400&width=1200&query=${activity.title}+Morocco+activity`}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{activity.title}</h1>
          <p className="text-2xl font-bold text-accent">{activity.price} MAD</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
              </CardContent>
            </Card>

            {/* Place Info */}
            {activity.place && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Lieu</h2>
                  <Link href={`/places/${activity.place.id}`}>
                    <div className="flex items-start gap-4 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{activity.place.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {activity.place.city}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{activity.place.description}</p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Guide Info */}
            {activity.guide && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Guide</h2>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{activity.guide.fullName}</p>
                      <p className="text-sm text-muted-foreground">{activity.guide.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-bold text-lg">Informations</h3>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Prix</p>
                  <p className="font-bold text-2xl text-primary">{activity.price} MAD</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Durée</p>
                  <p className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {activity.duration}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Lieu</p>
                  <p className="font-medium">{activity.place?.name}</p>
                </div>
              </CardContent>
            </Card>

            {isAuthenticated ? (
              <ReservationForm
                activityId={activity.id}
                activityTitle={activity.title}
                activityPrice={activity.price}
                onSuccess={handleReservationSuccess}
              />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-4">Réservation</h3>
                  <Button className="w-full" size="lg" onClick={() => router.push("/auth/login")}>
                    Connectez-vous pour réserver
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
