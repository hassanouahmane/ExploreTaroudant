"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProtectedRoute } from "@/components/protected-route"
import { StatCard } from "@/components/stat-card"
import { ReservationCard } from "@/components/reservation-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { reservationsService } from "@/services/reservations.service"
import { authService } from "@/services/auth.service"
import type { Reservation, User } from "@/lib/types"
import { 
  Calendar, CheckCircle, Star, Loader2, 
  ArrowRight, Map, Heart, Compass, 
  Clock
} from "lucide-react"
import Link from "next/link"

export default function TouristDashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Chargement parallèle des données pour la performance
        const [resData, userData] = await Promise.all([
          reservationsService.getMyReservations(),
          authService.getCurrentUser() 
        ])
        setReservations(resData)
        setProfile(userData)
      } catch (error) {
        console.error("Dashboard Loading Error:", error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  const confirmedRes = reservations.filter(r => r.status === "CONFIRMED")
  const pendingRes = reservations.filter(r => r.status === "PENDING")

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin h-12 w-12 text-emerald-600 mx-auto" />
        <p className="text-slate-500 font-medium">Préparation de votre voyage...</p>
      </div>
    </div>
  )

  return (
    <ProtectedRoute allowedRoles={["TOURIST"]}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-10 space-y-8"
      >
        {/* Banner de bienvenue stylisée */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Salam, {profile?.fullName.split(' ')[0]} 🌴
            </h1>
            <p className="text-emerald-50 font-medium text-lg opacity-90 leading-relaxed">
              Votre aventure à Taroudant continue. Vous avez {confirmedRes.length} activité(s) confirmée(s) qui vous attendent !
            </p>
          </div>
          <Compass className="absolute -right-10 -bottom-10 h-64 w-64 text-white/10 rotate-12" />
        </div>

        {/* Statistiques Rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Calendar />} value={confirmedRes.length} label="À venir" iconColor="text-blue-500" />
          <StatCard icon={<Clock />} value={pendingRes.length} label="En attente" iconColor="text-amber-500" />
          <StatCard icon={<Star />} value={0} label="Mes Avis" iconColor="text-pink-500" />
          <StatCard icon={<CheckCircle />} value={reservations.length} label="Total" iconColor="text-emerald-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des réservations récentes */}
          <Card className="lg:col-span-2 border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <Map className="text-emerald-600 h-6 w-6" /> Itinéraires récents
                </CardTitle>
                <Button variant="ghost" className="text-emerald-700 font-bold hover:bg-emerald-50" asChild>
                  <Link href="/dashboard/tourist/reservations">
                    Voir tout <ArrowRight className="ml-2 h-4 w-4"/>
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <AnimatePresence>
                {confirmedRes.length > 0 ? (
                  confirmedRes.slice(0, 3).map((res, index) => (
                    <motion.div 
                      key={res.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ReservationCard reservation={res} />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16 space-y-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Compass className="h-10 w-10 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium">Vous n'avez pas encore d'aventures prévues.</p>
                      <p className="text-slate-400 text-sm mt-1">Découvrez nos circuits et activités guidées.</p>
                    </div>
                    <Button asChild className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-8 shadow-lg shadow-emerald-200">
                      <Link href="/activities">Explorer Taroudant</Link>
                    </Button>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Actions Rapides Verticales */}
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-none shadow-xl bg-amber-50/50 overflow-hidden">
              <CardHeader className="bg-amber-100/50 border-b border-amber-200/50">
                <CardTitle className="text-amber-900 font-black text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col gap-4">
                <QuickActionButton 
                  href="/activities" 
                  label="Réserver une activité" 
                  emoji="🎯" 
                />
                <QuickActionButton 
                  href="/places" 
                  label="Noter un lieu visité" 
                  emoji="🏛️" 
                />
                <QuickActionButton 
                  href="/events" 
                  label="Événements culturels" 
                  emoji="📅" 
                />
              </CardContent>
            </Card>

            {/* Petite carte météo ou info locale (Optionnel) */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Météo Taroudant</p>
                <p className="text-2xl font-bold">24°C</p>
              </div>
              <Compass className="text-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>
    </ProtectedRoute>
  )
}

// Composant Helper pour les boutons d'actions
function QuickActionButton({ href, label, emoji }: { href: string, label: string, emoji: string }) {
  return (
    <Button asChild variant="ghost" className="w-full justify-between rounded-2xl bg-white p-6 h-auto text-slate-800 hover:bg-amber-100/80 border border-amber-100 shadow-sm group">
      <Link href={href}>
        <span className="flex items-center gap-3 font-bold">
          <span className="text-xl">{emoji}</span>
          {label}
        </span>
        <ArrowRight className="h-4 w-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
      </Link>
    </Button>
  )
}