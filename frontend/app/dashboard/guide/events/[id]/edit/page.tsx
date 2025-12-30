"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { eventsService } from "@/services/events.service"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function GuideEditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "", location: "", startDate: "", endDate: "" })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    eventsService.getEventById(Number(resolvedParams.id)).then(ev => {
        setFormData({
            title: ev.title,
            description: ev.description,
            location: ev.location,
            startDate: ev.startDate,
            endDate: ev.endDate
        })
    })
  }, [resolvedParams.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await eventsService.updateEvent(Number(resolvedParams.id), formData as any) //
      toast({ title: "Mis à jour", description: "Vos modifications ont été enregistrées." })
      router.push("/dashboard/guide/events")
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" asChild className="mb-6"><Link href={`/dashboard/guide/events/${resolvedParams.id}`}><ArrowLeft className="mr-2 h-4 w-4"/> Annuler</Link></Button>
      
      <Card className="max-w-2xl mx-auto shadow-lg border-t-4 border-t-pink-500">
        <CardHeader><CardTitle className="text-2xl font-bold">Modifier l'événement</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Lieu</Label>
              <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Début</Label>
                <Input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Fin</Label>
                <Input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={6} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Enregistrer les modifications"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}