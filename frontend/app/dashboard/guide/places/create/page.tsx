"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { placesService } from "@/services/places.service"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, MapPin } from "lucide-react"
import Link from "next/link"

export default function GuideCreatePlacePage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "Taroudant",
    address: "",
    category: ""
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await placesService.createPlace(formData as any)
      toast({ 
        title: "Succès !", 
        description: "Votre lieu a été soumis pour validation à l'administrateur." 
      })
      router.push("/dashboard/guide/places")
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la création", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard/guide/places">
          <ArrowLeft className="mr-2 h-4 w-4"/> Retour à la liste
        </Link>
      </Button>

      <Card className="max-w-2xl mx-auto shadow-lg border-t-4 border-t-emerald-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-full">
              <MapPin className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Proposer un nouveau lieu</CardTitle>
              <CardDescription>Décrivez un monument ou un site historique de Taroudant.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du lieu</Label>
              <Input 
                id="name" 
                placeholder="ex: Palais Salam, Remparts Sud..." 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville / Secteur</Label>
                <Input 
                  id="city" 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input 
                  id="category" 
                  placeholder="ex: Monument, Restaurant, Parc"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse précise</Label>
              <Input 
                id="address" 
                required 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description historique / touristique</Label>
              <Textarea 
                id="description" 
                rows={5} 
                placeholder="Partagez l'histoire ou les détails importants de ce lieu..."
                required 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Envoyer pour validation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}