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
  Eye 
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
  const { toast } = useToast()

  // États pour la suppression
  const [artisanToDelete, setArtisanToDelete] = useState<number | null>(null)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [active, pending] = await Promise.all([
        artisansService.getAllActiveArtisans(),
        artisansService.getPendingArtisans()
      ])
      setArtisans([...pending, ...active])
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les données", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const filteredArtisans = artisans.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleValidate = async (id: number) => {
    try {
      await artisansService.validateArtisan(id)
      toast({ title: "Succès", description: "Artisan validé" })
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

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" asChild><Link href="/dashboard/admin"><ArrowLeft className="mr-2"/> Retour</Link></Button>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Artisans</h1>
        <Button asChild className="bg-amber-600 hover:bg-amber-700"><Link href="/dashboard/admin/artisans/create"><Plus className="mr-2"/> Ajouter</Link></Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Rechercher un artisan ou une spécialité..." 
          className="pl-10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Spécialité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArtisans.map((artisan) => (
              <TableRow key={artisan.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="font-medium">{artisan.name}</TableCell>
                <TableCell>{artisan.speciality}</TableCell>
                <TableCell>
                  <Badge variant={artisan.status === "ACTIVE" ? "default" : "secondary"}>
                    {artisan.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* BOUTON DÉTAILS */}
                    <Button size="icon" variant="ghost" asChild title="Voir les détails">
                      <Link href={`/dashboard/admin/artisans/${artisan.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>

                    {artisan.status === "PENDING" && (
                      <Button size="icon" variant="ghost" className="text-emerald-600 hover:bg-emerald-50" onClick={() => handleValidate(artisan.id)} title="Valider">
                        <CheckCircle className="h-4 w-4"/>
                      </Button>
                    )}

                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-destructive hover:bg-destructive/10" 
                      onClick={() => {
                        setArtisanToDelete(artisan.id)
                        setIsDeleteAlertOpen(true)
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODAL DE CONFIRMATION DE SUPPRESSION */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet artisan ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setArtisanToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}