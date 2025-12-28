"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { circuitsService } from "@/services/circuits.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminCreateCircuitPage() {
  const [formData, setFormData] = useState({ title: "", description: "", duration: "", price: "" })
  const [loading, setLoading] = useState(false)
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
      toast({ title: "Circuit créé avec succès !" })
      router.push("/dashboard/admin/circuits")
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
    finally { setLoading(false) }
  }

  return (
    <div className="container mx-auto py-10">
      <Button variant="ghost" asChild className="mb-6"><Link href="/dashboard/admin/circuits"><ArrowLeft className="mr-2 h-4 w-4"/> Retour</Link></Button>
      <Card className="max-w-2xl mx-auto shadow-lg border-t-4 border-t-orange-500">
        <CardHeader><CardTitle>Proposer un nouvel itinéraire</CardTitle></CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Titre du Circuit</Label><Input placeholder="ex: Tour des Remparts" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2"><Label>Prix indicatif (MAD)</Label><Input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
               <div className="space-y-2"><Label>Durée prévue</Label><Input placeholder="ex: 1 Journée" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} /></div>
            </div>
            <div className="space-y-2"><Label>Description du parcours</Label><Textarea required rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>{loading ? <Loader2 className="animate-spin mr-2"/> : "Publier le circuit"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}