"use client"

import { useState } from "react"
import { reservationsService } from "@/services/reservations.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, AlertCircle, CheckCircle2 } from "lucide-react"

interface ReservationFormProps {
    activityId: number
    activityTitle?: string
    activityPrice?: number
    onSuccess?: () => void
}

export function ReservationForm({
                                    activityId,
                                    activityTitle,
                                    activityPrice,
                                    onSuccess
                                }: ReservationFormProps) {
    const [date, setDate] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            // UTILISEZ LA BONNE MÉTHODE
            await reservationsService.createActivityReservation(activityId, date)
            setSuccess(true)
            setDate("")

            setTimeout(() => {
                onSuccess?.()
            }, 2000)
        } catch (err: any) {
            console.error("Erreur réservation:", err)
            setError(err.message || "Impossible de créer la réservation")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Réserver cette activité</CardTitle>
            </CardHeader>
            <CardContent>
                {success && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-950 dark:text-green-200">
                        <CheckCircle2 className="h-5 w-5" />
                        <p className="text-sm font-medium">Réservation confirmée avec succès !</p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-950 dark:text-red-200">
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {activityPrice && (
                    <div className="mb-6 rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground mb-1">Prix par personne</p>
                        <p className="text-2xl font-bold text-primary">{activityPrice} MAD</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reservationDate">Date de réservation</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="reservationDate"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                min={new Date().toISOString().split("T")[0]}
                                className="pl-10"
                                disabled={loading || success}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Sélectionnez la date souhaitée pour votre visite
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || success}
                        className="w-full"
                    >
                        {loading && (
                            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        )}
                        {loading
                            ? "Confirmation en cours..."
                            : success
                                ? "Réservation confirmée ✓"
                                : "Confirmer la réservation"
                        }
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}