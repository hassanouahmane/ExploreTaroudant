"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { eventsService } from "@/services/events.service"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Loader2 } from "lucide-react"

export default function GuideCreateEventPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "", location: "", startDate: "", endDate: "" })
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await eventsService.createEvent(formData as any) // Le backend gère proposedBy via le token
      toast({ title: "Succès", description: "Événement soumis pour validation administrative." })
      router.push("/dashboard/guide/events")
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto shadow-lg border-t-4 border-t-pink-500">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Calendar className="text-pink-500" /> Nouvel Événement Culturel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de l'événement</Label>
              <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Lieu / Adresse</Label>
              <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description du programme</Label>
              <Textarea rows={5} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Soumettre la proposition"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}