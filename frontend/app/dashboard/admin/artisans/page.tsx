"use client"

import { useEffect, useState } from "react"
import { artisansService } from "@/services/artisans.service"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  CheckCircle, 
  Trash2, 
  Loader2, 
  Plus, 
  ArrowLeft, 
  Eye,
  Filter
} from "lucide-react"
import type { Artisan } from "@/lib/types"
import Link from "next/link"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"

export default function ArtisanManagementPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  // Nouvel état pour le filtrage par statut
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "PENDING">("ALL")
  
  const { toast } = useToast()

  const [artisanToDelete, setArtisanToDelete] = useState<number | null>(null)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      // On utilise l'endpoint /all que vous avez ajouté au backend
      const data = await artisansService.getAllArtisans()
      setArtisans(data)
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les artisans", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // Filtrage combiné (Recherche + Statut)
  const filteredArtisans = artisans.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.speciality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  })

  const handleValidate = async (id: number) => {
    try {
      await artisansService.validateArtisan(id)
      toast({ title: "Succès", description: "Artisan validé avec succès" })
      loadData()
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
  }

  const confirmDelete = async () => {
    if (!artisanToDelete) return
    try {
      await artisansService.deleteArtisan(artisanToDelete)
      toast({ title: "Supprimé", description: "L'artisan a été retiré." })
      loadData()
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" })
    } finally {
      setIsDeleteAlertOpen(false)
      setArtisanToDelete(null)
    }
  }

  if (loading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-amber-600" /></div>

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/admin"><ArrowLeft className="mr-2 h-4 w-4"/> Retour Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Modération des Artisans</h1>
        </div>
        <Button asChild className="bg-amber-600 hover:bg-amber-700 shadow-md">
          <Link href="/dashboard/admin/artisans/create"><Plus className="mr-2 h-4 w-4"/> Ajouter un artisan</Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-slate-50 p-4 rounded-xl border">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Rechercher par nom ou spécialité..." 
            className="pl-10 bg-white" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
            <Filter size={12} /> Filtrer par statut
          </label>
          <div className="flex gap-1 bg-white border rounded-lg p-1">
            <Button 
              variant={statusFilter === "ALL" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setStatusFilter("ALL")}
              className="h-8"
            >
              Tous
            </Button>
            <Button 
              variant={statusFilter === "ACTIVE" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setStatusFilter("ACTIVE")}
              className="h-8 text-emerald-600"
            >
              Actifs
            </Button>
            <Button 
              variant={statusFilter === "PENDING" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setStatusFilter("PENDING")}
              className="h-8 text-amber-600"
            >
              En attente
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Artisan</TableHead>
              <TableHead className="font-bold">Spécialité</TableHead>
              <TableHead className="font-bold text-center">Statut</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArtisans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">
                  Aucun artisan ne correspond à vos critères.
                </TableCell>
              </TableRow>
            ) : (
              filteredArtisans.map((artisan) => (
                <TableRow key={artisan.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-semibold text-slate-900">{artisan.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                      {artisan.speciality}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      className={artisan.status === "ACTIVE" 
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                        : "bg-amber-100 text-amber-700 border-amber-200"}
                    >
                      {artisan.status === "ACTIVE" ? "Vérifié" : "En attente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline" className="h-8 w-8 text-blue-600 border-blue-100 hover:bg-blue-50" asChild>
                        <Link href={`/dashboard/admin/artisans/${artisan.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

                      {artisan.status === "PENDING" && (
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-8 w-8 text-emerald-600 border-emerald-100 hover:bg-emerald-50" 
                          onClick={() => handleValidate(artisan.id)}
                        >
                          <CheckCircle className="h-4 w-4"/>
                        </Button>
                      )}

                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-8 w-8 text-destructive border-red-100 hover:bg-red-50" 
                        onClick={() => {
                          setArtisanToDelete(artisan.id)
                          setIsDeleteAlertOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL DE CONFIRMATION DE SUPPRESSION */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Supprimer l'artisan ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive. L'artisan sera retiré du patrimoine de la plateforme ExploreTaroudant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setArtisanToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}