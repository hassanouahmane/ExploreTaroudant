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

    // Validations locales
    if (trimmedComment.length < 10) {
      toast({ title: "Erreur", description: "Minimum 10 caractères.", variant: "destructive" })
      return
    }

    setIsSubmitting(true)

    try {
      // CORRECTION ICI : Passer les 3 arguments séparément au lieu d'un objet {}
      // Votre service est défini comme : createReview(placeId, rating, comment)
      await reviewsService.createReview(
        Number(placeId), 
        rating, 
        trimmedComment
      )

      toast({
        title: "Avis publié",
        description: "Merci pour votre partage !",
      })

      setRating(5)
      setComment("")
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Submit Error:", error)
      toast({
        title: "Erreur",
        description: "Impossible de publier l'avis. Vérifiez votre connexion.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const characterCount = comment.length
  const isValidLength = characterCount >= 10 && characterCount <= 500

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
          Votre expérience à {placeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-bold">Note globale</Label>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl w-fit">
              <StarRating rating={rating} onChange={setRating} size={32} />
              <span className="font-black text-lg text-slate-700">{rating}/5</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="comment" className="text-base font-bold">Commentaire</Label>
            <Textarea
              id="comment"
              placeholder="Racontez-nous votre visite..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-2xl border-slate-200 focus:ring-emerald-500 min-h-[150px] text-base"
              disabled={isSubmitting}
              required
            />
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-slate-400">
              <span className={characterCount < 10 ? "text-rose-500" : ""}>Min. 10 caractères</span>
              <span>{characterCount}/500</span>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-lg font-bold shadow-lg shadow-emerald-100" 
            disabled={isSubmitting || !isValidLength}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Publier mon témoignage"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}