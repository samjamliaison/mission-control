"use client"

import { cn } from "@/lib/utils"

interface MiniSparklineProps {
  data: number[]
  className?: string
  color?: string
  animate?: boolean
}

export function MiniSparkline({
  data,
  className,
  color = "currentColor",
  animate = true
}: MiniSparklineProps) {
  if (!data || data.length === 0) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  // Normalize data to 0-1 range
  const normalizedData = data.map(value => (value - min) / range)

  return (
    <div className={cn("flex items-end h-6 gap-[1px] opacity-60", className)}>
      {normalizedData.map((value, index) => (
        <div
          key={index}
          className={cn(
            "bg-current transition-all duration-300 ease-out min-w-[2px] rounded-t-[1px]",
            animate && "animate-pulse"
          )}
          style={{
            height: `${Math.max(value * 100, 8)}%`,
            color: color,
            animationDelay: animate ? `${index * 50}ms` : undefined,
            animationDuration: animate ? '1s' : undefined,
            animationIterationCount: animate ? '1' : undefined
          }}
        />
      ))}
    </div>
  )
}

// Generate mock 7-day trend data
export function generateTrendData(baseValue: number, variance = 0.3): number[] {
  const days = 7
  const data: number[] = []
  let current = baseValue

  for (let i = 0; i < days; i++) {
    // Add some random variation
    const change = (Math.random() - 0.5) * 2 * variance * baseValue
    current = Math.max(0, current + change)
    data.push(Math.round(current))
  }

  return data
}