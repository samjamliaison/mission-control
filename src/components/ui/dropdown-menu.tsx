"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, asChild, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)

  if (asChild) {
    const childElement = children as React.ReactElement
    const newProps = {
      onClick: (e: React.MouseEvent) => {
        setIsOpen(!isOpen)
        const originalOnClick = (childElement.props as any).onClick
        if (originalOnClick) originalOnClick(e)
      },
      'data-dropdown-trigger': true,
    }
    return React.cloneElement(childElement, newProps as any)
  }

  return (
    <button
      ref={ref}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
    </button>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

interface DropdownMenuContentProps {
  align?: "start" | "center" | "end"
  children: React.ReactNode
  className?: string
}

const DropdownMenuContent = ({ children, align = "start", className }: DropdownMenuContentProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const trigger = (e.target as Element)?.closest('[data-dropdown-trigger]')
      if (trigger) {
        setIsOpen(!isOpen)
      } else {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
            align === "end" && "right-0",
            align === "center" && "left-1/2 transform -translate-x-1/2",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const DropdownMenuItem = ({ children, onClick, className }: DropdownMenuItemProps) => {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const DropdownMenuSeparator = () => {
  return <div className="-mx-1 my-1 h-px bg-muted" />
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}