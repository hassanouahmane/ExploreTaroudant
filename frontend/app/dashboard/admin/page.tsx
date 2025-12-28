"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// Renaming icons to avoid conflicts with built-in JS types or custom data types
import { 
  Users, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Clock,
  AlertCircle,
  MessageSquare,
  ShoppingBag,
  Hammer,
  Activity as ActivityIcon,
  Map as MapIcon // Rename here to solve the MapConstructor error
} from "lucide-react"
import { adminService } from "@/services/admin.service"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getUserStats()
        console.log("Stats reçues du backend:", data) // <--- AJOUTEZ CECI POUR DÉBOGUER
        setStats(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les statistiques.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [toast])

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Tableau de bord Administrateur</h1>
          <p className="text-muted-foreground italic">Vue d'ensemble de la plateforme Explore Taroudant</p>
        </div>

        {/* Global Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats?.totalTourists || 0} touristes inscrits</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Guides</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalGuides || 0}</div>
              <p className="text-xs text-emerald-600 font-medium mt-1">{stats?.totalActiveGuides || 0} actifs</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lieux & Patrimoine</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">Sites historiques répertoriés</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Événements</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">Agenda culturel actif</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-5 w-5 text-primary" /> Comptes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-xs text-muted-foreground">Activation et suspension des utilisateurs.</p>
              <Button asChild className="w-full" variant="outline" size="sm">
                <Link href="/dashboard/admin/users">Gérer</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MapPin className="h-5 w-5 text-emerald-500" /> Patrimoine
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-xs text-muted-foreground">Modération des lieux proposés par les guides.</p>
              <Button asChild className="w-full" variant="outline" size="sm">
                <Link href="/dashboard/admin/places">Gérer</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Gestion des Réservations */}
<Card className="shadow-sm">
  <CardHeader className="bg-muted/30">
    <CardTitle className="flex items-center gap-2 text-sm">
      <ShoppingBag className="h-5 w-5 text-emerald-600" /> Réservations
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-6 space-y-4">
    <p className="text-xs text-muted-foreground">
      Suivi des ventes, annulations et flux touristiques.
    </p>
    <Button asChild className="w-full" variant="outline" size="sm">
      <Link href="/dashboard/admin/reservations">Voir les ventes</Link>
    </Button>
  </CardContent>
</Card>

          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-sm">
                <ActivityIcon className="h-5 w-5 text-blue-500" /> Activités
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-xs text-muted-foreground">Validation des circuits et visites touristiques.</p>
              <Button asChild className="w-full" variant="outline" size="sm">
                <Link href="/dashboard/admin/activities">Gérer</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MapIcon className="h-5 w-5 text-orange-500" /> Circuits
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-xs text-muted-foreground">Modérez les itinéraires proposés.</p>
              <Button asChild className="w-full" variant="outline" size="sm">
                <Link href="/dashboard/admin/circuits">Gérer</Link>
              </Button>
            </CardContent>
          </Card>

         {/* Gestion de l'Artisanat Local */}
        <Card className="shadow-sm">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Hammer className="h-5 w-5 text-amber-700" /> Artisanat
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-xs text-muted-foreground">
              Gérez le catalogue des artisans et coopératives de la région.
            </p>
            <Button asChild className="w-full" variant="outline" size="sm">
              <Link href="/dashboard/admin/artisans">Gérer</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Modération des Avis */}
<Card className="shadow-sm">
  <CardHeader className="bg-muted/30">
    <CardTitle className="flex items-center gap-2 text-sm">
      <MessageSquare className="h-5 w-5 text-blue-600" /> Avis Clients
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-6 space-y-4">
    <p className="text-xs text-muted-foreground">
      Gérez les commentaires et notes laissés sur les monuments de Taroudant.
    </p>
    <Button asChild className="w-full" variant="outline" size="sm">
      <Link href="/dashboard/admin/reviews">Modérer les avis</Link>
    </Button>
  </CardContent>
</Card>

        {/* Gestion des Signalements */}
<Card className="shadow-sm border-red-100 bg-red-50/10">
  <CardHeader className="bg-red-50/50">
    <CardTitle className="flex items-center gap-2 text-sm text-red-700">
      <AlertCircle className="h-5 w-5" /> Signalements
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-6 space-y-4">
    <p className="text-xs text-muted-foreground">
      Gérez les plaintes des utilisateurs et les problèmes de contenu.
    </p>
    <Button asChild className="w-full border-red-200 text-red-700 hover:bg-red-50" variant="outline" size="sm">
      <Link href="/dashboard/admin/reports">Consulter les rapports</Link>
    </Button>
  </CardContent>
</Card>

        </div>
      </div>
    </ProtectedRoute>
  )
}