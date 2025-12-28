"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { placesService } from "@/services/places.service"
import { useToast } from "@/hooks/use-toast"
import { Place } from "@/lib/types"
import { Loader2 } from "lucide-react"

export function EditPlaceModal({ place, isOpen, onClose, onSuccess }: { place: Place, isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
    const [formData, setFormData] = useState({ ...place })
    const [submitting, setSubmitting] = useState(false)
    const { toast } = useToast()

    // Indispensable pour mettre à jour les champs quand on change de lieu à éditer
    useEffect(() => {
        if (place) setFormData({ ...place })
    }, [place, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            // Envoi des données partielles au service de mise à jour
            await placesService.updatePlace(place.id, {
                name: formData.name,
                description: formData.description,
                city: formData.city,
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude),
                imageUrl: formData.imageUrl
            })
            
            toast({ title: "Lieu mis à jour avec succès" })
            onSuccess() // Rafraîchit la liste parente
            onClose()   // Ferme le modal
        } catch (error) {
            toast({ title: "Erreur", description: "Échec de la mise à jour", variant: "destructive" })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Modifier : {place.name}</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nom du lieu</Label>
                        <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label>Latitude</Label>
                            <Input type="number" step="any" value={formData.latitude} onChange={e => setFormData({...formData, latitude: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Longitude</Label>
                            <Input type="number" step="any" value={formData.longitude} onChange={e => setFormData({...formData, longitude: Number(e.target.value)})} />
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? <Loader2 className="animate-spin mr-2"/> : "Enregistrer les modifications"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}