"use client"

import { forwardRef } from "react"
import { Button, ButtonProps } from "./button"
import { soundSystem } from "@/lib/sound-system"

interface SoundButtonProps extends ButtonProps {
  soundType?: 'click' | 'success' | 'delete' | 'toggle' | 'none'
}

export const SoundButton = forwardRef<HTMLButtonElement, SoundButtonProps>(
  ({ soundType = 'click', onClick, variant, ...props }, ref) => {
    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      // Play sound before calling original onClick
      if (soundType !== 'none') {
        try {
          switch (soundType) {
            case 'click':
              await soundSystem.playButtonClick()
              break
            case 'success':
              await soundSystem.playSuccess()
              break
            case 'delete':
              await soundSystem.playDelete()
              break
            case 'toggle':
              await soundSystem.playToggle()
              break
          }
        } catch (error) {
          // Silently fail - don't block interaction
          console.debug('Sound playback failed:', error)
        }
      }

      // Call original onClick
      onClick?.(e)
    }

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        variant={variant}
        {...props}
      />
    )
  }
)

SoundButton.displayName = "SoundButton"