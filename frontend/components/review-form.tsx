"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { useToast } from "@/hooks/use-toast"
import { reviewsService } from "@/services/reviews.service"
import { Star, Loader2 } from "lucide-react"

interface ReviewFormProps {
  placeId: number
  placeName: string
  onSuccess?: () => void
}

export function ReviewForm({ placeId, placeName, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedComment = comment.trim()

    if (trimmedComment.length < 10) {
      toast({
        title: "Erreur",
        description: "Votre commentaire doit contenir au moins 10 caractères",
        variant: "destructive",
      })
      return
    }

    if (trimmedComment.length > 500) {
      toast({
        title: "Erreur",
        description: "Votre commentaire ne peut pas dépasser 500 caractères",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await reviewsService.createReview({
        placeId,
        rating,
        comment: trimmedComment,
      })

      toast({
        title: "Avis publié",
        description: "Merci pour votre avis!",
      })

      setRating(5)
      setComment("")
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de publier votre avis. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const characterCount = comment.length
  const isValidLength = characterCount >= 10 && characterCount <= 500

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Écrire un avis
        </CardTitle>
        <CardDescription>{placeName}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Note</Label>
            <div className="flex items-center gap-2">
              <StarRating rating={rating} onChange={setRating} size={28} />
              <span className="text-sm text-muted-foreground">({rating}/5)</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Votre commentaire</Label>
            <Textarea
              id="comment"
              placeholder="Partagez votre expérience avec ce lieu..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              disabled={isSubmitting}
              required
              minLength={10}
              maxLength={500}
            />
            <div className="flex items-center justify-between text-sm">
              <span className={characterCount < 10 ? "text-destructive" : "text-muted-foreground"}>
                Minimum 10 caractères
              </span>
              <span className={characterCount > 500 ? "text-destructive" : "text-muted-foreground"}>
                {characterCount}/500
              </span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || !isValidLength}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publication en cours...
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4" />
                Publier l'avis
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
