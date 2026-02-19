"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MicroButton, MicroToggle, MicroCheckbox, useDeleteFlash, useSuccessPulse } from "@/components/ui/micro-interactions"
import { Trash2, Check, Plus, Settings, Heart } from "lucide-react"

export function MicroInteractionsDemo() {
  const [toggle, setToggle] = useState(false)
  const [checkbox, setCheckbox] = useState(false)
  const { triggerFlash, flashClass } = useDeleteFlash()
  const { triggerPulse, pulseClass } = useSuccessPulse()

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">Micro-Interactions Demo</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Button Interactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <MicroButton variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Primary Button
            </MicroButton>
            
            <MicroButton variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Outline Button
            </MicroButton>
            
            <MicroButton 
              variant="destructive"
              onClick={() => triggerFlash()}
              className={flashClass}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete (with flash)
            </MicroButton>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Toggle & Checkbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <MicroToggle 
              checked={toggle} 
              onChange={setToggle}
            />
            <span className="text-white/70">Toggle switch with smooth slide</span>
          </div>
          
          <div className="flex items-center gap-4">
            <MicroCheckbox 
              checked={checkbox} 
              onChange={(checked) => {
                setCheckbox(checked)
                if (checked) {
                  triggerPulse()
                }
              }}
              className={pulseClass}
            />
            <span className="text-white/70">Checkbox with checkmark animation</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Card Hover Effects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70 mb-4">Hover over cards to see translateY and shadow effects:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-400" />
                <div>
                  <h4 className="font-semibold text-white">Card 1</h4>
                  <p className="text-sm text-white/60">Hover me!</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400" />
                <div>
                  <h4 className="font-semibold text-white">Card 2</h4>
                  <p className="text-sm text-white/60">Smooth animations</p>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Success Animation</CardTitle>
        </CardHeader>
        <CardContent>
          <MicroButton 
            variant="primary"
            onClick={() => triggerPulse()}
            className={pulseClass}
          >
            <Check className="w-4 h-4 mr-2" />
            Trigger Success Pulse
          </MicroButton>
        </CardContent>
      </Card>
    </div>
  )
}