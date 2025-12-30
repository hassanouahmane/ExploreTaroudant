"use client"

import { useEffect, useState } from "react"
import { reservationsService } from "@/services/reservations.service"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Mail, CreditCard, Loader2 } from "lucide-react"
import type { Reservation } from "@/lib/types"

export default function GuideReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reservationsService.getGuideReservations()
      .then(setReservations)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Calendar className="text-emerald-500" /> Gestion des Réservations
      </h1>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Client / Touriste</TableHead>
              <TableHead>Prestation</TableHead>
              <TableHead>Date prévue</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">Aucune réservation reçue.</TableCell></TableRow>
            ) : (
              reservations.map((res) => (
                <TableRow key={res.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold flex items-center gap-1"><User size={14}/> {res.user?.fullName}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={12}/> {res.user?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50">
                      {res.activity?.title || res.circuit?.title}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{res.reservationDate}</TableCell>
                  <TableCell>
                    <Badge className={res.status === 'CONFIRMED' ? 'bg-emerald-500' : 'bg-amber-500'}>
                      {res.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {res.activity?.price || res.circuit?.price} MAD
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