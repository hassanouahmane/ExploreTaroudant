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
import { Calendar, CheckCircle, XCircle, Star, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"

function TouristDashboardContent() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [reviewsCount, setReviewsCount] = useState(0)
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId")
        const name = localStorage.getItem("userName")
        setUserName(name || "Voyageur")

        const [resData, revData] = await Promise.all([
          reservationsService.getMyReservations(),
          userId ? reviewsService.getReviewsByUser(Number(userId)) : []
        ])

        setReservations(resData)
        setReviewsCount(revData.length)
      } catch (error) {
        console.error("Dashboard error", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const activeRes = reservations.filter(r => r.status === "CONFIRMED")
  const cancelledRes = reservations.filter(r => r.status === "CANCELLED")

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-primary">Salam, {userName} 🌴</h1>
          <p className="text-muted-foreground italic">Prêt pour votre prochaine découverte à Taroudant ?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Calendar />} value={activeRes.length} label="À venir" iconColor="text-blue-500" />
        <StatCard icon={<CheckCircle />} value={activeRes.length} label="Confirmées" iconColor="text-green-500" />
        <StatCard icon={<XCircle />} value={cancelledRes.length} label="Annulées" iconColor="text-red-500" />
        <StatCard icon={<Star />} value={reviewsCount} label="Mes avis" iconColor="text-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Réservations récentes</CardTitle>
            <Link href="/dashboard/tourist/reservations" className="text-sm text-primary flex items-center gap-1">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeRes.slice(0, 2).map(res => (
              <ReservationCard key={res.id} reservation={res} />
            ))}
            {activeRes.length === 0 && <p className="text-center text-muted-foreground py-10">Aucune activité prévue.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Actions rapides</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
             <Button asChild variant="outline" className="justify-start gap-3">
                <Link href="/activities">🎯 Réserver une activité</Link>
             </Button>
             <Button asChild variant="outline" className="justify-start gap-3">
                <Link href="/places">🏛️ Noter un lieu</Link>
             </Button>
             <Button asChild variant="outline" className="justify-start gap-3">
                <Link href="/events">📅 Voir les événements</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
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