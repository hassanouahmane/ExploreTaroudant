"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { placesService } from "@/services/places.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { MapPin, ArrowLeft, CheckCircle, Trash2, Loader2 } from "lucide-react"
import type { Place } from "@/lib/types"

export default function AdminPlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [place, setPlace] = useState<Place | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    placesService.getPlaceById(Number(resolvedParams.id))
      .then(setPlace)
      .finally(() => setLoading(false))
  }, [resolvedParams.id])

  const handleValidate = async () => {
    if (!place) return
    try {
      await placesService.validatePlace(place.id)
      toast({ title: "Succès", description: "Lieu validé et publié." })
      router.push("/dashboard/admin/places")
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" })
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
  if (!place) return <p>Lieu non trouvé</p>

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-3xl">{place.name}</CardTitle>
              <Badge variant={place.status === "ACTIVE" ? "default" : "secondary"}>
                {place.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <img src={place.imageUrl || "/placeholder.jpg"} className="w-full h-80 object-cover rounded-xl" />
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Description</h3>
              <p className="text-muted-foreground whitespace-pre-line">{place.description}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Informations Techniques</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2"><MapPin className="text-primary"/> {place.city}</div>
              <div className="text-sm bg-muted p-3 rounded">
                <p>Latitude : {place.latitude}</p>
                <p>Longitude : {place.longitude}</p>
              </div>
              
              <div className="pt-4 space-y-2">
                {place.status === "PENDING" && (
                  <Button onClick={handleValidate} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle className="mr-2 h-4 w-4" /> Valider le lieu
                  </Button>
                )}
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer définitivement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}