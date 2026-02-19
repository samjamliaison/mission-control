"use client"

import { Droppable } from "@hello-pangea/dnd"
import { motion } from "framer-motion"
import { ContentItemCard, ContentItem } from "./content-item-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, FileText, Palette, Video, Rocket, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContentColumnProps {
  title: string
  status: "idea" | "script" | "thumbnail" | "filming" | "published"
  content: ContentItem[]
  onEditContent: (content: ContentItem) => void
  onDeleteContent: (contentId: string) => void
}

const statusConfig = {
  "idea": {
    title: "Ideation",
    icon: Lightbulb,
    color: "text-yellow-400",
    badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    glowColor: "hsl(45 100% 50%)",
    accent: "hsl(45 100% 50%)"
  },
  "script": {
    title: "Scripting", 
    icon: FileText,
    color: "text-blue-400",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    glowColor: "hsl(210 100% 50%)",
    accent: "hsl(210 100% 50%)"
  },
  "thumbnail": {
    title: "Design",
    icon: Palette,
    color: "text-purple-400",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    glowColor: "hsl(270 100% 50%)",
    accent: "hsl(270 100% 50%)"
  },
  "filming": {
    title: "Production",
    icon: Video,
    color: "text-[hsl(var(--command-accent))]",
    badgeColor: "bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))]/20",
    glowColor: "hsl(var(--command-accent))",
    accent: "hsl(var(--command-accent))"
  },
  "published": {
    title: "Published",
    icon: Rocket,
    color: "text-[hsl(var(--command-success))]",
    badgeColor: "bg-[hsl(var(--command-success))]/10 text-[hsl(var(--command-success))] border-[hsl(var(--command-success))]/20",
    glowColor: "hsl(var(--command-success))",
    accent: "hsl(var(--command-success))"
  }
}

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
}

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

export function ContentColumn({ title, status, content, onEditContent, onDeleteContent }: ContentColumnProps) {
  const config = statusConfig[status]
  const IconComponent = config.icon
  
  return (
    <motion.div
      variants={columnVariants}
      initial="hidden"
      animate="visible"
      className="w-full min-w-[300px]"
    >
      <Card className="glass-morphism border-[hsl(var(--command-border-bright))] min-h-[600px] relative overflow-hidden">
        {/* Column glow effect */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${config.accent} 0%, transparent 50%)`
          }}
        />
        
        <CardHeader className="pb-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 glass-morphism rounded-lg">
                <IconComponent className={cn("h-4 w-4", config.color)} />
              </div>
              <CardTitle className={cn("text-sm font-heading font-semibold")}>
                {config.title}
              </CardTitle>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Badge 
                variant="outline" 
                className={cn("text-xs font-bold", config.badgeColor)}
                style={{
                  boxShadow: content.length > 0 ? `0 0 10px ${config.glowColor}20` : undefined
                }}
              >
                {content.length}
              </Badge>
            </motion.div>
          </div>
          
          {/* Progress indicator for active columns */}
          {(status === "filming" || status === "script") && content.length > 0 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className={cn(
                "h-1 rounded-full mt-2",
                status === "filming" ? "bg-gradient-to-r from-[hsl(var(--command-accent))] to-transparent" :
                "bg-gradient-to-r from-blue-400 to-transparent"
              )}
            />
          )}
        </CardHeader>
        
        <CardContent className="pt-0 relative">
          <Droppable droppableId={status}>
            {(provided, snapshot) => (
              <motion.div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "min-h-[520px] transition-all duration-300 rounded-xl p-3 relative",
                  snapshot.isDraggingOver && "bg-[hsl(var(--command-accent))]/5 ring-2 ring-[hsl(var(--command-accent))]/20 ring-dashed"
                )}
                style={{
                  background: snapshot.isDraggingOver 
                    ? `radial-gradient(circle at center, ${config.accent}08 0%, transparent 70%)`
                    : undefined
                }}
              >
                {/* Drop zone indicator */}
                {snapshot.isDraggingOver && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                  >
                    <div className="glass-morphism p-4 rounded-xl">
                      <Circle className={cn("h-8 w-8", config.color)} strokeDasharray="4 4">
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values="0;360"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </Circle>
                    </div>
                  </motion.div>
                )}
                
                {content.map((item, index) => (
                  <motion.div
                    key={item._id}
                    variants={contentVariants}
                    layout
                    layoutId={item._id}
                    transition={{
                      layout: { duration: 0.3, ease: "easeInOut" }
                    }}
                  >
                    <ContentItemCard
                      content={item}
                      index={index}
                      onEdit={onEditContent}
                      onDelete={onDeleteContent}
                    />
                  </motion.div>
                ))}
                
                {provided.placeholder}
                
                {content.length === 0 && !snapshot.isDraggingOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center py-12"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto glass-morphism rounded-full flex items-center justify-center">
                        <IconComponent className={cn("h-5 w-5", config.color)} />
                      </div>
                      <p className="text-[hsl(var(--command-text-dim))] text-sm">
                        {status === "idea" && "Ready for new ideas"}
                        {status === "script" && "No scripts in progress"}
                        {status === "thumbnail" && "No designs pending"}
                        {status === "filming" && "No content in production"}
                        {status === "published" && "No published content"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </Droppable>
        </CardContent>
      </Card>
    </motion.div>
  )
}