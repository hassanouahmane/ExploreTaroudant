"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { artisansService } from "@/services/artisans.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft, 
  CheckCircle, 
  Trash2, 
  MapPin, 
  Phone, 
  User, 
  Loader2,
  Hammer
} from "lucide-react"
import type { Artisan } from "@/lib/types"

export default function AdminArtisanDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [artisan, setArtisan] = useState<Artisan | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Note: Si vous n'avez pas de getById dans votre service artisan, 
    // vous pouvez utiliser getAll et filtrer, ou ajouter l'endpoint au backend.
    const fetchArtisan = async () => {
      try {
        const data = await artisansService.getAllActiveArtisans() // Ou un service dédié
        const found = data.find(a => a.id === Number(resolvedParams.id))
        setArtisan(found || null)
      } catch (error) {
        toast({ title: "Erreur", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchArtisan()
  }, [resolvedParams.id, toast])

  const handleValidate = async () => {
    if (!artisan) return
    try {
      await artisansService.validateArtisan(artisan.id)
      toast({ title: "Validé", description: "L'artisan est désormais actif." })
      router.push("/dashboard/admin/artisans")
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
  if (!artisan) return <div className="p-10 text-center">Artisan introuvable</div>

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full">
               <Hammer className="h-8 w-8 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <CardTitle className="text-3xl font-extrabold">{artisan.name}</CardTitle>
                <Badge variant={artisan.status === "ACTIVE" ? "default" : "secondary"}>{artisan.status}</Badge>
              </div>
              <p className="text-amber-700 font-medium">{artisan.speciality}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Phone className="text-blue-500 h-6 w-6" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Contact</p>
                  <p className="font-semibold">{artisan.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <MapPin className="text-red-500 h-6 w-6" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Ville / Zone</p>
                  <p className="font-semibold">{artisan.city}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-amber-100 bg-amber-50/30">
            <CardHeader><CardTitle className="text-lg">Décision Admin</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {artisan.status === "PENDING" && (
                <Button onClick={handleValidate} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle className="mr-2 h-4 w-4" /> Approuver le profil
                </Button>
              )}
              <Button variant="destructive" className="w-full" onClick={() => {
                if(confirm("Supprimer définitivement cet artisan ?")) {
                   artisansService.deleteArtisan(artisan.id).then(() => router.push("/dashboard/admin/artisans"))
                }
              }}>
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}