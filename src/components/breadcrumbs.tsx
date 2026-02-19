"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  name: string
  href: string
  isLast?: boolean
}

const routeNames: Record<string, string> = {
  "": "Home",
  "tasks": "Tasks",
  "pipeline": "Pipeline",
  "calendar": "Calendar",
  "memory": "Memory",
  "activity": "Activity",
  "analytics": "Analytics",
  "notifications": "Notifications",
  "team": "Team",
  "office": "Office",
  "settings": "Settings"
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Build breadcrumb items from current path
  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Home", href: "/" }
    ]

    let currentPath = ""
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      const isLast = index === paths.length - 1

      // Check if it's a dynamic route (like task ID)
      let displayName = routeNames[path] || path

      // For dynamic routes like /tasks/[id], show a more user-friendly name
      if (paths[index - 1] === 'tasks' && !routeNames[path]) {
        // Try to get task name from localStorage or show "Task Details"
        try {
          const tasks = JSON.parse(localStorage.getItem('mission-control-tasks') || '[]')
          const task = tasks.find((t: any) => t.id === path)
          displayName = task?.title || `Task ${path.slice(0, 8)}`
        } catch {
          displayName = "Task Details"
        }
      }

      breadcrumbs.push({
        name: displayName,
        href: currentPath,
        isLast
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = buildBreadcrumbs()

  // Don't show breadcrumbs on home page
  if (pathname === '/') {
    return null
  }

  return (
    <motion.nav
      className="mb-6 px-1"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Breadcrumb navigation"
    >
      <div className="flex items-center gap-2 text-body-small">
        {breadcrumbs.map((item, index) => (
          <motion.div
            key={item.href}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {index === 0 ? (
              <Home className="h-4 w-4 text-white/40" />
            ) : (
              <ChevronRight className="h-3 w-3 text-white/30" />
            )}

            {item.isLast ? (
              <span className="text-white/90 font-medium">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "text-white/60 hover:text-[#06b6d4] transition-colors duration-200 hover:underline",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-opacity-60 focus-visible:rounded-sm"
                )}
              >
                {item.name}
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </motion.nav>
  )
}