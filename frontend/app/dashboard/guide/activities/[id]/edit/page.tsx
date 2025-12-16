"use client"

import type React from "react"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { activitiesService } from "@/services/activities.service"
import { placesService } from "@/services/places.service"
import type { Place, Activity } from "@/lib/types"
import { Loader2, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"

function EditActivityContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [activity, setActivity] = useState<Activity | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    placeId: "",
  })
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activityId = Number.parseInt(resolvedParams.id)

        const [activityData, placesData] = await Promise.all([
          activitiesService.getActivityById(activityId),
          placesService.getAllPlaces(),
        ])

        setActivity(activityData)
        setPlaces(placesData)
        setFormData({
          title: activityData.title,
          description: activityData.description,
          price: activityData.price.toString(),
          duration: activityData.duration,
          placeId: activityData.placeId.toString(),
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'activité",
          variant: "destructive",
        })
        router.push("/dashboard/guide")
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [resolvedParams.id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!activity) return

    setIsLoading(true)

    try {
      await activitiesService.updateActivity(activity.id, {
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        duration: formData.duration,
        placeId: Number.parseInt(formData.placeId),
      })

      toast({
        title: "Activité mise à jour",
        description: "Votre activité a été modifiée avec succès",
      })

      router.push("/dashboard/guide")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'activité",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!activity) return

    setIsDeleting(true)

    try {
      await activitiesService.deleteActivity(activity.id)

      toast({
        title: "Activité supprimée",
        description: "Votre activité a été supprimée avec succès",
      })

      router.push("/dashboard/guide")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'activité",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard/guide">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au dashboard
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Modifier l&apos;activité</h1>
            <p className="text-muted-foreground">Mettez à jour les détails de votre activité</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. L&apos;activité sera définitivement supprimée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations sur l&apos;activité</CardTitle>
          <CardDescription>Modifiez les détails de votre activité</CardDescription>
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
                disabled={isLoading}
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
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour"
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

export default function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute allowedRoles={["GUIDE"]}>
      <EditActivityContent params={params} />
    </ProtectedRoute>
  )
}
