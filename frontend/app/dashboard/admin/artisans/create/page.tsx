"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { artisansService } from "@/services/artisans.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2, Hammer } from "lucide-react"
import Link from "next/link"

export default function AdminCreateArtisanPage() {
  const [formData, setFormData] = useState({ name: "", speciality: "", phone: "", city: "Taroudant" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await artisansService.createArtisan(formData)
      toast({ title: "Artisan ajouté !", description: "Le profil a été créé avec succès." })
      router.push("/dashboard/admin/artisans")
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
    finally { setLoading(false) }
  }

  return (
    <div className="container mx-auto py-10">
      <Button variant="ghost" asChild className="mb-6"><Link href="/dashboard/admin/artisans"><ArrowLeft className="mr-2 h-4 w-4"/> Retour</Link></Button>
      <Card className="max-w-xl mx-auto shadow-lg border-t-4 border-t-amber-600">
        <CardHeader className="flex flex-row items-center gap-3 bg-amber-50/50">
          <Hammer className="text-amber-600" />
          <CardTitle>Nouveau Profil Artisan</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Nom complet de l'artisan / Coopérative</Label><Input placeholder="ex: Maître Ahmed le Tanneur" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            <div className="space-y-2"><Label>Spécialité / Métier</Label><Input placeholder="ex: Maroquinerie, Bijoux, Tissage" required value={formData.speciality} onChange={e => setFormData({...formData, speciality: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2"><Label>Téléphone</Label><Input placeholder="06..." required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
               <div className="space-y-2"><Label>Ville / Secteur</Label><Input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} /></div>
            </div>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={loading}>{loading ? <Loader2 className="animate-spin mr-2"/> : "Enregistrer l'artisan"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}