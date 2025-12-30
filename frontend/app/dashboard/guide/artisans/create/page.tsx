"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { artisansService } from "@/services/artisans.service"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hammer, Loader2 } from "lucide-react"

export default function GuideCreateArtisanPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: "", speciality: "", phone: "", city: "Taroudant" })
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await artisansService.createArtisan(formData)
      toast({ title: "Succès", description: "Artisan soumis à la validation de l'admin." })
      router.push("/dashboard/guide/artisans")
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-xl mx-auto shadow-lg border-t-4 border-t-orange-500">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2"><Hammer className="text-orange-500" /> Suggérer un Artisan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom / Atelier</Label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Spécialité (ex: Poterie, Cuir, Bijoux)</Label>
              <Input required value={formData.speciality} onChange={e => setFormData({...formData, speciality: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Ville</Label>
                <Input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
            </div>
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Soumettre l'artisan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}