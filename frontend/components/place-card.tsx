import Link from "next/link"
import { MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Place } from "@/lib/types"

interface PlaceCardProps {
  place: Place
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link href={`/places/${place.id}`}>
      <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={place.imageUrl || `/placeholder.svg?height=200&width=400&query=${place.name}+${place.city}`}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{place.name}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {place.city}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{place.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
