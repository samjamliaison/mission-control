"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface StaggeredListProps {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
  direction?: "up" | "down" | "left" | "right"
}

export function StaggeredList({ 
  children, 
  className = "",
  staggerDelay = 0.05,
  direction = "up"
}: StaggeredListProps) {
  const getDirectionOffset = () => {
    switch (direction) {
      case "up": return { y: 20, x: 0 }
      case "down": return { y: -20, x: 0 }
      case "left": return { x: 20, y: 0 }
      case "right": return { x: -20, y: 0 }
      default: return { y: 20, x: 0 }
    }
  }

  const offset = getDirectionOffset()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      ...offset
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}