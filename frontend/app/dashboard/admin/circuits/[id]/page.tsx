"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { circuitsService } from "@/services/circuits.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle, Trash2, Map, Clock, Loader2, Banknote } from "lucide-react"
import type { Circuit } from "@/lib/types"

export default function AdminCircuitDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [circuit, setCircuit] = useState<Circuit | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    circuitsService.getCircuitById(Number(resolvedParams.id))
      .then(setCircuit)
      .catch(() => toast({ title: "Erreur", description: "Circuit introuvable", variant: "destructive" }))
      .finally(() => setLoading(false))
  }, [resolvedParams.id, toast])

  const handleValidate = async () => {
    if (!circuit) return
    try {
      await circuitsService.validateCircuit(circuit.id)
      toast({ title: "Validé", description: "Le circuit est désormais actif." })
      router.push("/dashboard/admin/circuits")
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
  if (!circuit) return <div className="p-10 text-center">Circuit introuvable.</div>

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-3xl font-bold">{circuit.title}</CardTitle>
              <Badge variant={circuit.status === "ACTIVE" ? "default" : "secondary"}>{circuit.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6 p-4 bg-orange-50 text-orange-700 rounded-xl border border-orange-100">
               <div className="flex items-center gap-2"><Clock /> <span className="font-semibold">{circuit.duration}</span></div>
               <div className="flex items-center gap-2"><Banknote /> <span className="font-bold">{circuit.price} MAD</span></div>
            </div>
            <div>
               <h3 className="font-bold mb-2 text-lg">Itinéraire et Détails</h3>
               <p className="text-slate-600 whitespace-pre-line leading-relaxed border-l-4 border-orange-200 pl-4">{circuit.description}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-slate-50 border-none shadow-inner">
            <CardHeader><CardTitle className="text-lg">Actions de Modération</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {circuit.status === "PENDING" && (
                <Button onClick={handleValidate} className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md">
                  Approuver l'itinéraire
                </Button>
              )}
              <Button variant="destructive" className="w-full" onClick={() => {
                if(confirm("Supprimer ce circuit ?")) {
                  circuitsService.deleteCircuit(circuit.id).then(() => router.push("/dashboard/admin/circuits"));
                }
              }}>
                Supprimer le circuit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}