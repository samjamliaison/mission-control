"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Clock, Timer } from "lucide-react"
import { useTimeTracking } from "@/hooks/use-time-tracking"
import { cn } from "@/lib/utils"

interface TimeTrackerProps {
  taskId: string
  compact?: boolean
  className?: string
}

export function TimeTracker({ taskId, compact = false, className }: TimeTrackerProps) {
  const {
    toggleTracking,
    getTaskTimeData,
    getTotalTime,
    formatTime
  } = useTimeTracking()

  const taskTimeData = getTaskTimeData(taskId)
  const isTracking = taskTimeData?.isTracking || false
  const totalTime = getTotalTime(taskId)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleTracking(taskId)
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className={cn(
            "h-6 w-6 p-0 rounded-md transition-colors",
            isTracking
              ? "text-[hsl(var(--command-accent))] bg-[hsl(var(--command-accent))]/10 hover:bg-[hsl(var(--command-accent))]/20"
              : "text-[hsl(var(--command-text-muted))] hover:text-[hsl(var(--command-accent))] hover:bg-[hsl(var(--command-accent))]/10"
          )}
          title={isTracking ? "Stop tracking time" : "Start tracking time"}
        >
          <motion.div
            animate={isTracking ? {
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            } : {}}
            transition={isTracking ? {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          >
            {isTracking ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </motion.div>
        </Button>

        {totalTime > 0 && (
          <Badge
            variant="outline"
            className={cn(
              "text-xs px-1.5 py-0.5 h-5 font-mono",
              isTracking
                ? "bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))]/20"
                : "bg-muted/50 text-muted-foreground border-border"
            )}
          >
            <Clock className="h-2.5 w-2.5 mr-1" />
            {formatTime(totalTime)}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-3 p-2 rounded-lg glass-morphism", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-2 transition-all",
          isTracking
            ? "text-[hsl(var(--command-accent))] bg-[hsl(var(--command-accent))]/10 hover:bg-[hsl(var(--command-accent))]/20"
            : "text-[hsl(var(--command-text-muted))] hover:text-[hsl(var(--command-accent))] hover:bg-[hsl(var(--command-accent))]/10"
        )}
      >
        <motion.div
          animate={isTracking ? {
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          } : {}}
          transition={isTracking ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        >
          {isTracking ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </motion.div>
        {isTracking ? "Stop" : "Start"}
      </Button>

      <div className="flex items-center gap-2">
        <Timer className={cn(
          "h-4 w-4",
          isTracking ? "text-[hsl(var(--command-accent))]" : "text-[hsl(var(--command-text-muted))]"
        )} />
        <div className="font-mono text-sm">
          {formatTime(totalTime)}
        </div>
      </div>

      {isTracking && (
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-2 h-2 bg-[hsl(var(--command-accent))] rounded-full"
        />
      )}
    </div>
  )
}