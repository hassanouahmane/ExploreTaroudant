"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { eventsService } from "@/services/events.service"
import { useToast } from "@/hooks/use-toast"
import { Event } from "@/lib/types"
import { Loader2 } from "lucide-react"

export function EditEventModal({ event, isOpen, onClose, onSuccess }: { event: Event, isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({ ...event })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (event) setFormData({ ...event })
  }, [event, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // On prépare un objet propre pour le backend
      const updateData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        // On n'envoie pas proposedBy ici car le service l'ignore ou plante dessus en PUT
      }

      await eventsService.updateEvent(event.id, updateData)
      toast({ title: "Événement mis à jour" })
      onSuccess()
      onClose()
    } catch (error: any) {
      toast({ 
        title: "Erreur", 
        description: error.message || "Échec de la mise à jour", 
        variant: "destructive" 
      })
    } finally { setSubmitting(false) }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Modifier l'événement</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>Lieu / Adresse</Label>
            <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Date de début</Label>
                <Input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
             </div>
             <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
             </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Sauvegarder"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}