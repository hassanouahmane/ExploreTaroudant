"use client"

import { useEffect, useState } from "react"
import { circuitsService } from "@/services/circuits.service"
import { adminService } from "@/services/admin.service"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, CheckCircle, Trash2, Loader2, Map, Clock, Eye, Edit, Plus, ArrowLeft } from "lucide-react"
import type { Circuit, User } from "@/lib/types"
import Link from "next/link"
import { EditCircuitModal } from "./edit-circuit-modal"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export default function CircuitManagementPage() {
  const [circuits, setCircuits] = useState<Circuit[]>([])
  const [guides, setGuides] = useState<User[]>([])
  const [filteredCircuits, setFilteredCircuits] = useState<Circuit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [editingCircuit, setEditingCircuit] = useState<Circuit | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [circuitToDelete, setCircuitToDelete] = useState<number | null>(null)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  const { toast } = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      // On récupère tout via les services admin et public
      const [activeData, pendingData, guidesData] = await Promise.all([
        circuitsService.getActiveCircuits(),
        circuitsService.getPendingCircuits(),
        adminService.getAllGuides()
      ])
      const allCircuits = [...activeData, ...pendingData]
      setCircuits(allCircuits)
      setFilteredCircuits(allCircuits)
      setGuides(guidesData)
    } catch (error) {
      toast({ title: "Erreur", description: "Échec du chargement des circuits", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    const filtered = circuits.filter(c => 
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCircuits(filtered)
  }, [searchTerm, circuits])

  const handleValidate = async (id: number) => {
    try {
      await circuitsService.validateCircuit(id)
      toast({ title: "Circuit validé", description: "L'itinéraire est maintenant public." })
      loadData()
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
  }

  const confirmDelete = async () => {
    if (!circuitToDelete) return
    try {
      await circuitsService.deleteCircuit(circuitToDelete)
      toast({ title: "Supprimé" })
      loadData()
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
    finally { setIsDeleteAlertOpen(false); setCircuitToDelete(null); }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/admin"><ArrowLeft className="mr-2 h-4 w-4"/> Retour Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Gestion des Circuits</h1>
        </div>
        <Button asChild className="bg-orange-600 hover:bg-orange-700 shadow-md">
           <Link href="/dashboard/admin/circuits/create"><Plus className="mr-2 h-4 w-4"/> Nouveau Circuit</Link>
        </Button>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher un itinéraire..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tous ({filteredCircuits.length})</TabsTrigger>
          <TabsTrigger value="pending">En attente ({filteredCircuits.filter(c => c.status === "PENDING").length})</TabsTrigger>
          <TabsTrigger value="active">Validés ({filteredCircuits.filter(c => c.status === "ACTIVE").length})</TabsTrigger>
        </TabsList>

        {["all", "pending", "active"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="rounded-md border bg-card overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Titre du Circuit</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCircuits
                    .filter(c => tab === "all" || c.status === (tab === "pending" ? "PENDING" : "ACTIVE"))
                    .map((circuit) => (
                    <TableRow key={circuit.id} className="hover:bg-muted/5 transition-colors">
                      <TableCell className="font-medium">{circuit.title}</TableCell>
                      <TableCell>{circuit.duration}</TableCell>
                      <TableCell>{circuit.price} MAD</TableCell>
                      <TableCell><Badge variant={circuit.status === 'ACTIVE' ? 'default' : 'secondary'}>{circuit.status}</Badge></TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" asChild title="Détails">
                          <Link href={`/dashboard/admin/circuits/${circuit.id}`}><Eye size={16}/></Link>
                        </Button>
                        <Button size="icon" variant="ghost" title="Modifier" onClick={() => { setEditingCircuit(circuit); setIsEditModalOpen(true); }}>
                          <Edit size={16} className="text-blue-600"/>
                        </Button>
                        {circuit.status === "PENDING" && (
                          <Button size="icon" variant="ghost" title="Valider" onClick={() => handleValidate(circuit.id)}>
                            <CheckCircle size={16} className="text-emerald-600"/>
                          </Button>
                        )}
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          title="Supprimer"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => { setCircuitToDelete(circuit.id); setIsDeleteAlertOpen(true); }}
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

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce circuit ?</AlertDialogTitle>
            <AlertDialogDescription>Cela supprimera l'itinéraire et les réservations associées définitivement.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCircuitToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); confirmDelete(); }} className="bg-destructive text-white hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editingCircuit && (
        <EditCircuitModal 
          circuit={editingCircuit} 
          isOpen={isEditModalOpen} 
          onClose={() => { setIsEditModalOpen(false); setEditingCircuit(null); }} 
          onSuccess={loadData} 
        />
      )}
    </div>
  )
}