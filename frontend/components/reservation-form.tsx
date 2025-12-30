"use client"

import { useState } from "react"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { reservationsService } from "@/services/reservations.service"

interface ReservationFormProps {
  activityId?: number
  circuitId?: number
  activityTitle?: string
  activityPrice: number
  onSuccess?: () => void
}

export function ReservationForm({ 
  activityId, 
  circuitId, 
  activityTitle, 
  activityPrice, 
  onSuccess 
}: ReservationFormProps) {
  const [date, setDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!date) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner une date pour votre réservation.",
        variant: "destructive",
      })
      return
    }

    if (!activityId && !circuitId) {
       toast({
        title: "Erreur technique",
        description: "Aucun ID d'activité ou de circuit fourni.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Construction du payload pour correspondre aux entités JPA du Backend
      const payload: any = {
        reservationDate: format(date, "yyyy-MM-dd"), // Format LocalDate Java
        status: "CONFIRMED"
      }

      // On attache soit l'activité, soit le circuit (objet imbriqué avec ID)
      if (activityId) {
        payload.activity = { id: activityId }
      } else if (circuitId) {
        payload.circuit = { id: circuitId }
      }

      // Appel de la méthode CORRIGÉE du service
      await reservationsService.createReservation(payload)

      toast({
        title: "Réservation confirmée !",
        description: `Votre place pour "${activityTitle}" est réservée.`,
        className: "bg-emerald-50 border-emerald-200 text-emerald-800",
      })

      if (onSuccess) onSuccess()
      
    } catch (error) {
      console.error(error)
      toast({
        title: "Erreur",
        description: "La réservation a échoué. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-200">Choisir une date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-white/10 border-white/10 text-white hover:bg-white/20 hover:text-white",
                !date && "text-slate-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()} // Empêche les dates passées (Logique Backend #6)
              initialFocus
              className="rounded-md border shadow-lg"
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button 
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 text-lg shadow-lg transition-all active:scale-95" 
        onClick={handleSubmit}
        disabled={isLoading || !date}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Confirmation...
          </>
        ) : (
          `Confirmer la réservation`
        )}
      </Button>
    </div>
  )
}