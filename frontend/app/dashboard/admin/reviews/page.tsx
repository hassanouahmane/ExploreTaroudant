"use client"

import { useEffect, useState } from "react"
import { reviewsService } from "@/services/reviews.service"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Star, 
  Trash2, 
  Loader2, 
  ArrowLeft, 
  MessageSquare, 
  
  Search,
  User as UserIcon,
  MapPin
} from "lucide-react"
import type { Review } from "@/lib/types"
import Link from "next/link"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // État pour la suppression
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      // Note: Si vous n'avez pas de getAll() global, vous pouvez itérer 
      // ou créer une route admin dédiée côté Backend. 
      // Ici nous supposons une route globale ou une récupération par segments.
      const data = await reviewsService.getAllReviewsAdmin() // Route à ajouter au service si besoin
      setReviews(data)
    } catch (error) {
      toast({ title: "Erreur", description: "Chargement des avis échoué", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const confirmDelete = async () => {
    if (!reviewToDelete) return
    try {
      await reviewsService.deleteReview(reviewToDelete)
      toast({ title: "Supprimé", description: "L'avis a été retiré par la modération." })
      loadData()
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" })
    } finally {
      setIsDeleteAlertOpen(false)
      setReviewToDelete(null)
    }
  }

  const filteredReviews = reviews.filter(r => 
    r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.place?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/admin"><ArrowLeft className="mr-2 h-4 w-4"/> Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <MessageSquare className="text-blue-500" /> Modération des Avis
          </h1>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Filtrer par commentaire, utilisateur ou lieu..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Auteur / Lieu</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="w-[40%]">Commentaire</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">Aucun avis trouvé.</TableCell></TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium flex items-center gap-1 text-xs text-blue-600">
                        <UserIcon size={12}/> {review.user?.fullName}
                      </span>
                      <span className="font-semibold flex items-center gap-1 text-xs">
                        <MapPin size={12}/> {review.place?.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm italic text-slate-600">
                    "{review.comment}"
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setReviewToDelete(review.id)
                        setIsDeleteAlertOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet avis ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive. L'avis sera supprimé du lieu et de l'historique de l'utilisateur.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Supprimer l'avis
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}