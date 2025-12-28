"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { eventsService } from "@/services/events.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle, Trash2, MapPin, Calendar, User, Loader2 } from "lucide-react"
import type { Event } from "@/lib/types"

export default function AdminEventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    eventsService.getEventById(Number(resolvedParams.id))
      .then(setEvent)
      .finally(() => setLoading(false))
  }, [resolvedParams.id])

  const handleValidate = async () => {
    if (!event) return
    try {
      await eventsService.validateEvent(event.id)
      toast({ title: "Validé" })
      router.push("/dashboard/admin/events")
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
  if (!event) return <div className="p-10 text-center">Événement introuvable</div>

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-3xl font-extrabold">{event.title}</CardTitle>
              <Badge variant={event.status === "ACTIVE" ? "default" : "secondary"}>{event.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-purple-50 text-purple-700 rounded-xl flex items-center gap-4 border border-purple-100">
               <Calendar className="h-6 w-6" />
               <div>
                  <p className="text-xs font-bold uppercase">Dates de l'événement</p>
                  <p className="font-semibold">Du {new Date(event.startDate).toLocaleDateString()} au {new Date(event.endDate).toLocaleDateString()}</p>
               </div>
            </div>
            <div>
               <h3 className="font-bold mb-2">Description</h3>
               <p className="text-slate-600 whitespace-pre-line leading-relaxed">{event.description}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Détails Logistiques</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2"><MapPin className="text-red-500"/> {event.location}</div>
              <div className="flex items-center gap-2"><User className="text-blue-500"/> Proposé par : {event.proposedBy?.fullName || "Admin"}</div>
              
              <div className="pt-6 space-y-2">
                {event.status === "PENDING" && (
                  <Button onClick={handleValidate} className="w-full bg-emerald-600 hover:bg-emerald-700">Valider l'événement</Button>
                )}
                <Button variant="destructive" className="w-full">Supprimer</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}