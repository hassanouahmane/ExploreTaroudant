import type React from "react"

import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  iconColor?: string
}

export function StatCard({ icon, value, label, iconColor = "text-primary" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl font-bold mb-1">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
          <div className={`${iconColor}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
