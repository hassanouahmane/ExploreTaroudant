"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { activitiesService } from "@/services/activities.service"
import { useToast } from "@/hooks/use-toast"
import { Activity } from "@/lib/types"
import { Loader2 } from "lucide-react"

export function EditActivityModal({ activity, isOpen, onClose, onSuccess }: { activity: Activity, isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  // On initialise avec les données existantes
  const [formData, setFormData] = useState({ ...activity })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (activity) {
      setFormData({ ...activity })
    }
  }, [activity, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // CORRECTION: Préparation des données pour le backend
      // On extrait uniquement ce qui est nécessaire pour éviter les conflits d'objets imbriqués
      const updateData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        duration: formData.duration,
        // On envoie l'ID du lieu pour la relation ManyToOne
        placeId: activity.placeId || activity.place?.id 
      }

      await activitiesService.updateActivity(activity.id, updateData as any)
      
      toast({ title: "Succès", description: "L'activité a été mise à jour." })
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Update error:", error)
      toast({ 
        title: "Erreur", 
        description: error.message || "Échec de la mise à jour", 
        variant: "destructive" 
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier l'activité : {activity?.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows={4} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Prix (MAD)</Label>
                <Input 
                  type="number" 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                />
             </div>
             <div className="space-y-2">
                <Label>Durée</Label>
                <Input 
                  value={formData.duration} 
                  onChange={e => setFormData({...formData, duration: e.target.value})} 
                />
             </div>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {submitting ? "Mise à jour..." : "Sauvegarder les modifications"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}