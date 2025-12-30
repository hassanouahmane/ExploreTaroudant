"use client"

import { useEffect, useState } from "react"
import { placesService } from "@/services/places.service"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Plus, Clock, CheckCircle, Search, Loader2, ArrowLeft, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import type { Place } from "@/lib/types"

export default function GuidePlacesPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchMyPlaces = async () => {
      try {
        setLoading(true)
        // Note: On récupère les lieux actifs. Idéalement, filtrer par 'proposedBy' au backend.
        const allPlaces = await placesService.getAllActivePlaces()
        setPlaces(allPlaces)
      } catch (error) {
        toast({ title: "Erreur", description: "Chargement échoué", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchMyPlaces()
  }, [toast])

  const filteredPlaces = places.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/guide"><ArrowLeft className="mr-2 h-4 w-4"/> Retour</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <MapPin className="text-emerald-500" /> Mon Patrimoine
          </h1>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 shadow-md">
          <Link href="/dashboard/guide/places/create">
            <Plus className="mr-2 h-4 w-4" /> Proposer un lieu
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher un lieu..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nom du lieu</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date d'ajout</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlaces.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Aucun lieu trouvé.
                </TableCell>
              </TableRow>
            ) : (
              filteredPlaces.map((place) => (
                <TableRow key={place.id}>
                  <TableCell className="font-medium">{place.name}</TableCell>
                  <TableCell>{place.city}</TableCell>
                  <TableCell>
                    {place.status === "ACTIVE" ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <CheckCircle className="mr-1 h-3 w-3" /> Validé
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                        <Clock className="mr-1 h-3 w-3" /> En attente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(place.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/guide/places/${place.id}`}>
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Link>
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