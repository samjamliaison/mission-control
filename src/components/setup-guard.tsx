'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSkeleton } from "@/components/ui/loading-skeleton"

interface SetupGuardProps {
  children: React.ReactNode
}

export function SetupGuard({ children }: SetupGuardProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [setupRequired, setSetupRequired] = useState(false)

  useEffect(() => {
    async function checkSetup() {
      try {
        const response = await fetch('/api/setup-status')
        if (response.ok) {
          const status = await response.json()
          if (status.setupRequired) {
            setSetupRequired(true)
            router.push('/setup')
            return
          }
        }
      } catch (error) {
        console.error('Setup check failed:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkSetup()
  }, [router])

  if (isChecking) {
    return <DashboardSkeleton />
  }

  if (setupRequired) {
    return <DashboardSkeleton />
  }

  return <>{children}</>
}