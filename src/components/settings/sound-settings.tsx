"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MicroToggle } from "@/components/ui/micro-interactions"
import { useSoundSettings } from "@/lib/sound-system"
import { Volume2, VolumeX, Play, TestTube } from "lucide-react"

export function SoundSettings() {
  const { 
    soundEnabled, 
    toggleSound,
    playNotificationPing,
    playTaskComplete,
    playButtonClick,
    playSuccess,
    playDelete 
  } = useSoundSettings()

  const soundSamples = [
    {
      name: "Notification Ping",
      description: "New notification received",
      action: playNotificationPing,
      icon: "🔔"
    },
    {
      name: "Task Complete",
      description: "Task marked as complete",
      action: playTaskComplete,
      icon: "✅"
    },
    {
      name: "Button Click",
      description: "Button and UI interactions",
      action: playButtonClick,
      icon: "👆"
    },
    {
      name: "Success",
      description: "Successful operations",
      action: playSuccess,
      icon: "🎉"
    },
    {
      name: "Delete",
      description: "Item deletion",
      action: playDelete,
      icon: "🗑️"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          Sound Effects
          <Badge variant={soundEnabled ? "default" : "secondary"} className="text-xs">
            {soundEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium text-white/90">Enable Sound Effects</p>
            <p className="text-sm text-white/60">
              Play subtle sounds for notifications and interactions
            </p>
          </div>
          <MicroToggle 
            checked={soundEnabled}
            onChange={toggleSound}
          />
        </div>

        {soundEnabled && (
          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 mb-4">
              <TestTube className="h-4 w-4 text-cyan-400" />
              <h4 className="font-medium text-white/90">Sound Samples</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {soundSamples.map((sample) => (
                <div
                  key={sample.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{sample.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-white/90">{sample.name}</p>
                      <p className="text-xs text-white/60">{sample.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={sample.action}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="text-xs text-white/50 mt-4 p-3 rounded-lg bg-white/[0.02]">
              💡 <strong>Pro tip:</strong> Sounds are generated using Web Audio API - no files downloaded! 
              Keep volume comfortable for your environment.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}