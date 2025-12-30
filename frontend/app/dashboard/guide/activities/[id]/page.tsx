"use client"

import { use, useEffect, useState } from "react"
import { activitiesService } from "@/services/activities.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Banknote, 
  Loader2, 
  Info, 
  ShieldCheck, 
  Calendar,
  LayoutDashboard
} from "lucide-react"
import type { Activity } from "@/lib/types"
import Link from "next/link"

export default function GuideActivityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    activitiesService.getActivityById(Number(resolvedParams.id))
      .then(setActivity)
      .finally(() => setLoading(false))
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <p className="text-muted-foreground animate-pulse">Chargement de l'activité...</p>
      </div>
    )
  }

  if (!activity) return <div className="p-20 text-center text-xl font-semibold">Activité introuvable.</div>

  const isActive = activity.status === "ACTIVE"

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Barre de navigation haute */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" asChild className="hover:bg-slate-100">
            <Link href="/dashboard/guide/activities">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
            </Link>
          </Button>
          <Badge className={isActive ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"}>
            {isActive ? "Activité Publiée" : "En cours d'examen"}
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne Principale */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-none shadow-lg">
              {/* En-tête stylisé */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-10 text-white">
                <div className="flex items-center gap-2 text-purple-100 mb-2">
                  <LayoutDashboard size={18} />
                  <span className="text-sm font-medium uppercase tracking-wider">Détails de l'expérience</span>
                </div>
                <h1 className="text-4xl font-extrabold mb-4">{activity.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    <MapPin size={16} /> {activity.place?.name || "Taroudant"}
                  </span>
                  <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Calendar size={16} /> Ajouté récemment
                  </span>
                </div>
              </div>

              <CardContent className="p-8 space-y-8 bg-white">
                {/* Cartes d'info rapides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="h-12 w-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                      <Banknote size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-emerald-600 font-medium">Prix par personne</p>
                      <p className="text-2xl font-bold text-emerald-900">{activity.price} <span className="text-sm font-normal">MAD</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Durée estimée</p>
                      <p className="text-2xl font-bold text-blue-900">{activity.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Info className="text-purple-500" size={22} />
                    À propos de cette activité
                  </h3>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      {activity.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne Latérale */}
          <div className="space-y-6">
            {/* Carte de Statut */}
            <Card className={`border-none shadow-md ${isActive ? "bg-emerald-50" : "bg-amber-50"}`}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center ${isActive ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                    {isActive ? <ShieldCheck size={32} /> : <Clock size={32} />}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isActive ? "text-emerald-900" : "text-amber-900"}`}>
                      {isActive ? "Activité en ligne" : "Vérification en cours"}
                    </h3>
                    <p className={`text-sm mt-2 ${isActive ? "text-emerald-700" : "text-amber-700"}`}>
                      {isActive 
                        ? "Votre activité est actuellement visible par tous les touristes. Les réservations sont ouvertes." 
                        : "L'administrateur examine votre proposition. Vous recevrez une notification dès qu'elle sera validée."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aide / Tips */}
            <Card className="border-dashed border-2 bg-transparent">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-500">
                  <Info size={16} /> Conseils de guide
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-500 space-y-2">
                <p>• Assurez-vous que la durée inclut le temps de préparation.</p>
                <p>• Les activités avec des descriptions détaillées reçoivent 40% de réservations en plus.</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}