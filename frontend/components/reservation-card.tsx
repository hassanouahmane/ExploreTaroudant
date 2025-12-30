"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, Clock, MapPin, XCircle, CheckCircle, AlertCircle, Mountain, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Reservation } from "@/lib/types"

interface ReservationCardProps {
  reservation: Reservation
  onCancel?: (id: number) => void
  isCanceling?: boolean
}

export function ReservationCard({ reservation, onCancel, isCanceling }: ReservationCardProps) {
  // LOGIQUE MÉTIER FRONTEND : Déterminer si c'est une activité ou un circuit
  const item = reservation.activity || reservation.circuit
  const isActivity = !!reservation.activity
  const typeLabel = isActivity ? "Activité" : "Circuit"
  
  // Sécurité : si la réservation est corrompue (ni l'un ni l'autre)
  if (!item) return null

  // Image par défaut selon le type
  const fallbackImage = isActivity 
    ? "https://images.unsplash.com/photo-1542259646-c0c5e574eb36?q=80&w=2070" 
    : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021"

  const imageUrl = (item as any).imageUrl || fallbackImage

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return { color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", icon: CheckCircle, label: "Confirmée" }
      case "CANCELLED":
        return { color: "bg-red-500/10 text-red-600 border-red-200", icon: XCircle, label: "Annulée" }
      default:
        return { color: "bg-amber-500/10 text-amber-600 border-amber-200", icon: AlertCircle, label: "En attente" }
    }
  }

  const statusConfig = getStatusConfig(reservation.status)
  const StatusIcon = statusConfig.icon

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-3xl flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
            reservation.status === "CANCELLED" ? "grayscale opacity-60" : ""
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Badge Type (Activité ou Circuit) */}
        <Badge className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white border-none font-bold uppercase tracking-wider text-[10px] pl-2 pr-3 py-1">
            {isActivity ? <Compass className="h-3 w-3 mr-1" /> : <Mountain className="h-3 w-3 mr-1" />}
            {typeLabel}
        </Badge>

        <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-black text-white leading-tight drop-shadow-md line-clamp-1">{item.title}</h3>
            <p className="text-white/80 text-sm font-medium flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-amber-400" />
                {format(new Date(reservation.reservationDate), "d MMMM yyyy", { locale: fr })}
            </p>
        </div>
      </div>

      <CardContent className="p-6 flex-1 space-y-4">
        {/* Status */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.color} w-fit`}>
            <StatusIcon size={14} />
            {statusConfig.label}
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Prix</p>
                <p className="text-slate-900 font-black">{item.price} MAD</p>
             </div>
             <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Durée</p>
                <p className="text-slate-900 font-bold flex items-center gap-1">
                    <Clock size={14} className="text-amber-500"/> {item.duration}
                </p>
             </div>
        </div>
      </CardContent>

      {reservation.status !== "CANCELLED" && onCancel && (
        <CardFooter className="p-6 pt-0 mt-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-xl font-bold transition-all"
                disabled={isCanceling}
              >
                {isCanceling ? "Annulation..." : "Annuler la réservation"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Vous allez annuler votre réservation pour "{item.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Retour</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onCancel(reservation.id)}
                  className="bg-red-600 hover:bg-red-700 rounded-xl"
                >
                  Confirmer l'annulation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  )
}