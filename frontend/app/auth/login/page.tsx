"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/services/auth.service" 
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authService.login(email, password)
      
      // Sauvegarde du token et des infos (ID, Rôle, Nom) dans le localStorage
      authService.saveAuthData(response)

      toast({
        title: "Connexion réussie",
        description: `Ravi de vous revoir, ${response.fullName}!`,
      })

      // Redirection dynamique basée sur le rôle récupéré du token
      if (response.role === "ADMIN") {
        router.push("/dashboard/admin")
      } else if (response.role === "GUIDE") {
        router.push("/dashboard/guide")
      } else {
        router.push("/dashboard/tourist")
      }

      router.refresh()
    } catch (error: any) {
      // Gestion des erreurs personnalisée (PENDING, LOCKED, etc.)
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 moroccan-pattern">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            Connexion
          </CardTitle>
          <CardDescription className="text-center font-medium">
            Entrez vos identifiants pour accéder à votre espace
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(!!checked)} 
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none cursor-pointer peer-disabled:opacity-70"
              >
                Se souvenir de moi
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authentification...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/auth/register" className="text-primary hover:underline font-semibold">
                Créer un compte
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}