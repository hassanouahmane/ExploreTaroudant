"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Compass, Star, ArrowRight } from "lucide-react" // Removed 'shadow'
import FeaturedPlaces from "@/components/featured-places"
import UpcomingEvents from "@/components/upcoming-events"

export default function HomePage() {
    return (
        <div className="pb-20 space-y-32 bg-slate-50/50">
            {/* --- HERO SECTION --- */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070"
                    alt="Remparts historiques de Taroudant au coucher du soleil"
                    fill
                    className="object-cover scale-105"
                    priority
                />
                {/* Overlay sophistiqué */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-900/40 to-transparent" />
                
                <div className="relative z-10 container mx-auto px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl space-y-8"
                    >
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl">
                                Explorez <br />
                                <span className="text-amber-500">Taroudant</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-200 max-w-xl font-medium leading-relaxed drop-shadow-md">
                                Découvrez l'authenticité de la "Petite Marrakech", une cité millénaire protégée par ses remparts de pisé.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-5 pt-4">
                            {/* Changed size="xl" to size="lg" and added h-14 for extra height */}
                            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-10 text-lg font-bold transition-all hover:scale-105 shadow-xl shadow-amber-900/20 h-14" asChild>
                                <Link href="/places">Commencer l'exploration</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 rounded-full px-10 text-lg font-bold backdrop-blur-md transition-all hover:border-white shadow-xl h-14" asChild>
                                <Link href="/activities">Activités locales</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Badge flottant décoratif */}
                <div className="absolute bottom-10 right-10 hidden md:block">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl text-white">
                        <p className="text-amber-500 font-black text-3xl">3000+</p>
                        <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Années d'histoire</p>
                    </div>
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Pourquoi Taroudant ?</h2>
                        <p className="text-slate-500 text-lg font-medium italic">Une immersion totale dans le Sud Marocain.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div key={idx} whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
                            <Card className="h-full border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden group">
                                <div className="relative h-44 overflow-hidden">
                                    <Image src={feature.img} alt={feature.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                                </div>
                                <CardHeader className="pt-0 relative -mt-10">
                                    <div className="bg-white rounded-2xl p-4 shadow-lg w-fit mb-4">
                                        <feature.icon className="h-8 w-8 text-amber-600" />
                                    </div>
                                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                                    <CardDescription className="font-medium text-slate-600 leading-relaxed">
                                        {feature.desc}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- PHOTO GALLERY --- */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-[600px]">
                    <div className="relative rounded-[3rem] overflow-hidden group col-span-2 row-span-1 md:row-span-2">
                        <Image src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2071" alt="Remparts" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors" />
                        <div className="absolute bottom-8 left-8 text-white"><p className="text-2xl font-black italic uppercase tracking-tighter">Les Remparts d'Or</p></div>
                    </div>
                    <div className="relative rounded-[3rem] overflow-hidden group">
                        <Image src="https://images.unsplash.com/photo-1570789210967-2cac24afeb00?q=80&w=2070" alt="Souk" fill className="object-cover" />
                        <div className="absolute inset-0 bg-amber-900/20" />
                    </div>
                    <div className="relative rounded-[3rem] overflow-hidden group bg-emerald-900 flex items-center justify-center text-center p-8">
                         <div className="text-white space-y-4">
                            <Star className="mx-auto text-amber-400 h-10 w-10 fill-amber-400" />
                            <p className="font-bold text-xl leading-tight">"La ville la plus authentique du Souss"</p>
                            <p className="text-xs font-medium opacity-60 uppercase tracking-widest">National Geographic</p>
                         </div>
                    </div>
                    <div className="relative rounded-[3rem] overflow-hidden group col-span-2">
                        <Image src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2070" alt="Palmeraie" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/30" />
                    </div>
                </div>
            </section>

            {/* --- FEATURED PLACES --- */}
            <section className="container mx-auto px-4 bg-white py-24 rounded-[4rem] shadow-sm border border-slate-100">
                <div className="mb-16">
                    <h2 className="text-4xl font-black text-slate-900 mb-4">Lieux Incontournables</h2>
                    <p className="text-slate-500 max-w-xl font-medium">Les trésors architecturaux et historiques à ne pas manquer lors de votre séjour.</p>
                </div>
                <FeaturedPlaces />
            </section>

            {/* --- UPCOMING EVENTS --- */}
            <section className="relative py-32 overflow-hidden bg-slate-950 rounded-t-[5rem]">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter italic">L'Agenda Culturel</h2>
                            <p className="text-amber-200/70 text-lg font-medium">Festivals, moussems et traditions en direct.</p>
                        </div>
                        <Button variant="ghost" className="text-white border border-white/20 rounded-full h-14 px-8 hover:bg-white hover:text-slate-950 font-bold" asChild>
                            <Link href="/events">Explorer l'agenda complet <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                    <UpcomingEvents />
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="container mx-auto px-4 -mt-16">
                <Card className="relative overflow-hidden border-none rounded-[4rem] bg-amber-500 shadow-2xl shadow-amber-200">
                    <CardContent className="relative z-10 p-16 md:p-24 text-center space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Prêt pour l'aventure ?</h2>
                        <p className="text-xl text-amber-950/80 max-w-2xl mx-auto font-medium">
                            Rejoignez la communauté Explore Taroudant et profitez de guides locaux certifiés pour une expérience inoubliable.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                            <Button size="lg" className="bg-slate-950 text-white hover:bg-slate-800 rounded-full px-12 font-black shadow-2xl h-14" asChild>
                                <Link href="/auth/register">Créer un compte</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-2 border-slate-950/20 text-slate-950 hover:bg-amber-600 rounded-full px-12 font-black transition-all h-14" asChild>
                                <Link href="/auth/login">Se connecter</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}

const features = [
    {
        title: "Patrimoine",
        desc: "Remparts du XVIe siècle et architecture berbère préservée.",
        icon: MapPin,
        img: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=2070"
    },
    {
        title: "Immersion",
        desc: "Ateliers d'artisanat du cuir et bijoux en argent massif.",
        icon: Compass,
        img: "https://images.unsplash.com/photo-1566522650166-bd8b3e3a2b4b?q=80&w=2071"
    },
    {
        title: "Festivités",
        desc: "Participez aux moussems traditionnels et festivals de musique.",
        icon: Calendar,
        img: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070"
    },
    {
        title: "Expertise",
        desc: "Guides locaux passionnés pour une découverte hors des sentiers battus.",
        icon: Star,
        img: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?q=80&w=2074"
    }
]