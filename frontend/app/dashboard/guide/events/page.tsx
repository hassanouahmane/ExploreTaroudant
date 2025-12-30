"use client"

import { useEffect, useState } from "react"
import { eventsService } from "@/services/events.service"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle, 
  Search, 
  Loader2, 
  ArrowLeft, 
  Eye, 
  MapPin, 
  Edit,
  Trash2 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import type { Event } from "@/lib/types"

export default function GuideEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const loadMyEvents = async () => {
    try {
      setLoading(true)
      // Récupère uniquement les événements proposés par l'utilisateur connecté
      const data = await eventsService.getMyProposedEvents()
      setEvents(data)
    } catch (error) {
      toast({ title: "Erreur", description: "Chargement des événements impossible", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMyEvents() }, [])

  const filtered = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-pink-500" />
    </div>
  )

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header avec Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 text-pink-700 hover:bg-pink-50">
            <Link href="/dashboard/guide"><ArrowLeft className="mr-2 h-4 w-4"/> Retour Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-black flex items-center gap-2 text-slate-800">
            <Calendar className="text-pink-500" size={32} /> Mes Événements Proposés
          </h1>
          <p className="text-muted-foreground text-sm">Suivez l'état de vos propositions d'événements culturels</p>
        </div>
        <Button asChild className="bg-pink-600 hover:bg-pink-700 shadow-lg transition-all active:scale-95">
          <Link href="/dashboard/guide/events/create">
            <Plus className="mr-2 h-4 w-4" /> Proposer un événement
          </Link>
        </Button>
      </div>

      {/* Barre de Recherche */}
      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-pink-500 transition-colors" />
        <Input 
          placeholder="Rechercher par titre ou lieu..." 
          className="pl-10 focus-visible:ring-pink-500" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {/* Tableau des Événements */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
            <TableRow>
              <TableHead className="font-bold text-slate-700">Événement</TableHead>
              <TableHead className="font-bold text-slate-700">Lieu</TableHead>
              <TableHead className="font-bold text-slate-700">Période</TableHead>
              <TableHead className="font-bold text-slate-700">Statut</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic bg-slate-50/30">
                  Aucun événement proposé ne correspond à votre recherche.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((event) => (
                <TableRow key={event.id} className="hover:bg-pink-50/30 transition-colors group">
                  <TableCell>
                    <span className="font-bold text-slate-800 block group-hover:text-pink-700 transition-colors">{event.title}</span>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin size={14} className="text-pink-500"/>
                      {event.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-500 space-y-0.5">
                      <p><span className="font-medium text-slate-700">Du:</span> {event.startDate}</p>
                      <p><span className="font-medium text-slate-700">Au:</span> {event.endDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={event.status === 'ACTIVE' 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"}
                    >
                      {event.status === 'ACTIVE' ? (
                        <span className="flex items-center gap-1"><CheckCircle size={12}/> Validé</span>
                      ) : (
                        <span className="flex items-center gap-1"><Clock size={12}/> En attente</span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* BOUTON VOIR DÉTAILS */}
                      <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 border-blue-100 hover:bg-blue-50" asChild title="Détails">
                        <Link href={`/dashboard/guide/events/${event.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      {/* BOUTON MODIFIER */}
                      <Button variant="outline" size="icon" className="h-8 w-8 text-pink-600 border-pink-100 hover:bg-pink-50" asChild title="Modifier">
                        <Link href={`/dashboard/guide/events/${event.id}/edit`}>
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