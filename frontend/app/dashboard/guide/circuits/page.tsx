"use client"

import { useEffect, useState } from "react"
import { circuitsService } from "@/services/circuits.service"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Map as MapIcon, Plus, Clock, CheckCircle, Search, Loader2, ArrowLeft, Eye, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import type { Circuit } from "@/lib/types"

export default function GuideCircuitsPage() {
  const [circuits, setCircuits] = useState<Circuit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "PENDING">("ALL")

  const loadMyCircuits = async () => {
    try {
      setLoading(true)
      const data = await circuitsService.getMyCircuits()
      setCircuits(data)
    } catch (error: any) {
      toast({ 
        title: "Erreur", 
        description: "Impossible de charger vos circuits.", 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMyCircuits() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce circuit ?")) return
    try {
      await circuitsService.deleteCircuit(id)
      toast({ title: "Supprimé", description: "Le circuit a été retiré." })
      loadMyCircuits()
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" })
    }
  }

  const filtered = circuits.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "ALL" || c.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/guide"><ArrowLeft className="mr-2 h-4 w-4"/> Retour</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <MapIcon className="text-blue-500" /> Mes Circuits & Itinéraires
          </h1>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-md">
          <Link href="/dashboard/guide/circuits/create">
            <Plus className="mr-2 h-4 w-4" /> Créer un circuit
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un circuit..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 bg-muted p-1 rounded-lg">
          <Button variant={filterStatus === "ALL" ? "secondary" : "ghost"} size="sm" onClick={() => setFilterStatus("ALL")}>Tous</Button>
          <Button variant={filterStatus === "ACTIVE" ? "secondary" : "ghost"} size="sm" onClick={() => setFilterStatus("ACTIVE")} className="text-emerald-600">Actifs</Button>
          <Button variant={filterStatus === "PENDING" ? "secondary" : "ghost"} size="sm" onClick={() => setFilterStatus("PENDING")} className="text-amber-600">En attente</Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Circuit</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">Aucun circuit trouvé.</TableCell></TableRow>
            ) : (
              filtered.map((circuit) => (
                <TableRow key={circuit.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{circuit.title}</TableCell>
                  <TableCell>{circuit.duration}</TableCell>
                  <TableCell className="font-semibold text-blue-600">{circuit.price} MAD</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={circuit.status === "ACTIVE" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-amber-50 text-amber-600 border-amber-200"}
                    >
                      {circuit.status === "ACTIVE" ? <CheckCircle size={14} className="mr-1"/> : <Clock size={14} className="mr-1"/>}
                      {circuit.status === "ACTIVE" ? "Validé" : "En attente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600" asChild>
                        <Link href={`/dashboard/guide/circuits/${circuit.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(circuit.id)}>
                        <Trash2 className="h-4 w-4" />
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