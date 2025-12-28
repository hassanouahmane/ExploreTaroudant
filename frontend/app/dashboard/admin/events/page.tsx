"use client"

import { useEffect, useState } from "react"
import { eventsService } from "@/services/events.service"
import { adminService } from "@/services/admin.service"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, CheckCircle, Trash2, Loader2, Calendar, Clock, Eye, Edit, Plus, ArrowLeft } from "lucide-react"
import type { Event, User } from "@/lib/types"
import Link from "next/link"
import { EditEventModal } from "./edit-event-modal"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export default function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<number | null>(null)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  const { toast } = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await eventsService.getAllEventsForAdmin()
      setEvents(data)
      setFilteredEvents(data)
    } catch (error) {
      toast({ title: "Erreur", description: "Chargement des événements échoué", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    const filtered = events.filter(ev => 
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEvents(filtered)
  }, [searchTerm, events])

  const handleValidate = async (id: number) => {
    try {
      await eventsService.validateEvent(id)
      toast({ title: "Événement publié", description: "L'événement est désormais visible sur l'agenda." })
      loadData()
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
  }

  const confirmDelete = async () => {
    if (!eventToDelete) return
    try {
      await eventsService.deleteEvent(eventToDelete)
      toast({ title: "Supprimé" })
      loadData()
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
    finally { setIsDeleteAlertOpen(false); setEventToDelete(null); }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/admin"><ArrowLeft className="mr-2 h-4 w-4"/> Retour Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Agenda Culturel</h1>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700 shadow-md">
           <Link href="/dashboard/admin/events/create"><Plus className="mr-2 h-4 w-4"/> Nouvel Événement</Link>
        </Button>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher un événement (Moussem, Festival, Exposition...)" 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">Tous ({filteredEvents.length})</TabsTrigger>
          <TabsTrigger value="pending">En attente ({filteredEvents.filter(e => e.status === "PENDING").length})</TabsTrigger>
          <TabsTrigger value="active">Validés ({filteredEvents.filter(e => e.status === "ACTIVE").length})</TabsTrigger>
        </TabsList>

        {["all", "pending", "active"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="rounded-md border bg-card shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Événement</TableHead>
                    <TableHead>Date de début</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents
                    .filter(e => tab === "all" || e.status === (tab === "pending" ? "PENDING" : "ACTIVE"))
                    .map((event) => (
                    <TableRow key={event.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{new Date(event.startDate).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell><Badge variant={event.status === 'ACTIVE' ? 'default' : 'secondary'}>{event.status}</Badge></TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" asChild title="Détails">
                          <Link href={`/dashboard/admin/events/${event.id}`}><Eye size={16}/></Link>
                        </Button>
                        <Button size="icon" variant="ghost" title="Modifier" onClick={() => { setEditingEvent(event); setIsEditModalOpen(true); }}>
                          <Edit size={16} className="text-blue-600"/>
                        </Button>
                        {event.status === "PENDING" && (
                          <Button size="icon" variant="ghost" title="Valider" onClick={() => handleValidate(event.id)}>
                            <CheckCircle size={16} className="text-emerald-600"/>
                          </Button>
                        )}
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          title="Supprimer"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => { setEventToDelete(event.id); setIsDeleteAlertOpen(true); }}
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
            <AlertDialogTitle>Supprimer cet événement ?</AlertDialogTitle>
            <AlertDialogDescription>L'événement sera retiré de l'agenda public de Taroudant.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); confirmDelete(); }} className="bg-destructive text-white hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editingEvent && (
        <EditEventModal 
          event={editingEvent} 
          isOpen={isEditModalOpen} 
          onClose={() => { setIsEditModalOpen(false); setEditingEvent(null); }} 
          onSuccess={loadData} 
        />
      )}
    </div>
  )
}