"use client"

import dynamic from 'next/dynamic'
import { PageTransition } from "@/components/ui/page-transition"
import { PageHeader } from "@/components/ui/page-header"
import { StatsCard } from "@/components/ui/stats-card"
import { PageSkeleton } from "@/components/ui/loading-skeleton"
import { Settings, Database } from "lucide-react"

const DataManagement = dynamic(() => import("@/components/settings/data-management").then(mod => ({ default: mod.DataManagement })), {
  loading: () => <div className="p-6"><PageSkeleton /></div>
})

export default function SettingsPage() {
  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-5rem)] relative">
        {/* Command Center Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--command-background))] via-[hsl(220_13%_3%)] to-[hsl(var(--command-background))] pointer-events-none" />
        
        <div className="relative z-10 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <PageHeader
              icon={Settings}
              title="Mission Settings"
              subtitle="Configure your command center preferences and manage your operational data. Maintain control over your digital mission parameters."
            >
              <StatsCard
                icon={Database}
                label="Data Control"
                value="Active"
                subLabel="Storage"
                subValue="Local"
              />
            </PageHeader>

            {/* Data Management Section */}
            <DataManagement />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}