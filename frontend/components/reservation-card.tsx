"use client"

import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Reservation } from "@/lib/types"
import { Calendar, MapPin, X } from "lucide-react"

interface ReservationCardProps {
  reservation: Reservation
  onCancel?: (id: number) => void
  isCanceling?: boolean
}

export function ReservationCard({ reservation, onCancel, isCanceling }: ReservationCardProps) {
  const statusColors = {
    PENDING: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    CONFIRMED: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  }

  const statusLabels = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    CANCELLED: "Annulée",
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">
              {reservation.activity?.title || `Réservation #${reservation.id}`}
            </CardTitle>
            <Badge variant="outline" className={statusColors[reservation.status]}>
              {statusLabels[reservation.status]}
            </Badge>
          </div>
          {reservation.status === "PENDING" && onCancel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCancel(reservation.id)}
              disabled={isCanceling}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {format(parseISO(reservation.reservationDate), "EEEE d MMMM yyyy", { locale: fr })}
        </div>
        {reservation.activity?.place && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {reservation.activity.place.name}
          </div>
        )}
        {reservation.activity?.price && (
          <div className="pt-2">
            <p className="font-semibold text-primary">{reservation.activity.price} MAD</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
