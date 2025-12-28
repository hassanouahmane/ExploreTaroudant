"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { placesService } from "@/services/places.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminCreatePlacePage() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        city: "Taroudant",
        latitude: "",
        longitude: "",
        imageUrl: ""
    })
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            // Utilisation du service de création de lieu
            await placesService.createPlace({
                name: formData.name,
                description: formData.description,
                city: formData.city,
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude),
                imageUrl: formData.imageUrl,
                status: "ACTIVE" // L'admin crée des lieux directement actifs
            } as any)
            
            toast({ title: "Lieu ajouté avec succès !" })
            router.push("/dashboard/admin/places")
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Button variant="ghost" asChild className="mb-6">
                <Link href="/dashboard/admin/places"><ArrowLeft className="mr-2 h-4 w-4"/> Retour</Link>
            </Button>
            <Card className="max-w-2xl mx-auto">
                <CardHeader><CardTitle>Ajouter un nouveau lieu historique</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom du lieu</Label>
                            <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" required rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input id="latitude" type="number" step="any" required value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="longitude">Longitude</Label>
                                <Input id="longitude" type="number" step="any" required value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">URL de l'image</Label>
                            <Input id="imageUrl" placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                        </div>
                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2"/> : "Enregistrer le lieu"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}