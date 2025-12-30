"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { User, Mail, Phone, Calendar, Save, Edit2, Loader2, Shield, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/services/auth.service"
import type { User as UserType } from "@/lib/types"

export default function TouristProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // On ajoute 'password' au formulaire
  const { register, handleSubmit, reset } = useForm<{ fullName: string; phone: string; email: string; password?: string }>()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await authService.getCurrentUser()
      setUser(data)
      reset({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || "",
        password: "", // On vide le champ mot de passe au chargement
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger votre profil.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: any) => {
    // VÉRIFICATION : Le backend exige un mot de passe
    if (!data.password || data.password.length < 4) {
        toast({
            title: "Mot de passe requis",
            description: "Veuillez entrer un mot de passe pour valider les modifications.",
            variant: "destructive",
        })
        return
    }

    setIsSaving(true)
    try {
      const updatedUser = await authService.updateProfile({
        fullName: data.fullName,
        phone: data.phone,
        email: user?.email,
        password: data.password // On envoie le mot de passe saisi
      })
      
      setUser(updatedUser)
      localStorage.setItem("userName", updatedUser.fullName)
      
      setIsEditing(false)
      // On reset le formulaire en gardant les nouvelles infos mais en vidant le champ password
      reset({ ...data, password: "" }) 

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
        className: "bg-emerald-50 text-emerald-800 border-emerald-200",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  if (!user) return null

  const initials = user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Mon Profil</h1>
        <p className="text-slate-500">Gérez vos informations personnelles et préférences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-none shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="h-32 w-32 border-4 border-white/10 shadow-xl mb-4">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
              <AvatarFallback className="bg-amber-500 text-white text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium">
              <Shield className="h-3 w-3 text-amber-400" />
              {user.role}
            </div>
            <div className="mt-8 w-full space-y-4 text-left">
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Membre depuis</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">
                    {user.createdAt ? format(new Date(user.createdAt), "MMMM yyyy", { locale: fr }) : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-slate-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Mettez à jour vos coordonnées</CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-2">
                <Edit2 className="h-4 w-4" /> Modifier
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-slate-600">
                    <User className="h-4 w-4" /> Nom complet
                  </label>
                  {isEditing ? (
                    <Input {...register("fullName")} className="bg-slate-50 border-slate-200" />
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-md font-medium text-slate-900 border border-transparent">
                      {user.fullName}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4" /> Adresse Email
                  </label>
                  <div className="p-3 bg-slate-100 rounded-md font-medium text-slate-500 flex justify-between items-center border border-transparent cursor-not-allowed">
                    {user.email}
                    {isEditing && <span className="text-xs text-slate-400">(Non modifiable)</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4" /> Téléphone
                  </label>
                  {isEditing ? (
                    <Input {...register("phone")} placeholder="+212 6..." className="bg-slate-50 border-slate-200" />
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-md font-medium text-slate-900 border border-transparent">
                      {user.phone || "Non renseigné"}
                    </div>
                  )}
                </div>

                {/* CHAMP MOT DE PASSE AJOUTÉ */}
                {isEditing && (
                    <div className="space-y-2 bg-amber-50 p-4 rounded-lg border border-amber-100">
                        <label className="text-sm font-bold flex items-center gap-2 text-amber-700">
                            <Lock className="h-4 w-4" /> Mot de passe (Requis pour valider)
                        </label>
                        <Input 
                            {...register("password")} 
                            type="password"
                            placeholder="Entrez votre mot de passe pour confirmer" 
                            className="bg-white border-amber-200 focus-visible:ring-amber-500" 
                        />
                        <p className="text-[10px] text-amber-600">
                            Pour des raisons de sécurité, veuillez confirmer votre mot de passe actuel (ou en définir un nouveau) pour mettre à jour votre profil.
                        </p>
                    </div>
                )}
              </div>

              {isEditing && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => {
                      setIsEditing(false)
                      reset()
                    }}
                    disabled={isSaving}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-amber-500 hover:bg-amber-600 text-white min-w-[140px]"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Enregistrer
                      </>
                    )}
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