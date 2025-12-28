"use client"

import { useEffect, useState } from "react"
import { reportsService } from "@/services/reports.service"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  ArrowLeft,
  Filter,
  Eye
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Report, ReportStatus } from "@/lib/types"
import Link from "next/link"

export default function ReportManagementPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await reportsService.getAllReports()
      setReports(data)
    } catch (error) {
      toast({ title: "Erreur", description: "Chargement des signalements échoué", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleStatusChange = async (id: number, newStatus: ReportStatus) => {
    try {
      await reportsService.updateStatus(id, newStatus)
      toast({ title: "Statut mis à jour", description: `Le signalement est désormais ${newStatus}` })
      loadData()
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" })
    }
  }

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "OPEN": return <Badge variant="destructive" className="gap-1"><AlertCircle size={14}/> Ouvert</Badge>
      case "RESOLVED": return <Badge className="bg-emerald-500 hover:bg-emerald-600 gap-1"><CheckCircle2 size={14}/> Résolu</Badge>
      default: return <Badge variant="secondary" className="gap-1"><Clock size={14}/> En cours</Badge>
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/admin"><ArrowLeft className="mr-2 h-4 w-4"/> Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <AlertCircle className="text-destructive" /> Signalements & Plaintes
          </h1>
        </div>
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="max-w-[300px]">Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Aucun signalement reçu.</TableCell></TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold uppercase text-xs tracking-wider">{report.reportType}</span>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate italic text-sm">
                    "{report.description}"
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <Select 
                      onValueChange={(value) => handleStatusChange(report.id, value as ReportStatus)}
                      defaultValue={report.status}
                    >
                      <SelectTrigger className="w-[140px] ml-auto">
                        <SelectValue placeholder="Changer statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Ouvert</SelectItem>
                        <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                        <SelectItem value="RESOLVED">Résolu</SelectItem>
                      </SelectContent>
                    </Select>
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