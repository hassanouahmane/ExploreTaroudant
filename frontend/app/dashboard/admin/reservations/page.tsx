"use client"

import { useEffect, useState } from "react"
import { reservationsService } from "@/services/reservations.service"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ArrowLeft,
  Calendar,
  User as UserIcon,
  Search,
  ShoppingBag
} from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Reservation } from "@/lib/types"
import Link from "next/link"

export default function AdminReservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await reservationsService.getAllReservationsAdmin()
      setReservations(data)
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les réservations", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await reservationsService.updateStatus(id, newStatus)
      toast({ 
        title: newStatus === "CONFIRMED" ? "Réservation Acceptée" : "Réservation Rejetée",
        description: `Le statut a été mis à jour avec succès.` 
      })
      loadData() // Rafraîchir la liste
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED": return <Badge className="bg-emerald-500">Confirmée</Badge>
      case "CANCELLED": return <Badge variant="destructive">Annulée</Badge>
      default: return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">En attente</Badge>
    }
  }

  const filteredReservations = reservations.filter(r => 
    r.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.activity?.title || r.circuit?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/admin"><ArrowLeft className="mr-2 h-4 w-4"/> Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ShoppingBag className="text-emerald-600" /> Gestion des Réservations
          </h1>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher par client, activité ou circuit..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Prestation</TableHead>
              <TableHead>Date prévue</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">Aucune réservation trouvée.</TableCell></TableRow>
            ) : (
              filteredReservations.map((res) => (
                <TableRow key={res.id} className="hover:bg-muted/5 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{res.user?.fullName}</span>
                      <span className="text-xs text-muted-foreground">{res.user?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs uppercase text-blue-600">
                        {res.activity ? "Activité" : "Circuit"}
                      </span>
                      <span className="text-sm">{res.activity?.title || res.circuit?.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-muted-foreground" />
                      {new Date(res.reservationDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(res.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* L'admin ne peut confirmer que ce qui est PENDING ou CANCELLED */}
                      {res.status !== "CONFIRMED" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          onClick={() => handleUpdateStatus(res.id, "CONFIRMED")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Accepter
                        </Button>
                      )}
                      
                      {/* L'admin peut annuler/rejeter si ce n'est pas déjà fait */}
                      {res.status !== "CANCELLED" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-destructive border-red-200 hover:bg-red-50"
                          onClick={() => handleUpdateStatus(res.id, "CANCELLED")}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Rejeter
                        </Button>
                      )}
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