"use client"

import { Droppable } from "@hello-pangea/dnd"
import { motion } from "framer-motion"
import { ContentItemCard } from "./content-item-card"
import { ContentItem } from "@/types/content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Clapperboard, Eye, Rocket, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContentColumnProps {
  title: string
  stage: "idea" | "script" | "thumbnail" | "filming" | "published"
  content: ContentItem[]
  config?: {
    title: string
    color: string
    bg: string
    icon: string
  }
  onEditContent: (content: ContentItem) => void
  onDeleteContent: (contentId: string) => void
}

const stageIcons: Record<string, any> = {
  "idea": Lightbulb,
  "script": Clapperboard,
  "thumbnail": Eye,
  "filming": Clapperboard,
  "published": Rocket
}

const stageConfig: Record<string, any> = {
  "idea": {
    title: "Ideation",
    color: "hsl(var(--command-text-muted))",
    accentColor: "#8b8b8b",
    gradientFrom: "from-gray-500/20",
    gradientTo: "to-transparent",
    glowColor: "var(--command-text-muted)"
  },
  "script": {
    title: "Scripting",
    color: "hsl(var(--command-accent))",
    accentColor: "#06b6d4",
    gradientFrom: "from-cyan-500/20",
    gradientTo: "to-transparent",
    glowColor: "var(--command-accent)"
  },
  "thumbnail": {
    title: "Design",
    color: "hsl(var(--command-warning))",
    accentColor: "#f59e0b",
    gradientFrom: "from-amber-500/20",
    gradientTo: "to-transparent",
    glowColor: "var(--command-warning)"
  },
  "filming": {
    title: "Production",
    color: "#a855f7",
    accentColor: "#a855f7",
    gradientFrom: "from-purple-500/20",
    gradientTo: "to-transparent",
    glowColor: "#a855f7"
  },
  "published": {
    title: "Published",
    color: "hsl(var(--command-success))",
    accentColor: "#22c55e",
    gradientFrom: "from-green-500/20",
    gradientTo: "to-transparent",
    glowColor: "var(--command-success)"
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

export function ContentColumn({ title, stage, content, config, onEditContent, onDeleteContent }: ContentColumnProps) {
  const stageStyle = stageConfig[stage]
  const IconComponent = stageIcons[stage]
  
  return (
    <motion.div
      variants={columnVariants}
      initial="hidden"
      animate="visible"
      className="w-full min-w-[300px]"
    >
      <Card className="backdrop-blur-xl bg-gradient-to-br from-[hsl(var(--command-surface-elevated))]/95 to-[hsl(var(--command-surface))]/90 border border-white/5 rounded-xl min-h-[600px] relative overflow-hidden">
        {/* Column glow effect */}
        <div 
          className="absolute inset-0 opacity-3 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${stageStyle.accentColor} 0%, transparent 50%)`
          }}
        />
        
        <CardHeader className="pb-4 pt-5 px-5 relative">
          {/* Premium header with count and color coding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-2.5 rounded-xl backdrop-blur-md border"
                style={{
                  backgroundColor: `${stageStyle.accentColor}15`,
                  borderColor: `${stageStyle.accentColor}30`,
                  boxShadow: `0 0 12px ${stageStyle.accentColor}20`
                }}
              >
                <IconComponent 
                  className="h-5 w-5" 
                  style={{ color: stageStyle.accentColor }}
                />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-base font-heading font-semibold text-[hsl(var(--command-text))]">
                  {stageStyle.title}
                </CardTitle>
                <div className="text-xs text-[hsl(var(--command-text-dim))]">
                  {stage === 'ideas' && "Conceptualization"}
                  {stage === 'production' && "Active Creation"}
                  {stage === 'review' && "Quality Check"}
                  {stage === 'published' && "Live Content"}
                </div>
              </div>
            </div>
            
            {/* Enhanced count badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center gap-2"
            >
              <div 
                className="px-3 py-1.5 rounded-lg backdrop-blur-md border text-sm font-bold"
                style={{
                  backgroundColor: `${stageStyle.accentColor}15`,
                  borderColor: `${stageStyle.accentColor}30`,
                  color: stageStyle.accentColor,
                  boxShadow: content.length > 0 ? `0 0 8px ${stageStyle.accentColor}30` : undefined
                }}
              >
                {content.length}
              </div>
            </motion.div>
          </div>
          
          {/* Enhanced progress indicator for active stages */}
          {(stage === "production" || stage === "review") && content.length > 0 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className={cn(
                "h-1 rounded-full mt-3 bg-gradient-to-r",
                stage === "production" ? stageStyle.gradientFrom : stageStyle.gradientFrom,
                stageStyle.gradientTo
              )}
              style={{
                backgroundImage: `linear-gradient(to right, ${stageStyle.accentColor}60, transparent)`
              }}
            />
          )}
        </CardHeader>
        
        <CardContent className="pt-0 pb-5 px-5 relative">
          <Droppable droppableId={stage}>
            {(provided, snapshot) => (
              <motion.div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "min-h-[520px] transition-all duration-300 rounded-xl p-3 relative",
                  snapshot.isDraggingOver && "ring-2 ring-dashed"
                )}
                style={{
                  backgroundColor: snapshot.isDraggingOver ? `${stageStyle.accentColor}08` : undefined,
                  borderColor: snapshot.isDraggingOver ? `${stageStyle.accentColor}30` : undefined,
                  background: snapshot.isDraggingOver 
                    ? `radial-gradient(circle at center, ${stageStyle.accentColor}08 0%, transparent 70%)`
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
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-xl">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Circle 
                          className="h-8 w-8" 
                          style={{ color: stageStyle.accentColor }}
                          strokeDasharray="4 4"
                        />
                      </motion.div>
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
                    <div className="space-y-4">
                      <div 
                        className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center backdrop-blur-md border"
                        style={{
                          backgroundColor: `${stageStyle.accentColor}15`,
                          borderColor: `${stageStyle.accentColor}30`
                        }}
                      >
                        <IconComponent 
                          className="h-5 w-5" 
                          style={{ color: stageStyle.accentColor }}
                        />
                      </div>
                      <div>
                        <p className="text-[hsl(var(--command-text-dim))] text-sm font-medium">
                          {stage === "ideas" && "Ready for new ideas"}
                          {stage === "production" && "No content in production"}
                          {stage === "review" && "No content under review"}
                          {stage === "published" && "No published content"}
                        </p>
                        <p className="text-[hsl(var(--command-text-dim))] text-xs mt-1">
                          Drag content here to update stage
                        </p>
                      </div>
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