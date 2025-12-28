"use client"

import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import { MapPin } from "lucide-react"
import type { Review } from "@/lib/types"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  // Sécurité pour la date
  const date = review.createdAt ? new Date(review.createdAt) : new Date();

  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {/* Affiche le nom du lieu si présent (très important pour le dashboard touriste) */}
            {review.place && (
              <div className="flex items-center text-primary text-xs font-bold uppercase tracking-wider mb-1">
                <MapPin className="mr-1 h-3 w-3" />
                {review.place.name}
              </div>
            )}
            <p className="font-semibold text-base leading-none">
              {review.user?.fullName || "Voyageur"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true, locale: fr })}
            </p>
          </div>
          <StarRating rating={review.rating} readonly size={14} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700 leading-relaxed italic">
          "{review.comment}"
        </p>
      </CardContent>
    </Card>
  )
}