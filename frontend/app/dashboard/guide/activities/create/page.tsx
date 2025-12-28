"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { activitiesService } from "@/services/activities.service"
import { placesService } from "@/services/places.service"
import type { Place, Activity } from "@/lib/types"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

function CreateActivityContent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    placeId: "",
  })
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(true) // Ajouté pour gérer l'état du Select
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    placesService.getAllActivePlaces()
      .then(setPlaces)
      .catch(() => {
        toast({ title: "Erreur", description: "Impossible de charger les lieux", variant: "destructive" })
      })
      .finally(() => setIsLoadingPlaces(false))
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.placeId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un lieu", variant: "destructive" })
      return
    }
    
    setIsLoading(true)

    try {
      // Construction de l'objet correspondant au type Activity (sans ID)
      // On utilise Partial<Activity> ou on s'assure que le service accepte cet objet
      const activityPayload: Omit<Activity, "id"> = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: formData.duration,
        place: { id: parseInt(formData.placeId) },
        // Le backend gère le status et le guide via le token
      }

      await activitiesService.createActivity(activityPayload as Activity)

      toast({
        title: "Succès",
        description: "L'activité a été créée et est en attente de validation." 
      })

      router.push("/dashboard/guide")
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Échec de la création",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Le return est maintenant à l'intérieur de la fonction CreateActivityContent
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard/guide">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au dashboard
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Créer une activité</h1>
        <p className="text-muted-foreground">Ajoutez une nouvelle activité pour les touristes</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations sur l&apos;activité</CardTitle>
          <CardDescription>Remplissez les détails de votre activité</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l&apos;activité *</Label>
              <Input
                id="title"
                placeholder="Ex: Visite guidée des remparts"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre activité en détail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                disabled={isLoading}
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (MAD) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="150"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durée *</Label>
                <Input
                  id="duration"
                  placeholder="Ex: 2 heures"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="place">Lieu *</Label>
              <Select
                value={formData.placeId}
                onValueChange={(value) => setFormData({ ...formData, placeId: value })}
                disabled={isLoading || isLoadingPlaces}
              >
                <SelectTrigger id="place">
                  <SelectValue placeholder="Sélectionnez un lieu" />
                </SelectTrigger>
                <SelectContent>
                  {places.map((place) => (
                    <SelectItem key={place.id} value={place.id.toString()}>
                      {place.name} - {place.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer l'activité"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CreateActivityPage() {
  return (
    <ProtectedRoute allowedRoles={["GUIDE"]}>
      <CreateActivityContent />
    </ProtectedRoute>
  )
}