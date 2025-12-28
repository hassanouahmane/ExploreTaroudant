"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { ReservationCard } from "@/components/reservation-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { reservationsService } from "@/services/reservations.service"
import type { Reservation } from "@/lib/types"
import { Loader2, CalendarRange } from "lucide-react"

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
          description: "Impossible de charger vos réservations",
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
      setReservations((prev) => 
        prev.map((r) => (r.id === id ? { ...r, status: "CANCELLED" as const } : r))
      )
      toast({
        title: "Succès",
        description: "Réservation annulée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "L'annulation a échoué",
        variant: "destructive",
      })
    } finally {
      setCancelingId(null)
    }
  }

  const activeReservations = reservations.filter((r) => r.status !== "CANCELLED")
  const cancelledReservations = reservations.filter((r) => r.status === "CANCELLED")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center gap-4">
        <CalendarRange className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Mes Réservations</h1>
          <p className="text-muted-foreground">Retrouvez vos activités et circuits prévus à Taroudant</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="active">Actives ({activeReservations.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Annulées ({cancelledReservations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeReservations.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
              <p>Aucune réservation en cours.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeReservations.map((res) => (
                <ReservationCard 
                  key={res.id} 
                  reservation={res} 
                  onCancel={handleCancelReservation}
                  isCanceling={cancelingId === res.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-75">
              {cancelledReservations.map((res) => (
                <ReservationCard key={res.id} reservation={res} />
              ))}
            </div>
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