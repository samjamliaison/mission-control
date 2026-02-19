'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function SetupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    workspacePath: '/root/.openclaw/workspace',
    configPath: '/root/.openclaw/openclaw.json'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Setup failed')
      }

      // Success - redirect to dashboard
      router.push('/')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Setup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">🎯 Mission Control Setup</CardTitle>
          <CardDescription>
            Welcome! Let's configure your OpenClaw workspace paths.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspacePath">OpenClaw Workspace Path</Label>
              <Input
                id="workspacePath"
                type="text"
                value={formData.workspacePath}
                onChange={(e) => setFormData({ ...formData, workspacePath: e.target.value })}
                placeholder="/root/.openclaw/workspace"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="configPath">OpenClaw Config Path</Label>
              <Input
                id="configPath"
                type="text"
                value={formData.configPath}
                onChange={(e) => setFormData({ ...formData, configPath: e.target.value })}
                placeholder="/root/.openclaw/openclaw.json"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating paths...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}