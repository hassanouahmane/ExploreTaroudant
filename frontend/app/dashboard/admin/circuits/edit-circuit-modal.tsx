"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { circuitsService } from "@/services/circuits.service"
import { useToast } from "@/hooks/use-toast"
import { Circuit } from "@/lib/types"
import { Loader2 } from "lucide-react"

export function EditCircuitModal({ circuit, isOpen, onClose, onSuccess }: { circuit: Circuit, isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({ ...circuit })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (circuit) setFormData({ ...circuit })
  }, [circuit, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await circuitsService.updateCircuit(circuit.id, {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        price: Number(formData.price)
      })
      toast({ title: "Circuit mis à jour" })
      onSuccess()
      onClose()
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" })
    } finally { setSubmitting(false) }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Modifier l'itinéraire</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Titre du circuit</Label><Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2"><Label>Prix (MAD)</Label><Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} /></div>
             <div className="space-y-2"><Label>Durée</Label><Input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} /></div>
          </div>
          <div className="space-y-2"><Label>Description détaillée</Label><Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={5} /></div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Enregistrer les modifications"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}