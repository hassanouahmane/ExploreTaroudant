"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { eventsService } from "@/services/events.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminCreateEventPage() {
  const [formData, setFormData] = useState({ title: "", description: "", startDate: "", endDate: "", location: "" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await eventsService.createEvent({
        ...formData,
        status: "ACTIVE" // L'admin crée directement en actif
      } as any)
      toast({ title: "Événement créé avec succès !" })
      router.push("/dashboard/admin/events")
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
    finally { setLoading(false) }
  }

  return (
    <div className="container mx-auto py-10">
      <Button variant="ghost" asChild className="mb-6"><Link href="/dashboard/admin/events"><ArrowLeft className="mr-2 h-4 w-4"/> Retour</Link></Button>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="bg-purple-50"><CardTitle>Diffuser un nouvel événement</CardTitle></CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Titre de l'événement</Label><Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2"><Label>Date de début</Label><Input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} /></div>
               <div className="space-y-2"><Label>Date de fin</Label><Input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} /></div>
            </div>
            <div className="space-y-2"><Label>Lieu précis</Label><Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>{loading ? <Loader2 className="animate-spin mr-2"/> : "Publier l'événement"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}