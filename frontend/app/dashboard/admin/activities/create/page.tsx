"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { activitiesService } from "@/services/activities.service"
import { placesService } from "@/services/places.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import type { Place } from "@/lib/types"

export default function AdminCreateActivityPage() {
  const [formData, setFormData] = useState({ title: "", description: "", price: "", duration: "", placeId: "" })
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    placesService.getAllActivePlaces().then(setPlaces)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await activitiesService.createActivity({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        duration: formData.duration,
        place: { id: Number(formData.placeId) }
      } as any)
      toast({ title: "Activité créée avec succès !" })
      router.push("/dashboard/admin/activities")
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
    finally { setLoading(false) }
  }

  return (
    <div className="container mx-auto py-10">
      <Button variant="ghost" asChild className="mb-6"><Link href="/dashboard/admin/activities"><ArrowLeft className="mr-2 h-4 w-4"/> Retour</Link></Button>
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader className="bg-primary/5"><CardTitle>Publier une nouvelle Activité</CardTitle></CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Titre de l'activité</Label><Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
            <div className="space-y-2">
              <Label>Lieu à Taroudant</Label>
              <Select onValueChange={v => setFormData({...formData, placeId: v})}>
                <SelectTrigger><SelectValue placeholder="Sélectionner le lieu" /></SelectTrigger>
                <SelectContent>{places.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Prix (MAD)</Label><Input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
              <div className="space-y-2"><Label>Durée estimée</Label><Input placeholder="ex: 3h" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} /></div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? <Loader2 className="animate-spin mr-2"/> : "Publier l'activité"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}