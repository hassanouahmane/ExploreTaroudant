"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { ReservationCard } from "@/components/reservation-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { reservationsService } from "@/services/reservations.service"
import type { Reservation } from "@/lib/types"
import { Loader2 } from "lucide-react"

function ReservationsContent() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancelingId, setCancelingId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationsService.getMyReservations()
        setReservations(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les réservations",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [toast])

  const handleCancelReservation = async (id: number) => {
    setCancelingId(id)

    try {
      await reservationsService.cancelReservation(id)

      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: "CANCELLED" as const } : r)))

      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
        variant: "destructive",
      })
    } finally {
      setCancelingId(null)
    }
  }

  const activeReservations = reservations.filter((r) => r.status !== "CANCELLED")
  const cancelledReservations = reservations.filter((r) => r.status === "CANCELLED")

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Mes Réservations</h1>
        <p className="text-muted-foreground">Gérez toutes vos réservations d&apos;activités</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="active">
            Actives
            {activeReservations.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                {activeReservations.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Annulées
            {cancelledReservations.length > 0 && (
              <span className="ml-2 bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                {cancelledReservations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activeReservations.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">Aucune réservation active</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onCancel={handleCancelReservation}
                  isCanceling={cancelingId === reservation.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : cancelledReservations.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">Aucune réservation annulée</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cancelledReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ReservationsPage() {
  return (
    <ProtectedRoute allowedRoles={["TOURIST"]}>
      <ReservationsContent />
    </ProtectedRoute>
  )
}
