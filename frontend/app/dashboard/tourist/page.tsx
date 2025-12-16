"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { StatCard } from "@/components/stat-card"
import { ReservationCard } from "@/components/reservation-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { reservationsService } from "@/services/reservations.service"
import { reviewsService } from "@/services/reviews.service"
import type { Reservation, Review } from "@/lib/types"
import { Calendar, CheckCircle, XCircle, Star, Loader2 } from "lucide-react"
import Link from "next/link"

function TouristDashboardContent() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId")
        setUserName(localStorage.getItem("userName") || "")

        const [reservationsData, reviewsData] = await Promise.all([
          reservationsService.getMyReservations(),
          userId ? reviewsService.getReviewsByUser(Number.parseInt(userId)) : Promise.resolve([]),
        ])

        setReservations(reservationsData)
        setReviews(reviewsData)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const upcomingReservations = reservations.filter((r) => r.status !== "CANCELLED")
  const completedReservations = reservations.filter((r) => r.status === "CONFIRMED")
  const cancelledReservations = reservations.filter((r) => r.status === "CANCELLED")

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
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Bienvenue, {userName}</h1>
        <p className="text-muted-foreground">Gérez vos réservations et avis</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Calendar className="h-8 w-8" />}
          value={upcomingReservations.length}
          label="Réservations actives"
          iconColor="text-primary"
        />
        <StatCard
          icon={<CheckCircle className="h-8 w-8" />}
          value={completedReservations.length}
          label="Confirmées"
          iconColor="text-green-600"
        />
        <StatCard
          icon={<XCircle className="h-8 w-8" />}
          value={cancelledReservations.length}
          label="Annulées"
          iconColor="text-red-600"
        />
        <StatCard
          icon={<Star className="h-8 w-8" />}
          value={reviews.length}
          label="Avis donnés"
          iconColor="text-accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Réservations récentes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/tourist/reservations">Voir tout</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingReservations.length > 0 ? (
              <div className="space-y-4">
                {upcomingReservations.slice(0, 3).map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aucune réservation active</p>
                <Button asChild>
                  <Link href="/activities">Explorer les activités</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mes derniers avis</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/places">Écrire un avis</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-sm">{review.place?.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aucun avis donné</p>
                <Button asChild>
                  <Link href="/places">Explorer les lieux</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" size="lg" asChild className="h-auto py-4 flex-col gap-2 bg-transparent">
              <Link href="/places">
                <span className="text-2xl">🏛️</span>
                <span>Explorer les lieux</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-auto py-4 flex-col gap-2 bg-transparent">
              <Link href="/activities">
                <span className="text-2xl">🎯</span>
                <span>Voir les activités</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-auto py-4 flex-col gap-2 bg-transparent">
              <Link href="/events">
                <span className="text-2xl">🎉</span>
                <span>Événements</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TouristDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["TOURIST"]}>
      <TouristDashboardContent />
    </ProtectedRoute>
  )
}
