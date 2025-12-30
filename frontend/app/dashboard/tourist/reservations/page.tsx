"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route" 
import { ReservationCard } from "@/components/reservation-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { reservationsService } from "@/services/reservations.service"
import type { Reservation } from "@/lib/types"
import { Loader2, CalendarRange, Frown } from "lucide-react"

function ReservationsContent() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancelingId, setCancelingId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationsService.getMyReservations()
        // Sécurité : on s'assure que data est bien un tableau
        setReservations(Array.isArray(data) ? data : [])
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger vos réservations",
          variant: "destructive",
        })
        setReservations([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchReservations()
  }, [toast])

  const handleCancelReservation = async (id: number) => {
    if (!id) return
    setCancelingId(id)
    try {
      await reservationsService.cancelReservation(id)
      setReservations((prev) => 
        prev.map((r) => (r.id === id ? { ...r, status: "CANCELLED" as const } : r))
      )
      toast({
        title: "Succès",
        description: "La réservation a été annulée.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'annulation.",
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
        <p className="text-slate-500 font-medium animate-pulse">Chargement de votre carnet de voyage...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center gap-4 border-b border-slate-100 pb-8">
        <div className="bg-amber-100 p-3 rounded-2xl w-fit">
            <CalendarRange className="h-8 w-8 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mes Réservations</h1>
          <p className="text-slate-500 font-medium">Gérez vos activités et circuits à venir à Taroudant.</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-8 p-1 bg-slate-100/80 rounded-2xl h-auto">
          <TabsTrigger 
            value="active" 
            className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm transition-all"
          >
            À venir ({activeReservations.length})
          </TabsTrigger>
          <TabsTrigger 
            value="cancelled" 
            className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-slate-600 data-[state=active]:shadow-sm transition-all"
          >
            Annulées / Passées ({cancelledReservations.length})
          </TabsTrigger>
        </TabsList>

        {/* CONTENU ACTIF */}
        <TabsContent value="active" className="outline-none space-y-8">
          {activeReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-center px-4">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <Frown className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune réservation active</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">
                Vous n'avez pas encore planifié d'aventure. Explorez nos activités pour commencer !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeReservations.map((res, index) => (
                // ICI : On utilise l'index pour garantir une clé unique et éviter le crash
                <div key={`active-${index}`}>
                  <ReservationCard 
                    reservation={res} 
                    onCancel={handleCancelReservation}
                    isCanceling={cancelingId === res.id}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* CONTENU ANNULÉ */}
        <TabsContent value="cancelled" className="outline-none space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-70 grayscale-[0.3]">
            {cancelledReservations.map((res, index) => (
              // ICI AUSSI : Clé unique basée sur l'index
              <div key={`cancelled-${index}`}>
                 <ReservationCard reservation={res} />
              </div>
            ))}
            {cancelledReservations.length === 0 && (
              <div className="col-span-full text-center py-20 text-slate-400 font-medium italic">
                Aucune réservation annulée dans l'historique.
              </div>
            )}
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