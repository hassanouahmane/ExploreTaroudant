import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">À propos de Taroudant</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Découvrez la beauté authentique du Maroc à travers ses lieux historiques, ses activités culturelles et ses
              événements traditionnels.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/places" className="text-muted-foreground hover:text-primary transition-colors">
                  Lieux touristiques
                </Link>
              </li>
              <li>
                <Link href="/activities" className="text-muted-foreground hover:text-primary transition-colors">
                  Activités
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  Événements
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: info@taroudant.ma</li>
              <li>Tél: +212 5XX-XXXXXX</li>
              <li>Adresse: Taroudant, Maroc</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Taroudant Tourism. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
