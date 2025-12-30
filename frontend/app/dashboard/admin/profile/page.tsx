"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { 
  User, Mail, Phone, Calendar, Save, Edit2, Loader2, 
  ShieldCheck, Lock, Server 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/services/auth.service"
import type { User as UserType } from "@/lib/types"

export default function AdminProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, reset } = useForm<{ fullName: string; phone: string; password?: string }>()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await authService.getCurrentUser()
      setUser(data)
      reset({ fullName: data.fullName, phone: data.phone || "", password: "" })
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger le profil admin.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: any) => {
    if (!data.password || data.password.length < 4) {
        toast({ title: "Sécurité", description: "Mot de passe requis pour valider.", variant: "destructive" })
        return
    }

    setIsSaving(true)
    try {
      const updatedUser = await authService.updateProfile({
        fullName: data.fullName,
        phone: data.phone,
        email: user?.email,
        password: data.password // Envoi du mot de passe
      })
      
      setUser(updatedUser)
      localStorage.setItem("userName", updatedUser.fullName)
      setIsEditing(false)
      reset({ ...data, password: "" })
      
      toast({ title: "Administration", description: "Profil système mis à jour.", className: "bg-blue-50 text-blue-800 border-blue-200" })
    } catch (error) {
      toast({ title: "Erreur critique", description: "Échec de la mise à jour.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-600" /></div>
  if (!user) return null

  const initials = user.fullName.slice(0, 2).toUpperCase()

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-blue-600" /> Profil Administrateur
        </h1>
        <p className="text-slate-500">Gestion du compte maître et des accès système.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE */}
        <Card className="md:col-span-1 border-none shadow-xl bg-slate-950 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Server size={100} /></div>
            <CardContent className="pt-8 flex flex-col items-center text-center relative z-10">
                <Avatar className="h-28 w-28 border-4 border-blue-500/30 shadow-2xl mb-4">
                    <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${user.fullName}`} />
                    <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">{initials}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user.fullName}</h2>
                <div className="mt-2"><Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none px-3 py-1">SUPER ADMIN</Badge></div>
                <div className="mt-8 w-full space-y-4 text-left">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Date de création</p>
                        <div className="flex items-center gap-2 text-sm text-slate-200">
                            <Calendar className="h-4 w-4 text-blue-400" />
                            {user.createdAt ? format(new Date(user.createdAt), "dd MMM yyyy", { locale: fr }) : "N/A"}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* COLONNE DROITE */}
        <Card className="md:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6">
            <div><CardTitle>Identité & Sécurité</CardTitle><CardDescription>Informations du compte administrateur.</CardDescription></div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"><Edit2 className="h-4 w-4" /> Modifier</Button>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-slate-700"><User className="h-4 w-4 text-slate-400" /> Nom de l'administrateur</label>
                  {isEditing ? <Input {...register("fullName")} className="bg-slate-50 focus-visible:ring-blue-500" /> : <div className="p-3 bg-slate-50 rounded-md font-medium text-slate-900">{user.fullName}</div>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-slate-700"><Mail className="h-4 w-4 text-slate-400" /> Email système</label>
                  <div className="p-3 bg-slate-100 rounded-md font-medium text-slate-600 flex justify-between items-center border border-slate-200 cursor-not-allowed">{user.email}<Lock className="h-4 w-4 text-slate-400" /></div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-slate-700"><Phone className="h-4 w-4 text-slate-400" /> Contact d'urgence</label>
                  {isEditing ? <Input {...register("phone")} className="bg-slate-50 focus-visible:ring-blue-500" /> : <div className="p-3 bg-slate-50 rounded-md font-medium text-slate-900">{user.phone || "Non renseigné"}</div>}
                </div>

                {isEditing && (
                    <div className="space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <label className="text-sm font-bold flex items-center gap-2 text-blue-800"><Lock className="h-4 w-4" /> Mot de passe administrateur</label>
                        <Input {...register("password")} type="password" placeholder="Requis pour valider" className="bg-white border-blue-200 focus-visible:ring-blue-500" />
                    </div>
                )}
              </div>

              {isEditing && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="ghost" onClick={() => { setIsEditing(false); reset(); }} disabled={isSaving}>Annuler</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]" disabled={isSaving}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</> : <><Save className="mr-2 h-4 w-4" /> Mettre à jour</>}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}