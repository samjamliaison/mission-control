"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

// Button with micro-interactions
interface MicroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "primary" | "destructive" | "outline"
}

export function MicroButton({ 
  children, 
  className, 
  variant = "default",
  ...props 
}: MicroButtonProps) {
  return (
    <button
      className={cn(
        "btn-micro btn-ripple px-4 py-2 rounded-lg transition-all",
        variant === "primary" && "bg-spec-accent text-white",
        variant === "destructive" && "bg-spec-danger text-white",
        variant === "outline" && "border border-spec-bright bg-transparent",
        variant === "default" && "bg-spec-surface text-spec-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Card with micro-interactions
interface MicroCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function MicroCard({ children, className, onClick }: MicroCardProps) {
  return (
    <div
      className={cn(
        "card-micro glass-morphism p-4 rounded-lg cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Toggle switch with smooth animation
interface MicroToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function MicroToggle({ checked, onChange, className }: MicroToggleProps) {
  return (
    <div
      className={cn(
        "toggle-switch",
        checked && "checked",
        className
      )}
      onClick={() => onChange(!checked)}
    />
  )
}

// Checkbox with satisfying animation
interface MicroCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function MicroCheckbox({ checked, onChange, className }: MicroCheckboxProps) {
  return (
    <div
      className={cn(
        "checkbox-micro",
        checked && "checked",
        className
      )}
      onClick={() => onChange(!checked)}
    />
  )
}

// Hook for delete flash effect
export function useDeleteFlash() {
  const [isFlashing, setIsFlashing] = useState(false)

  const triggerFlash = (callback?: () => void) => {
    setIsFlashing(true)
    setTimeout(() => {
      setIsFlashing(false)
      callback?.()
    }, 300)
  }

  return {
    isFlashing,
    triggerFlash,
    flashClass: isFlashing ? "delete-flash" : ""
  }
}

// Hook for success pulse effect
export function useSuccessPulse() {
  const [isPulsing, setIsPulsing] = useState(false)

  const triggerPulse = (callback?: () => void) => {
    setIsPulsing(true)
    setTimeout(() => {
      setIsPulsing(false)
      callback?.()
    }, 400)
  }

  return {
    isPulsing,
    triggerPulse,
    pulseClass: isPulsing ? "success-pulse" : ""
  }
}