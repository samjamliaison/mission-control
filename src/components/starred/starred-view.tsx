"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StaggeredList } from "@/components/ui/staggered-list"
import Link from "next/link"
import {
  Star,
  CheckSquare,
  Film,
  Brain,
  Activity,
  Users,
  Trash2,
  Search,
  Filter,
  Calendar,
  ArrowRight
} from "lucide-react"
import { useStarred } from "@/hooks/use-starred"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1] as any
    }
  }
}

const typeColors = {
  task: "text-[hsl(var(--command-accent))]",
  content: "text-purple-400",
  memory: "text-green-400",
  pipeline: "text-blue-400",
  agent: "text-orange-400"
}

const typeIcons = {
  task: CheckSquare,
  content: Film,
  memory: Brain,
  pipeline: Activity,
  agent: Users
}

export function StarredView() {
  const { starredItems, toggleStar, clearAll } = useStarred()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  // Filter starred items
  const filteredItems = starredItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    return matchesSearch && matchesType
  })

  // Group by type
  const itemsByType = filteredItems.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = []
    acc[item.type].push(item)
    return acc
  }, {} as Record<string, typeof filteredItems>)

  const types = Object.keys(itemsByType).sort()
  const uniqueTypes = [...new Set(starredItems.map(item => item.type))]

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
      <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--command-background))] via-[hsl(220_13%_3%)] to-[hsl(var(--command-background))] pointer-events-none" />

      <motion.div
        className="relative z-10 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          <PageHeader
            icon={Star}
            title="Starred Items"
            subtitle={`${starredItems.length} items marked as favorites. Quick access to your most important content.`}
          />

          {/* Search and Filters */}
          <motion.div variants={itemVariants}>
            <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(var(--command-text-muted))]" />
                    <Input
                      placeholder="Search starred items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-[hsl(var(--command-text-muted))]" />
                    <div className="flex gap-2">
                      <Button
                        variant={filterType === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType("all")}
                      >
                        All
                      </Button>
                      {uniqueTypes.map((type) => (
                        <Button
                          key={type}
                          variant={filterType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilterType(type)}
                          className="capitalize"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {starredItems.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAll}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Starred Items */}
          {filteredItems.length > 0 ? (
            <div className="space-y-8">
              {types.map((type) => {
                const items = itemsByType[type]
                const TypeIcon = typeIcons[type as keyof typeof typeIcons]
                
                return (
                  <motion.div key={type} variants={itemVariants}>
                    <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TypeIcon className={cn("h-5 w-5", typeColors[type as keyof typeof typeColors])} />
                            <span className="capitalize">{type}s</span>
                          </div>
                          <Badge variant="outline" className="bg-yellow-400/10 text-yellow-400">
                            {items.length} starred
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.05}>
                          {items.map((item) => (
                            <motion.div
                              key={`${item.type}-${item.id}`}
                              className="relative group"
                              whileHover={{ scale: 1.02, y: -2 }}
                            >
                              <Link href={item.url || `/${item.type}s`} className="block">
                                <div className="p-4 glass-morphism rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                                  <div className="flex items-start gap-3">
                                    <TypeIcon className={cn("h-4 w-4 mt-1", typeColors[item.type as keyof typeof typeColors])} />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm mb-1 truncate">{item.title}</div>
                                      <div className="text-xs text-[hsl(var(--command-text-muted))] mb-2">
                                        Starred {new Date(item.timestamp).toLocaleDateString()}
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-xs capitalize">
                                          {item.type}
                                        </Badge>
                                        <ArrowRight className="h-3 w-3 text-[hsl(var(--command-text-muted))] opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                              
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  toggleStar(item)
                                }}
                                className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-accent"
                                title="Remove from favorites"
                              >
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                              </button>
                            </motion.div>
                          ))}
                        </StaggeredList>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardContent className="py-12">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto glass-morphism rounded-full flex items-center justify-center">
                      <Star className="h-8 w-8 text-[hsl(var(--command-text-muted))]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-contrast-high mb-2">
                        {starredItems.length === 0 ? "No starred items yet" : "No matching items"}
                      </h3>
                      <p className="text-[hsl(var(--command-text-muted))] mb-4">
                        {starredItems.length === 0 
                          ? "Star your favorite tasks, content, and memories for quick access."
                          : "Try adjusting your search or filter criteria."
                        }
                      </p>
                      {starredItems.length === 0 && (
                        <div className="flex justify-center gap-4">
                          <Link href="/tasks">
                            <Button variant="outline">
                              <CheckSquare className="h-4 w-4 mr-2" />
                              View Tasks
                            </Button>
                          </Link>
                          <Link href="/pipeline">
                            <Button variant="outline">
                              <Film className="h-4 w-4 mr-2" />
                              View Content
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}