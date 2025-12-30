"use client"

import { useEffect, useState } from "react"
import { artisansService } from "@/services/artisans.service"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Hammer, Plus, Clock, CheckCircle, Search, Loader2, ArrowLeft, Eye, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import type { Artisan } from "@/lib/types"

export default function GuideArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Charge tous les artisans (Actifs + En attente) pour le guide
  const loadArtisans = async () => {
    try {
      setLoading(true)
      // Appel à l'endpoint /api/artisans/all configuré dans le service
      const data = await artisansService.getAllArtisans() 
      setArtisans(data)
    } catch (error: any) {
      toast({ 
        title: "Erreur de chargement", 
        description: "Impossible de récupérer la liste des artisans.", 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadArtisans() }, [])

  // Filtrage local par recherche
  const filtered = artisans.filter(art => 
    art.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-orange-500" />
    </div>
  )

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header avec Navigation et Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 text-orange-700 hover:bg-orange-50">
            <Link href="/dashboard/guide"><ArrowLeft className="mr-2 h-4 w-4"/> Retour Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-black flex items-center gap-2 text-slate-800">
            <Hammer className="text-orange-500" size={32} /> Patrimoine Artisanal
          </h1>
          <p className="text-muted-foreground text-sm">Consultez et suggérez des maîtres artisans locaux</p>
        </div>
        <Button asChild className="bg-orange-600 hover:bg-orange-700 shadow-lg transition-transform active:scale-95">
          <Link href="/dashboard/guide/artisans/create">
            <Plus className="mr-2 h-4 w-4" /> Suggérer un artisan
          </Link>
        </Button>
      </div>

      {/* Barre de Recherche */}
      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
        <Input 
          placeholder="Rechercher par nom ou spécialité..." 
          className="pl-10 border-slate-200 focus-visible:ring-orange-500" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {/* Tableau des Artisans */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="font-bold text-slate-700">Nom / Atelier</TableHead>
              <TableHead className="font-bold text-slate-700">Spécialité</TableHead>
              <TableHead className="font-bold text-slate-700">Localisation</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Statut</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic bg-slate-50/30">
                  Aucun artisan trouvé dans le patrimoine.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((art) => (
                <TableRow key={art.id} className="hover:bg-orange-50/30 transition-colors group">
                  <TableCell className="font-bold text-slate-800">{art.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">
                      {art.speciality}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{art.city}</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={art.status === 'ACTIVE' 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"}
                    >
                      {art.status === 'ACTIVE' ? (
                        <span className="flex items-center gap-1.5"><CheckCircle size={14}/> Vérifié</span>
                      ) : (
                        <span className="flex items-center gap-1.5"><Clock size={14}/> En attente</span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* BOUTON VOIR (Optionnel si vous créez une page de détails) */}
                      <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 border-blue-100 hover:bg-blue-50" asChild>
                        <Link href={`/dashboard/guide/artisans/${art.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      {/* BOUTON MODIFIER - Utilise la route dynamique */}
                      <Button variant="outline" size="icon" className="h-8 w-8 text-orange-600 border-orange-100 hover:bg-orange-50" asChild>
                        <Link href={`/dashboard/guide/artisans/${art.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}