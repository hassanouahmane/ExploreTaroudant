"use client"

import { useEffect, useState } from "react"
import { activitiesService } from "@/services/activities.service"
import { adminService } from "@/services/admin.service"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// On renomme l'icône Activity en ActivityIcon pour éviter le conflit
import { Search, CheckCircle, Trash2, Loader2, Clock, Eye, Edit, Plus, ArrowLeft, Activity as ActivityIcon } from "lucide-react"
import type { Activity, User } from "@/lib/types"
import Link from "next/link"
import { EditActivityModal } from "./edit-activity-modal"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export default function ActivityManagementPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [guides, setGuides] = useState<User[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGuideId, setSelectedGuideId] = useState<string>("all")
  
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  const { toast } = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      const [activitiesData, guidesData] = await Promise.all([
        activitiesService.getAllActivities(),
        adminService.getAllGuides()
      ])
      setActivities(activitiesData)
      setFilteredActivities(activitiesData)
      setGuides(guidesData)
    } catch (error) {
      toast({ title: "Erreur", description: "Chargement échoué", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    const filtered = activities.filter(act => {
      const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase())
      // Vérification du guide via l'objet imbriqué
      const matchesGuide = selectedGuideId === "all" || act.guide?.id === Number(selectedGuideId)
      return matchesSearch && matchesGuide
    })
    setFilteredActivities(filtered)
  }, [searchTerm, selectedGuideId, activities])

  const handleValidate = async (id: number) => {
    try {
      await activitiesService.validateActivity(id)
      toast({ title: "Succès", description: "L'activité a été activée." })
      loadData()
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
  }

  const confirmDelete = async () => {
    if (!activityToDelete) return
    try {
      await activitiesService.deleteActivity(activityToDelete)
      toast({ title: "Supprimée" })
      loadData()
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
    finally { setIsDeleteAlertOpen(false); setActivityToDelete(null); }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/admin"><ArrowLeft className="mr-2 h-4 w-4"/> Retour Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Activités</h1>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 shadow-md">
           <Link href="/dashboard/admin/activities/create"><Plus className="mr-2 h-4 w-4"/> Nouvelle Activité</Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher une activité..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedGuideId} onValueChange={setSelectedGuideId}>
          <SelectTrigger className="w-full md:w-[250px]"><SelectValue placeholder="Par Guide" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les guides</SelectItem>
            {guides.map(g => <SelectItem key={g.id} value={g.id.toString()}>{g.fullName}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tous ({filteredActivities.length})</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="active">Actives</TabsTrigger>
        </TabsList>

        {["all", "pending", "active"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Activité</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Guide</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities
                    .filter(a => tab === "all" || a.status === (tab === "pending" ? "PENDING" : "ACTIVE"))
                    .map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.title}</TableCell>
                      <TableCell>{activity.price} MAD</TableCell>
                      <TableCell className="text-xs">{activity.guide?.user?.fullName || "Administrateur"}</TableCell>
                      <TableCell><Badge variant={activity.status === 'ACTIVE' ? 'default' : 'secondary'}>{activity.status}</Badge></TableCell>
                      <TableCell className="text-right space-x-1">
                        {/* On pointe vers la page de détails ADMIN pour inspection */}
                        <Button size="icon" variant="ghost" asChild title="Inspecter">
                          <Link href={`/dashboard/admin/activities/${activity.id}`}><Eye size={16}/></Link>
                        </Button>
                        <Button size="icon" variant="ghost" title="Modifier" onClick={() => { setEditingActivity(activity); setIsEditModalOpen(true); }}>
                          <Edit size={16} className="text-blue-600"/>
                        </Button>
                        {activity.status === "PENDING" && (
                          <Button size="icon" variant="ghost" title="Valider" onClick={() => handleValidate(activity.id)}>
                            <CheckCircle size={16} className="text-emerald-600"/>
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" title="Supprimer" onClick={() => { setActivityToDelete(activity.id); setIsDeleteAlertOpen(true); }}>
                          <Trash2 size={16} className="text-destructive"/>
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
            <AlertDialogTitle>Supprimer cette activité ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action supprimera définitivement l'offre du catalogue public.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setActivityToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); confirmDelete(); }} 
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editingActivity && (
        <EditActivityModal 
          activity={editingActivity} 
          isOpen={isEditModalOpen} 
          onClose={() => { setIsEditModalOpen(false); setEditingActivity(null); }} 
          onSuccess={loadData} 
        />
      )}
    </div>
  )
}