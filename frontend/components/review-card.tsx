import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import type { Review } from "@/lib/types"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold">{review.user?.fullName || "Utilisateur"}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: fr })}
            </p>
          </div>
          <StarRating rating={review.rating} readonly size={16} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{review.comment}</p>
      </CardContent>
    </Card>
  )
}
