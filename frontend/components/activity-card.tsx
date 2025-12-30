"use client"

import Link from "next/link"
import { Clock, MapPin, User, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Activity } from "@/lib/types"

interface ActivityCardProps {
  activity: Activity
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Link href={`/activities/${activity.id}`} className="block h-full">
      <Card className="h-full border-l-4 border-l-amber-500 border-t-0 border-r-0 border-b-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-hidden group flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-xl font-black tracking-tight line-clamp-2 group-hover:text-amber-600 transition-colors">
              {activity.title}
            </CardTitle>
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 font-bold text-sm px-3 py-1 whitespace-nowrap shadow-sm">
              {activity.price} MAD
            </Badge>
          </div>
          <CardDescription className="space-y-2 pt-2">
            <div className="flex flex-wrap gap-y-2 gap-x-4">
              <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium bg-slate-50 px-2 py-1 rounded-md">
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                <span className="line-clamp-1">{activity.place?.name || "Lieu à définir"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium bg-slate-50 px-2 py-1 rounded-md">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>{activity.duration}</span>
              </div>
            </div>
             {activity.guide?.user?.fullName && (
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium pt-1 pl-1">
                  <User className="h-3 w-3 opacity-70" />
                  <span>Guide : {activity.guide.user.fullName}</span>
                </div>
              )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-4 flex-grow">
          <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed font-medium italic">
            {activity.description || "Aucune description disponible pour le moment."}
          </p>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0">
            <div className="text-amber-600 text-sm font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-[-10px] group-hover:translate-x-0">
                Voir les détails <ArrowRight className="ml-2 h-4 w-4" />
            </div>
        </CardFooter>
      </Card>
    </Link>
  )
}