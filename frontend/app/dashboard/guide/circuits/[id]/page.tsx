"use client"

import { use, useEffect, useState } from "react"
import { circuitsService } from "@/services/circuits.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Banknote, Loader2, Info, Map as MapIcon, CheckCircle } from "lucide-react"
import type { Circuit } from "@/lib/types"
import Link from "next/link"

export default function GuideCircuitDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [circuit, setCircuit] = useState<Circuit | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    circuitsService.getCircuitById(Number(resolvedParams.id))
      .then(setCircuit)
      .finally(() => setLoading(false))
  }, [resolvedParams.id])

  if (loading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin h-12 w-12 text-blue-600" /></div>
  if (!circuit) return <div className="p-20 text-center">Circuit introuvable.</div>

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard/guide/circuits">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-none overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
              <div className="flex items-center gap-2 mb-2 text-blue-100 uppercase tracking-wider text-xs font-bold">
                <MapIcon size={16}/> Itinéraire Guide
              </div>
              <h1 className="text-3xl font-bold">{circuit.title}</h1>
            </div>
            
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <Banknote className="text-blue-600" size={24} />
                  <div>
                    <p className="text-xs text-blue-600 uppercase font-bold">Prix Circuit</p>
                    <p className="text-xl font-bold">{circuit.price} MAD</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="text-slate-600" size={24} />
                  <div>
                    <p className="text-xs text-slate-600 uppercase font-bold">Durée</p>
                    <p className="text-xl font-bold">{circuit.duration}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Info className="text-blue-500" size={20} /> Programme détaillé
                </h3>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-xl whitespace-pre-line border">
                  {circuit.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={`border-none shadow-md ${circuit.status === "ACTIVE" ? "bg-emerald-50" : "bg-amber-50"}`}>
            <CardContent className="p-6 text-center space-y-4">
              <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center ${circuit.status === "ACTIVE" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                {circuit.status === "ACTIVE" ? <CheckCircle size={24}/> : <Clock size={24}/>}
              </div>
              <div>
                <h3 className="font-bold">Statut : {circuit.status}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {circuit.status === "ACTIVE" 
                    ? "Votre itinéraire est public." 
                    : "En attente de validation administrative."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}