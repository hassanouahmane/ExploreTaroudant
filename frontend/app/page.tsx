import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Compass, Star } from "lucide-react"
import FeaturedPlaces from "@/components/featured-places"
import UpcomingEvents from "@/components/upcoming-events"

export default function HomePage() {
    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Image de fond principale - Remparts de Taroudant */}
                <Image
                    src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070"
                    alt="Remparts de Taroudant"
                    fill
                    className="object-cover"
                    priority
                />

                {/* Gradient overlay pour lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

                {/* Contenu principal */}
                <div className="relative z-10 container mx-auto px-4 text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold text-balance bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent drop-shadow-2xl">
                        Découvrez Taroudant
                    </h1>
                    <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto text-pretty drop-shadow-lg font-medium">
                        Le joyau authentique du Maroc, où l'histoire rencontre la culture
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 shadow-xl" asChild>
                            <Link href="/places">Explorer les lieux</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 px-8 backdrop-blur-sm shadow-xl" asChild>
                            <Link href="/activities">Voir les activités</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi Taroudant ?</h2>
                    <p className="text-muted-foreground text-lg">Découvrez ce qui rend cette ville unique</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-amber-200/20 hover:border-amber-300/40 transition-all hover:shadow-lg group overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=2070"
                                alt="Architecture marocaine historique"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4 -mt-8 relative z-10">
                                <div className="bg-white rounded-full p-3 shadow-lg">
                                    <MapPin className="h-8 w-8 text-amber-500" />
                                </div>
                            </div>
                            <CardTitle>Lieux Historiques</CardTitle>
                            <CardDescription>Explorez des sites authentiques préservés</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground text-center">
                                Remparts du XVIe siècle, souks traditionnels et architecture berbère
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200/20 hover:border-orange-300/40 transition-all hover:shadow-lg group overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1566522650166-bd8b3e3a2b4b?q=80&w=2071"
                                alt="Artisanat marocain"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4 -mt-8 relative z-10">
                                <div className="bg-white rounded-full p-3 shadow-lg">
                                    <Compass className="h-8 w-8 text-orange-500" />
                                </div>
                            </div>
                            <CardTitle>Activités Culturelles</CardTitle>
                            <CardDescription>Immergez-vous dans la culture marocaine</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground text-center">
                                Ateliers d'artisanat, cuisine locale et traditions ancestrales
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-200/20 hover:border-amber-300/40 transition-all hover:shadow-lg group overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070"
                                alt="Festival marocain"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4 -mt-8 relative z-10">
                                <div className="bg-white rounded-full p-3 shadow-lg">
                                    <Calendar className="h-8 w-8 text-amber-500" />
                                </div>
                            </div>
                            <CardTitle>Événements</CardTitle>
                            <CardDescription>Participez aux festivals traditionnels</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground text-center">
                                Marchés hebdomadaires, festivals de musique et célébrations locales
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200/20 hover:border-orange-300/40 transition-all hover:shadow-lg group overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?q=80&w=2074"
                                alt="Guide touristique"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4 -mt-8 relative z-10">
                                <div className="bg-white rounded-full p-3 shadow-lg">
                                    <Star className="h-8 w-8 text-orange-500" />
                                </div>
                            </div>
                            <CardTitle>Guides Experts</CardTitle>
                            <CardDescription>Accompagné par des guides passionnés</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground text-center">
                                Guides locaux francophones connaissant chaque recoin de la ville
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Gallery Section - Nouvelle section avec images de Taroudant */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Galerie Photo</h2>
                    <p className="text-muted-foreground text-lg">Un aperçu visuel de la beauté de Taroudant</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
                        <Image
                            src="https://images.unsplash.com/photo-1570789210967-2cac24afeb00?q=80&w=2070"
                            alt="Souk traditionnel de Taroudant"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-4">
                            <p className="text-white font-semibold">Souk Traditionnel</p>
                        </div>
                    </div>

                    <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
                        <Image
                            src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2071"
                            alt="Remparts de Taroudant"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-4">
                            <p className="text-white font-semibold">Remparts Historiques</p>
                        </div>
                    </div>

                    <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
                        <Image
                            src="https://images.unsplash.com/photo-1558969700-e0ecebbc6d5b?q=80&w=2070"
                            alt="Place Assarag"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-4">
                            <p className="text-white font-semibold">Place Assarag</p>
                        </div>
                    </div>

                    <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer md:col-span-2">
                        <Image
                            src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2070"
                            alt="Palmeraie de Taroudant"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-4">
                            <p className="text-white font-semibold">Palmeraie Environnante</p>
                        </div>
                    </div>

                    <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
                        <Image
                            src="https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?q=80&w=2074"
                            alt="Artisanat local"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-4">
                            <p className="text-white font-semibold">Artisanat Local</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Places Section */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Lieux Incontournables</h2>
                    <p className="text-muted-foreground text-lg">Découvrez les sites les plus visités de Taroudant</p>
                </div>

                <FeaturedPlaces />
            </section>

            {/* Upcoming Events Section */}
            <section className="relative py-16 overflow-hidden">
                {/* Image de fond avec overlay */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=2071"
                        alt="Fond événements"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 to-orange-900/90" />
                </div>

                <div className="relative z-10 container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Événements à Venir</h2>
                        <p className="text-amber-100 text-lg">Ne manquez pas les prochaines activités à Taroudant</p>
                    </div>

                    <UpcomingEvents />

                    <div className="text-center mt-8">
                        <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white/20 backdrop-blur-sm" asChild>
                            <Link href="/events">Voir tous les événements</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4">
                <Card className="relative overflow-hidden border-amber-200">
                    <div className="absolute inset-0">
                        <Image
                            src="https://images.unsplash.com/photo-1563164116-48fa9b8ba23a?q=80&w=2070"
                            alt="Fond CTA"
                            fill
                            className="object-cover opacity-20"
                        />
                    </div>
                    <CardContent className="relative z-10 p-12 text-center space-y-4 bg-gradient-to-r from-amber-500/10 via-orange-400/10 to-amber-600/10">
                        <h2 className="text-3xl md:text-4xl font-bold">Prêt pour l'aventure ?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Rejoignez notre communauté et commencez à explorer les merveilles de Taroudant dès aujourd'hui
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 shadow-lg" asChild>
                                <Link href="/auth/register">Créer un compte gratuit</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="shadow-lg" asChild>
                                <Link href="/auth/login">Se connecter</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}