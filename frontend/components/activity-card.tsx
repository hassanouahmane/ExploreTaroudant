import Link from "next/link"
import { Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Activity } from "@/lib/types"

interface ActivityCardProps {
  activity: Activity
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Link href={`/activities/${activity.id}`}>
      <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={`/.jpg?height=200&width=400&query=${activity.title}+Morocco+activity`}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground font-bold">
            {activity.price} MAD
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{activity.title}</CardTitle>
          <CardDescription className="space-y-1">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {activity.place?.name || "Lieu non spécifié"}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {activity.duration}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
