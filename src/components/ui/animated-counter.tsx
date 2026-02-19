"use client"

import { useEffect, useRef } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({
  value,
  duration = 2,
  className = "",
  prefix = "",
  suffix = ""
}: AnimatedCounterProps) {
  const springValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0.2,
  })

  const displayValue = useTransform(springValue, (latest) =>
    Math.floor(latest)
  )

  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    if (!hasAnimatedRef.current) {
      springValue.set(value)
      hasAnimatedRef.current = true
    }
  }, [springValue, value])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      {prefix}
      <motion.span>
        {displayValue}
      </motion.span>
      {suffix}
    </motion.span>
  )
}