"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { circuitsService } from "@/services/circuits.service"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Map as MapIcon } from "lucide-react"
import Link from "next/link"

export default function GuideCreateCircuitPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: ""
  })
  
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await circuitsService.createCircuit({
        ...formData,
        price: Number(formData.price)
      })
      toast({ title: "Succès", description: "Circuit envoyé pour validation." })
      router.push("/dashboard/guide/circuits")
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" asChild className="mb-6"><Link href="/dashboard/guide/circuits"><ArrowLeft className="mr-2 h-4 w-4"/> Retour</Link></Button>
      
      <Card className="max-w-2xl mx-auto shadow-lg border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <MapIcon className="text-blue-500" /> Nouvel Itinéraire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom du circuit</Label>
              <Input placeholder="ex: Traversée de la Palmeraie en calèche" required 
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prix total (MAD)</Label>
                <Input type="number" required value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Durée estimée</Label>
                <Input placeholder="ex: 1 journée, 4 heures..." required value={formData.duration} 
                  onChange={e => setFormData({...formData, duration: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description de l'itinéraire</Label>
              <Textarea rows={6} placeholder="Détaillez les étapes du circuit, les points de vue..." required 
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Soumettre le circuit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}