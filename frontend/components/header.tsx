"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, User, LogOut, Settings } from "lucide-react" // J'ai ajouté Settings pour l'icône profil
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authService } from "@/services/auth.service"
import { useRouter } from "next/navigation"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated())
      setUserName(localStorage.getItem("userName") || "")
      setUserRole(localStorage.getItem("userRole") || "")
    }

    checkAuth()

    window.addEventListener("storage", checkAuth)
    return () => window.removeEventListener("storage", checkAuth)
  }, [])

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    router.push("/auth/login")
    router.refresh()
  }

  // Fonction pour le Dashboard principal
  const getDashboardLink = () => {
    if (userRole === "ADMIN") return "/dashboard/admin"
    if (userRole === "GUIDE") return "/dashboard/guide"
    return "/"
  }

  // NOUVELLE FONCTION : Détermine le lien du profil selon le rôle
  const getProfileLink = () => {
    if (userRole === "ADMIN") return "/dashboard/admin/profile"
    if (userRole === "GUIDE") return "/dashboard/guide/profile"
    return "/dashboard/tourist/profile"
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Taroudant
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link href="/places" className="text-foreground hover:text-primary transition-colors">
              Lieux
            </Link>
            <Link href="/activities" className="text-foreground hover:text-primary transition-colors">
              Activités
            </Link>
            <Link href="/events" className="text-foreground hover:text-primary transition-colors">
              Événements
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <User className="h-4 w-4" />
                    {userName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  
                  {/* Lien Dashboard */}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={getDashboardLink()} className="w-full font-medium">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {/* AJOUT ICI : Lien vers le Profil */}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={getProfileLink()} className="w-full flex items-center">
                       <Settings className="mr-2 h-4 w-4" /> 
                       Mon Profil
                    </Link>
                  </DropdownMenuItem>

                  {/* Lien Réservations (Visible uniquement pour les touristes, optionnel) */}
                  {userRole === "TOURIST" && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard/tourist/reservations">Mes Réservations</Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  
                  {/* Déconnexion */}
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Connexion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Inscription</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              {/* ... Autres liens ... */}
              
              {isAuthenticated ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    className="text-foreground hover:text-primary transition-colors font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  {/* AJOUT MOBILE : Lien Profil */}
                  <Link
                    href={getProfileLink()}
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mon Profil
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="text-left text-destructive hover:text-destructive/80 transition-colors"
                  >
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>Connexion</Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>Inscription</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}