import { PageTransition } from "@/components/ui/page-transition"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function CalendarPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-[hsl(var(--command-accent))]" />
          <div>
            <h1 className="text-2xl font-display font-bold">Calendar</h1>
            <p className="text-[hsl(var(--command-text-muted))]">
              Schedule and manage your mission timeline
            </p>
          </div>
        </div>
        
        <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto text-[hsl(var(--command-text-muted))] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
            <p className="text-[hsl(var(--command-text-muted))]">
              Calendar functionality coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}