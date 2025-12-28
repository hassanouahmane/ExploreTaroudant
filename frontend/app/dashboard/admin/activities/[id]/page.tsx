"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { activitiesService } from "@/services/activities.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle, Trash2, Loader2, Clock, MapPin, User, Banknote } from "lucide-react"
import type { Activity } from "@/lib/types"

export default function AdminActivityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    activitiesService.getActivityById(Number(resolvedParams.id))
      .then(setActivity)
      .catch(() => toast({ title: "Erreur", description: "Activité introuvable", variant: "destructive" }))
      .finally(() => setLoading(false))
  }, [resolvedParams.id, toast])

  const handleValidate = async () => {
    if (!activity) return
    try {
      await activitiesService.validateActivity(activity.id)
      toast({ title: "Succès", description: "L'activité a été approuvée." })
      router.push("/dashboard/admin/activities")
    } catch (error) { toast({ title: "Erreur", variant: "destructive" }) }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
  if (!activity) return <div className="p-10 text-center text-muted-foreground">Activité non trouvée.</div>

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-3xl font-bold">{activity.title}</CardTitle>
              <Badge variant={activity.status === "ACTIVE" ? "default" : "secondary"}>
                {activity.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
               <span className="flex items-center gap-1"><MapPin size={16}/> {activity.place?.name}</span>
               <span className="flex items-center gap-1"><Clock size={16}/> {activity.duration}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border">
               <h3 className="font-bold mb-2">Description du programme</h3>
               <p className="text-slate-600 whitespace-pre-line leading-relaxed">{activity.description}</p>
            </div>
            <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
               <Banknote /> <span className="font-bold text-lg">{activity.price} MAD</span> <span className="text-sm opacity-80">par participant</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Proposé par</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="text-primary" /></div>
              <p className="font-medium">{activity.guide?.user?.fullName || "Administrateur"}</p>
            </CardContent>
          </Card>
          
          <Card className="border-amber-100 bg-amber-50/30">
            <CardContent className="pt-6 space-y-3">
              {activity.status === "PENDING" && (
                <Button onClick={handleValidate} className="w-full bg-emerald-600 hover:bg-emerald-700">Approuver l'activité</Button>
              )}
              <Button variant="destructive" className="w-full" onClick={() => router.push("/dashboard/admin/activities")}>Retour sans action</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}