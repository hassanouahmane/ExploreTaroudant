"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { artisansService } from "@/services/artisans.service"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hammer, Loader2, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function GuideEditArtisanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [formData, setFormData] = useState({ name: "", speciality: "", phone: "", city: "" })
  
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    artisansService.getArtisanById(Number(resolvedParams.id))
      .then(art => {
        setFormData({ name: art.name, speciality: art.speciality, phone: art.phone, city: art.city })
        setIsFetching(false)
      })
  }, [resolvedParams.id])

  // Modifiez votre handleSubmit dans app/dashboard/guide/artisans/[id]/edit/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // Indispensable pour éviter le rechargement GET par défaut
  setLoading(true);
  
  const artisanId = Number(resolvedParams.id);
  
  if (!artisanId) {
    toast({ title: "Erreur", description: "ID de l'artisan manquant", variant: "destructive" });
    setLoading(false);
    return;
  }

  try {
    // On appelle explicitement updateArtisan avec l'ID et les données
    await artisansService.updateArtisan(artisanId, formData);
    
    toast({ title: "Succès", description: "Artisan mis à jour et en attente de validation." });
    router.push("/dashboard/guide/artisans");
    router.refresh(); // Force Next.js à rafraîchir les données
  } catch (error: any) {
    toast({ 
      title: "Erreur lors de la modification", 
      description: error.message || "Vérifiez votre connexion au serveur.", 
      variant: "destructive" 
    });
  } finally {
    setLoading(false);
  }
};

  if (isFetching) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" asChild className="mb-6"><Link href="/dashboard/guide/artisans"><ArrowLeft className="mr-2 h-4 w-4"/> Annuler</Link></Button>
      <Card className="max-w-xl mx-auto shadow-lg border-t-4 border-t-orange-500">
        <CardHeader><CardTitle className="text-2xl flex items-center gap-2 font-bold"><Hammer className="text-orange-500" /> Modifier l'Artisan</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom / Atelier</Label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Spécialité</Label>
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
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
              Enregistrer les modifications
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}