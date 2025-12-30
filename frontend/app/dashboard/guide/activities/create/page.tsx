"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { activitiesService } from "@/services/activities.service"
import { placesService } from "@/services/places.service"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Activity as ActivityIcon } from "lucide-react"
import Link from "next/link"
import type { Place } from "@/lib/types"

export default function GuideCreateActivityPage() {
  const [loading, setLoading] = useState(false)
  const [places, setPlaces] = useState<Place[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    placeId: ""
  })
  
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    placesService.getAllActivePlaces().then(setPlaces)
  }, [])

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const activityData = {
      title: formData.title,
      description: formData.description,
      // Conversion propre pour BigDecimal
      price: Number(formData.price), 
      duration: formData.duration,
      // On n'envoie que l'ID minimal
      place: { 
        id: parseInt(formData.placeId) 
      }
    };

    console.log("Envoi activité :", activityData);

    await activitiesService.createActivity(activityData as any);
    
    toast({ title: "Succès", description: "Activité créée et en attente de validation." });
    router.push("/dashboard/guide/activities");
  } catch (error: any) {
    // Affiche le message exact du backend (ex: "Lieu introuvable")
    toast({ 
      title: "Erreur", 
      description: error.message || "Vérifiez les champs.", 
      variant: "destructive" 
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" asChild className="mb-6"><Link href="/dashboard/guide/activities"><ArrowLeft className="mr-2 h-4 w-4"/> Retour</Link></Button>
      
      <Card className="max-w-2xl mx-auto shadow-lg border-t-4 border-t-purple-500">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ActivityIcon className="text-purple-500" /> Nouvelle Expérience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Titre de l'expérience</Label>
              <Input placeholder="ex: Atelier Poterie Traditionnelle" required 
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prix (MAD)</Label>
                <Input type="number" required value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Durée</Label>
                <Input placeholder="ex: 2 heures" required value={formData.duration} 
                  onChange={e => setFormData({...formData, duration: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lieu du patrimoine lié</Label>
              <Select onValueChange={(value) => setFormData({...formData, placeId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un lieu historique" />
                </SelectTrigger>
                <SelectContent>
                  {places.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description détaillée</Label>
              <Textarea rows={5} placeholder="Décrivez le programme de l'activité..." required 
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Créer l'activité"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}