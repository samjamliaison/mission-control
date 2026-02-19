"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { ReactNode } from "react"

interface PageTransitionProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
}

export function PageTransition({ children, ...props }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: -10, y: 5 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
        type: "tween"
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}