"use client"

import { useEffect, useState } from "react"
import { activitiesService } from "@/services/activities.service"
import { guideService } from "@/services/guide.service"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity as ActivityIcon, Plus, Clock, CheckCircle, Search, Loader2, ArrowLeft, Eye, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import type { Activity, User } from "@/lib/types"

export default function GuideActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "PENDING">("ALL")
 
  // Inside GuideActivitiesPage component
const loadMyActivities = async () => {
  try {
    setLoading(true);
    // On utilise notre nouvelle route dédiée qui identifie le guide via son Token
    const data = await activitiesService.getMyActivities();
    setActivities(data);
  } catch (error: any) {
    console.error("Erreur:", error);
    toast({ 
      title: "Erreur de chargement", 
      description: "Impossible de récupérer vos activités.", 
      variant: "destructive" 
    });
  } finally {
    setLoading(false);
  }
};
  useEffect(() => { loadMyActivities() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette activité ?")) return
    try {
      await activitiesService.deleteActivity(id)
      toast({ title: "Supprimé", description: "L'activité a été retirée." })
      loadMyActivities()
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" })
    }
  }
const filtered = activities.filter(a => {
  const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = filterStatus === "ALL" || a.status === filterStatus;
  return matchesSearch && matchesStatus;
});

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/guide"><ArrowLeft className="mr-2 h-4 w-4"/> Retour</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <ActivityIcon className="text-purple-500" /> Mes Activités & Expériences
          </h1>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700 shadow-md">
          <Link href="/dashboard/guide/activities/create">
            <Plus className="mr-2 h-4 w-4" /> Créer une activité
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher une activité..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mb-4">
  <Button variant={filterStatus === "ALL" ? "default" : "outline"} size="sm" onClick={() => setFilterStatus("ALL")}>Toutes</Button>
  <Button variant={filterStatus === "ACTIVE" ? "default" : "outline"} size="sm" className="text-emerald-600" onClick={() => setFilterStatus("ACTIVE")}>Actives</Button>
  <Button variant={filterStatus === "PENDING" ? "default" : "outline"} size="sm" className="text-amber-600" onClick={() => setFilterStatus("PENDING")}>En attente</Button>
</div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Activité</TableHead>
              <TableHead>Lieu lié</TableHead>
              <TableHead>Prix (MAD)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">Aucune activité trouvée.</TableCell></TableRow>
            ) : (
              filtered.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.title}</TableCell>
                  <TableCell>{activity.place?.name || "N/A"}</TableCell>
                  <TableCell>{activity.price} MAD</TableCell>
                 
                    <TableCell>
                      <Badge 
                        variant={activity.status === "ACTIVE" ? "default" : "outline"}
                        className={activity.status === "ACTIVE" 
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                          : "bg-amber-50 text-amber-600 border-amber-200 shadow-sm"}
                      >
                        {activity.status === "ACTIVE" ? (
                          <span className="flex items-center gap-1"><CheckCircle size={12}/> Validé</span>
                        ) : (
                          <span className="flex items-center gap-1"><Clock size={12}/> En attente</span>
                        )}
                      </Badge>
                    </TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/guide/activities/${activity.id}`}><Eye className="h-4 w-4 text-blue-600" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(activity.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
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