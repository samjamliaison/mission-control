"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ReactNode } from "react"

interface ParallaxHeaderProps {
  children: ReactNode
  className?: string
  parallaxStrength?: number
  backgroundElement?: ReactNode
}

export function ParallaxHeader({ 
  children, 
  className = "",
  parallaxStrength = 0.3,
  backgroundElement
}: ParallaxHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${parallaxStrength * 100}%`])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {backgroundElement && (
        <motion.div 
          style={{ y }}
          className="absolute inset-0 -z-10"
        >
          {backgroundElement}
        </motion.div>
      )}
      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  )
}