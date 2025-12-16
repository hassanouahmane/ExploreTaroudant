"use client"

import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: number
  onChange?: (rating: number) => void
  readonly?: boolean
}

export function StarRating({ rating, maxRating = 5, size = 20, onChange, readonly = false }: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            size={size}
            className={`${star <= rating ? "fill-accent text-accent" : "fill-none text-muted-foreground"}`}
          />
        </button>
      ))}
    </div>
  )
}
