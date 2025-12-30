"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Loader2, 
  Clock,
  Activity as ActivityIcon,
  Map as MapIcon,
  Star,
  TrendingUp,
  Plus,
  CalendarCheck,
  Hammer,
  Calendar,
  ChevronRight
} from "lucide-react"
import { guideService } from "@/services/guide.service"
import { activitiesService } from "@/services/activities.service"
import { reservationsService } from "@/services/reservations.service"
import { artisansService } from "@/services/artisans.service"
import { eventsService } from "@/services/events.service"
import { circuitsService } from "@/services/circuits.service" // Ajouté pour les circuits
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { Activity, User, Reservation, Artisan, Event, Circuit } from "@/lib/types"

export default function GuideDashboardPage() {
  const [profile, setProfile] = useState<User | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [circuits, setCircuits] = useState<Circuit[]>([]) // État pour les circuits
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileData, setProfileData] = useState({ bio: "", languages: "" })
  const [isUpdating, setIsUpdating] = useState(false)
  
  const { toast } = useToast()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        const userProfile = await guideService.getProfile()
        setProfile(userProfile)

        if (userProfile.guide?.bio === "Nouveau guide à Taroudant") {
          setProfileData({ bio: "", languages: userProfile.guide.languages || "" })
          setShowProfileModal(true)
        }

        // Chargement de toutes les statistiques en parallèle
        const [myActs, myRes, allArts, myEvents, myCircuits] = await Promise.all([
            activitiesService.getMyActivities(),
            reservationsService.getGuideReservations(),
            artisansService.getAllArtisans(), // Utilisation de getAll pour le dashboard
            eventsService.getMyProposedEvents(),
            circuitsService.getMyCircuits() // Ajouté pour la stat circuits
        ])
        
        setActivities(myActs)
        setReservations(myRes)
        setArtisans(allArts)
        setEvents(myEvents)
        setCircuits(myCircuits)

      } catch (error) {
        toast({ title: "Erreur", description: "Chargement des données incomplet.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [toast])

  const handleSaveProfile = async () => {
    try {
      setIsUpdating(true)
      await guideService.updateGuideTechnicalInfo(profileData)
      setShowProfileModal(false)
      toast({ title: "Profil mis à jour", description: "Merci d'avoir complété votre profil !" })
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la mise à jour.", variant: "destructive" })
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>

  return (
    <ProtectedRoute allowedRoles={["GUIDE"]}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Bonjour, {profile?.fullName || "Guide"} !</h1>
            <p className="text-muted-foreground italic text-sm">Gestion globale de vos contenus à Taroudant</p>
          </div>
          <Badge className="bg-emerald-500 text-white px-3 py-1">Guide {profile?.status || "ACTIF"}</Badge>
        </div>

        {/* STATISTIQUES RÉELLES */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard title="Mes Circuits" value={circuits.length} icon={<MapIcon className="text-blue-500" />} color="blue" />
          <StatCard title="Activités" value={activities.length} icon={<ActivityIcon className="text-purple-500" />} color="purple" />
          <StatCard title="Artisans" value={artisans.length} icon={<Hammer className="text-orange-500" />} color="orange" />
          <StatCard title="Événements" value={events.length} icon={<Calendar className="text-pink-500" />} color="pink" />
          <StatCard title="Réservations" value={reservations.length} icon={<CalendarCheck className="text-emerald-500" />} color="emerald" highlight />
        </div>

        {/* GRILLE DE GESTION - STYLE UNIQUE DES BOUTONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ManagementCard 
            title="Circuits" 
            desc="Randonnées et parcours thématiques." 
            href="/dashboard/guide/circuits" 
            icon={<MapIcon className="text-blue-500" />} 
            colorBorder="blue" 
          />
          <ManagementCard 
            title="Activités" 
            desc="Visites guidées et ateliers locaux." 
            href="/dashboard/guide/activities" 
            icon={<ActivityIcon className="text-purple-500" />} 
            colorBorder="purple" 
          />
          <ManagementCard 
            title="Artisans" 
            desc="Partagez le savoir-faire local." 
            href="/dashboard/guide/artisans" 
            icon={<Hammer className="text-orange-500" />} 
            colorBorder="orange" 
          />
          <ManagementCard 
            title="Événements" 
            desc="Festivals et culture vivante." 
            href="/dashboard/guide/events" 
            icon={<Calendar className="text-pink-500" />} 
            colorBorder="pink" 
          />
          <ManagementCard 
            title="Réservations" 
            desc="Liste des clients inscrits." 
            href="/dashboard/guide/reservations" 
            icon={<CalendarCheck className="text-emerald-500" />} 
            colorBorder="emerald" 
          />
          <ManagementCard 
            title="Patrimoine" 
            desc="Suggérez de nouveaux monuments." 
            href="/dashboard/guide/places" 
            icon={<MapPin className="text-slate-500" />} 
            colorBorder="slate" 
          />
        </div>

        {/* MODALE TECHNIQUE */}
        <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complétez votre profil technique</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Langues parlées</Label>
                <Input value={profileData.languages} onChange={(e) => setProfileData({...profileData, languages: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Votre Bio</Label>
                <Textarea value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveProfile} disabled={isUpdating} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {isUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : "Sauvegarder"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

/* COMPOSANTS LOCAUX POUR LE STYLE HARMONISÉ */

function StatCard({ title, value, icon, color, highlight = false }: { title: string, value: number, icon: any, color: string, highlight?: boolean }) {
  const borderColors: any = { blue: "border-l-blue-500", purple: "border-l-purple-500", orange: "border-l-orange-500", pink: "border-l-pink-500", emerald: "border-l-emerald-500" }
  return (
    <Card className={`border-l-4 ${borderColors[color]} shadow-sm`}>
      <CardHeader className="flex flex-row items-center justify-between pb-1 px-4">
        <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className={`text-2xl font-bold ${highlight ? 'text-emerald-600' : ''}`}>{value}</div>
      </CardContent>
    </Card>
  )
}

function ManagementCard({ title, desc, href, icon, colorBorder }: { title: string, desc: string, href: string, icon: any, colorBorder: string }) {
  const borderColors: any = { blue: "border-t-blue-500", purple: "border-t-purple-500", orange: "border-t-orange-500", pink: "border-t-pink-500", emerald: "border-t-emerald-500", slate: "border-t-slate-500" }
  const hoverText: any = { blue: "hover:text-blue-600", purple: "hover:text-purple-600", orange: "hover:text-orange-600", pink: "hover:text-pink-600", emerald: "hover:text-emerald-600", slate: "hover:text-slate-600" }

  return (
    <Card className={`hover:shadow-md transition-all border-t-4 ${borderColors[colorBorder]} bg-white group`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
        <Button asChild variant="outline" className={`w-full border-slate-200 bg-white transition-colors group-hover:border-slate-300 font-semibold ${hoverText[colorBorder]}`} size="sm">
          <Link href={href} className="flex items-center justify-center gap-1">
            Gérer la liste <ChevronRight size={14} />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}