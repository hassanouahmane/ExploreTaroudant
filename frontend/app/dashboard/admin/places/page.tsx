"use client"

import { useEffect, useState } from "react"
import { placesService } from "@/services/places.service"
import { adminService } from "@/services/admin.service"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, CheckCircle, Trash2, Loader2, MapPin, Clock, Eye, Edit, Plus, ArrowLeft } from "lucide-react"
import type { Place, User } from "@/lib/types"
import Link from "next/link"
import { EditPlaceModal } from "./edit-place-modal" // Import local corrigé
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

export default function PlaceManagementPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [guides, setGuides] = useState<User[]>([])
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGuideId, setSelectedGuideId] = useState<string>("all")
  
  const [editingPlace, setEditingPlace] = useState<Place | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const [placeToDelete, setPlaceToDelete] = useState<number | null>(null)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  const { toast } = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      const [placesData, guidesData] = await Promise.all([
        placesService.getAllPlacesForAdmin(),
        adminService.getAllGuides()
      ])
      setPlaces(placesData)
      setFilteredPlaces(placesData)
      setGuides(guidesData)
    } catch (error) {
      toast({ title: "Erreur", description: "Chargement échoué", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    const filtered = places.filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           place.city.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGuide = selectedGuideId === "all" || place.proposedBy?.id === Number(selectedGuideId)
      return matchesSearch && matchesGuide
    })
    setFilteredPlaces(filtered)
  }, [searchTerm, selectedGuideId, places])

  const handleValidate = async (id: number) => {
    try {
      await placesService.validatePlace(id)
      toast({ title: "Succès", description: "Lieu validé" })
      loadData()
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
  }

  // APPEL DU BACKEND POUR SUPPRESSION PAR ID
  const confirmDelete = async () => {
    if (!placeToDelete) return
    try {
      await placesService.deletePlace(placeToDelete)
      toast({ title: "Supprimé", description: "Lieu supprimé de la base." })
      loadData()
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer ce lieu", variant: "destructive" })
    } finally {
      setIsDeleteAlertOpen(false)
      setPlaceToDelete(null)
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/admin"><ArrowLeft className="mr-2 h-4 w-4"/> Retour Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Gestion du Patrimoine</h1>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
           <Link href="/dashboard/admin/places/create"><Plus className="mr-2 h-4 w-4"/> Ajouter un Lieu</Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un monument..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedGuideId} onValueChange={setSelectedGuideId}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Filtrer par Guide" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les guides / Admin</SelectItem>
            {guides.map(guide => (
              <SelectItem key={guide.id} value={guide.id.toString()}>{guide.fullName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tous ({filteredPlaces.length})</TabsTrigger>
          <TabsTrigger value="pending">En attente ({filteredPlaces.filter(p => p.status === "PENDING").length})</TabsTrigger>
          <TabsTrigger value="active">Validés ({filteredPlaces.filter(p => p.status === "ACTIVE").length})</TabsTrigger>
        </TabsList>

        {["all", "pending", "active"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="rounded-md border bg-card overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Proposé par</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlaces
                    .filter(p => tab === "all" || p.status === (tab === "pending" ? "PENDING" : "ACTIVE"))
                    .map((place) => (
                    <TableRow key={place.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                           <img src={place.imageUrl || "/images/placeholder-place.jpg"} className="w-10 h-10 rounded object-cover" />
                           {place.name}
                        </div>
                      </TableCell>
                      <TableCell>{place.city}</TableCell>
                      <TableCell className="text-xs">{place.proposedBy?.fullName || "Admin"}</TableCell>
                      <TableCell><Badge variant={place.status === 'ACTIVE' ? 'default' : 'secondary'}>{place.status}</Badge></TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" asChild><Link href={`/dashboard/admin/places/${place.id}`}><Eye size={16}/></Link></Button>
                        <Button size="icon" variant="ghost" onClick={() => { setEditingPlace(place); setIsEditModalOpen(true); }}><Edit size={16} className="text-blue-600"/></Button>
                        {place.status === "PENDING" && <Button size="icon" variant="ghost" onClick={() => handleValidate(place.id)}><CheckCircle size={16} className="text-emerald-600"/></Button>}
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-destructive"
                          onClick={() => {
                            setPlaceToDelete(place.id)
                            setIsDeleteAlertOpen(true)
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Suppression moderne avec AlertDialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer ce lieu ? Cette action supprimera également les activités liées en base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPlaceToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editingPlace && (
        <EditPlaceModal 
          place={editingPlace} 
          isOpen={isEditModalOpen} 
          onClose={() => {
             setIsEditModalOpen(false);
             setEditingPlace(null);
          }} 
          onSuccess={loadData} 
        />
      )}
    </div>
  )
}