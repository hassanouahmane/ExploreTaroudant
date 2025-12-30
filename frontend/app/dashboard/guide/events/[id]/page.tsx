"use client"

import { use, useEffect, useState } from "react"
import { eventsService } from "@/services/events.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Calendar, Info, Loader2, Edit } from "lucide-react"
import type { Event } from "@/lib/types"
import Link from "next/link"

export default function GuideEventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    eventsService.getEventById(Number(resolvedParams.id))
      .then(setEvent)
      .finally(() => setLoading(false))
  }, [resolvedParams.id])

  if (loading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin h-10 text-pink-500" /></div>
  if (!event) return <div className="p-20 text-center">Événement introuvable.</div>

  const isPending = event.status === "PENDING"

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" asChild><Link href="/dashboard/guide/events"><ArrowLeft className="mr-2" /> Retour</Link></Button>
        <Button variant="outline" asChild className="border-pink-200 text-pink-700 hover:bg-pink-50">
          <Link href={`/dashboard/guide/events/${event.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Modifier</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-none shadow-xl">
            <div className="bg-gradient-to-r from-pink-600 to-rose-700 p-8 text-white">
              <Badge className="mb-4 bg-white/20 hover:bg-white/30 border-none">{event.status}</Badge>
              <h1 className="text-4xl font-black mb-2">{event.title}</h1>
              <p className="flex items-center gap-2 text-pink-100"><MapPin size={18}/> {event.location}</p>
            </div>
            <CardContent className="p-8 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-pink-50 border border-pink-100 flex items-center gap-3">
                   <Calendar className="text-pink-600" />
                   <div>
                     <p className="text-xs uppercase font-bold text-pink-400">Date de début</p>
                     <p className="font-bold">{event.startDate}</p>
                   </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                   <Calendar className="text-slate-600" />
                   <div>
                     <p className="text-xs uppercase font-bold text-slate-400">Date de fin</p>
                     <p className="font-bold">{event.endDate}</p>
                   </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2"><Info size={20} className="text-pink-500" /> Détails du programme</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-2xl border">{event.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
            <Card className={`p-6 border-none shadow-md ${isPending ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                <h3 className={`font-bold mb-2 ${isPending ? 'text-amber-800' : 'text-emerald-800'}`}>
                    {isPending ? 'En attente de validation' : 'Événement publié'}
                </h3>
                <p className="text-sm text-slate-600">
                    {isPending 
                      ? "L'administrateur doit vérifier les dates et le lieu avant que l'événement ne soit visible par les touristes."
                      : "Cet événement est maintenant visible sur le calendrier public d'ExploreTaroudant."}
                </p>
            </Card>
        </div>
      </div>
    </div>
  )
}