import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/lib/types"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const startDate = parseISO(event.startDate)
  const endDate = parseISO(event.endDate)
  const isUpcoming = startDate > new Date()

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={`/.jpg?height=200&width=400&query=${event.title}+Morocco+festival+event`}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {isUpcoming && (
            <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground font-semibold">À venir</Badge>
          )}
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{event.title}</CardTitle>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(startDate, "d MMM yyyy", { locale: fr })}
              {startDate.getTime() !== endDate.getTime() && ` - ${format(endDate, "d MMM yyyy", { locale: fr })}`}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
