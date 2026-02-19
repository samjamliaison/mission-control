"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card"
import { Badge } from "./badge"
import { Button } from "./button"
import { Activity, CheckCircle, Clock } from "lucide-react"

/**
 * Demo component showcasing the consistent card design system
 * - backdrop-blur-xl bg-white/[0.03] border border-white/[0.06]
 * - rounded-xl overflow-hidden
 * - Hover: scale(1.01) + border-white/[0.12] + subtle shadow
 * - Transition: all 200ms ease
 */
export function CardDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* Basic Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-[#22c55e]" />
            Basic Card
          </CardTitle>
          <CardDescription>
            Standard card with consistent styling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            This demonstrates the base card component with the unified design system.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Action</Button>
        </CardFooter>
      </Card>

      {/* Content Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#06b6d4]" />
            Content Card
          </CardTitle>
          <CardDescription>
            Card with various content elements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Status</span>
            <Badge className="bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20">
              Active
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Priority</span>
            <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20">
              Medium
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#f59e0b]" />
            Stats Card
          </CardTitle>
          <CardDescription>
            Card displaying metrics and numbers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#22c55e] mb-2">
            87%
          </div>
          <p className="text-sm text-white/50">
            Completion rate across all tasks
          </p>
        </CardContent>
        <CardFooter>
          <div className="w-full bg-white/[0.06] rounded-full h-2">
            <div className="bg-[#22c55e] h-2 rounded-full" style={{ width: '87%' }} />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}