"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { 
  User, Mail, Phone, Calendar, Save, Edit2, Loader2, 
  Shield, Languages, FileText, CheckCircle2, AlertCircle, Lock 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/services/auth.service"
import type { User as UserType } from "@/lib/types"

// Interface locale pour le formulaire
interface GuideProfileForm {
  fullName: string
  email: string
  phone: string
  password?: string
  bio: string
  languages: string
}

export default function GuideProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, reset } = useForm<GuideProfileForm>()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await authService.getCurrentUser()
      setUser(data)
      
      // Pré-remplissage : On va chercher les infos dans l'objet 'guide' imbriqué
      reset({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || "",
        bio: data.guide?.bio || "",
        languages: data.guide?.languages || "",
        password: ""
        
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger votre profil guide.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: GuideProfileForm) => {
    // Validation mot de passe obligatoire pour update
    if (!data.password || data.password.length < 4) {
        toast({ title: "Mot de passe requis", description: "Confirmez votre mot de passe pour enregistrer.", variant: "destructive" })
        return
    }

    setIsSaving(true)
    try {
      const updatedUser = await authService.updateProfile({
        fullName: data.fullName,
        phone: data.phone,
        email: user?.email,
        password: data.password,
        bio: data.bio,           // Champ spécifique Guide
        languages: data.languages // Champ spécifique Guide
      })
      
      setUser(updatedUser)
      localStorage.setItem("userName", updatedUser.fullName)
      setIsEditing(false)
      reset({ ...data, password: "" }) // On vide le mot de passe après succès
      
      toast({
        title: "Profil professionnel mis à jour",
        description: "Vos informations guide ont été enregistrées.",
        className: "bg-emerald-50 text-emerald-800 border-emerald-200",
      })
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la mise à jour.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-amber-600" /></div>
  if (!user) return null

  const initials = user.fullName.slice(0, 2).toUpperCase()
  // Conversion de la string "Anglais, Arabe" en tableau pour l'affichage des badges
  const languagesList = user.guide?.languages ? user.guide.languages.split(",").map(l => l.trim()).filter(l => l) : []

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Profil Guide</h1>
        <p className="text-slate-500">Gérez votre image publique et vos compétences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : Carte Visuelle */}
        <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-xl bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden relative">
            <div className="absolute top-4 right-4">
                {user.status === "ACTIVE" ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1"><CheckCircle2 size={12} /> Vérifié</Badge>
                ) : (
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1"><AlertCircle size={12} /> En attente</Badge>
                )}
            </div>

            <CardContent className="pt-10 flex flex-col items-center text-center">
                <Avatar className="h-36 w-36 border-4 border-white/10 shadow-2xl mb-4">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} />
                    <AvatarFallback className="bg-amber-500 text-white text-3xl font-bold">{initials}</AvatarFallback>
                </Avatar>
                
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <div className="flex items-center gap-2 mt-2 text-slate-300 font-medium">
                    <Shield className="h-4 w-4 text-amber-400" /> Guide Touristique
                </div>

                <div className="mt-8 w-full space-y-4">
                    <div className="bg-white/5 p-4 rounded-xl text-left border border-white/5">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-2">Langues parlées</p>
                        <div className="flex flex-wrap gap-2">
                            {languagesList.length > 0 ? (
                                languagesList.map((lang, index) => (
                                    <Badge key={index} variant="secondary" className="bg-white/10 text-white border-none">{lang}</Badge>
                                ))
                            ) : <span className="text-sm text-slate-500 italic">Aucune langue</span>}
                        </div>
                    </div>
                </div>
            </CardContent>
            </Card>
        </div>

        {/* COLONNE DROITE : Formulaire */}
        <Card className="lg:col-span-2 border-slate-100 shadow-md h-fit">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
            <div>
              <CardTitle>Informations & Biographie</CardTitle>
              <CardDescription>Ces informations seront visibles par les touristes.</CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-2"><Edit2 className="h-4 w-4" /> Modifier</Button>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Infos de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-slate-600"><User className="h-4 w-4" /> Nom complet</label>
                  {isEditing ? <Input {...register("fullName")} className="bg-slate-50" /> : <div className="p-3 bg-slate-50 rounded-md font-medium text-slate-900">{user.fullName}</div>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-slate-600"><Phone className="h-4 w-4" /> Téléphone</label>
                  {isEditing ? <Input {...register("phone")} className="bg-slate-50" /> : <div className="p-3 bg-slate-50 rounded-md font-medium text-slate-900">{user.phone || "Non renseigné"}</div>}
                </div>
                
                <div className="space-y-2 md:col-span-2">
                   <label className="text-sm font-medium flex items-center gap-2 text-slate-600"><Mail className="h-4 w-4" /> Email (Non modifiable)</label>
                   <div className="p-3 bg-slate-100 rounded-md font-medium text-slate-500 cursor-not-allowed">{user.email}</div>
                </div>
              </div>

              <div className="border-t border-slate-100 my-4" />

              {/* Infos Guide */}
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 text-slate-900"><FileText className="h-4 w-4 text-amber-500" /> Biographie</label>
                    {isEditing ? (
                        <Textarea {...register("bio")} placeholder="Votre expérience..." className="bg-slate-50 min-h-[120px]" />
                    ) : (
                        <div className="p-4 bg-slate-50 rounded-md text-slate-700 text-sm leading-relaxed min-h-[80px]">{user.guide?.bio || "Aucune bio."}</div>
                    )}
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 text-slate-900"><Languages className="h-4 w-4 text-amber-500" /> Langues (séparées par des virgules)</label>
                    {isEditing ? (
                        <Input {...register("languages")} placeholder="Français, Anglais..." className="bg-slate-50" />
                    ) : (
                        <div className="p-3 bg-slate-50 rounded-md text-slate-700">{user.guide?.languages || "Non renseigné"}</div>
                    )}
                 </div>

                 {/* Champ Password pour validation */}
                 {isEditing && (
                    <div className="space-y-2 bg-amber-50 p-4 rounded-lg border border-amber-100 mt-4">
                        <label className="text-sm font-bold flex items-center gap-2 text-amber-700"><Lock className="h-4 w-4" /> Mot de passe (Requis)</label>
                        <Input {...register("password")} type="password" placeholder="Votre mot de passe actuel" className="bg-white border-amber-200" />
                    </div>
                 )}
              </div>

              {isEditing && (
                <div className="flex items-center justify-end gap-3 pt-6 border-t">
                  <Button type="button" variant="ghost" onClick={() => { setIsEditing(false); reset(); }} disabled={isSaving}>Annuler</Button>
                  <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white min-w-[140px]" disabled={isSaving}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</> : <><Save className="mr-2 h-4 w-4" /> Sauvegarder</>}
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