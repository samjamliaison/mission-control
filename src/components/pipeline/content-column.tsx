"use client"

import { Droppable } from "@hello-pangea/dnd"
import { motion } from "framer-motion"
import { ContentItemCard } from "./content-item-card"
import { ContentItem } from "@/types/content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Clapperboard, Eye, Rocket, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { StaggeredList } from "@/components/ui/staggered-list"

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
  onViewContent: (content: ContentItem) => void
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
      ease: [0.04, 0.62, 0.23, 0.98] as any
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
                  {stage === 'idea' && "Conceptualization"}
                  {stage === 'script' && "Writing"}
                  {stage === 'thumbnail' && "Design"}
                  {stage === 'filming' && "Production"}
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
          {(stage === "filming" || stage === "thumbnail") && content.length > 0 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className={cn(
                "h-1 rounded-full mt-3 bg-gradient-to-r",
                stage === "filming" ? stageStyle.gradientFrom : stageStyle.gradientFrom,
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
                  "min-h-[520px] transition-all duration-300 rounded-xl p-3 relative overflow-hidden",
                  snapshot.isDraggingOver && "ring-2 ring-dashed animate-pulse"
                )}
                style={{
                  borderColor: snapshot.isDraggingOver ? `${stageStyle.accentColor}40` : undefined,
                  background: snapshot.isDraggingOver 
                    ? `radial-gradient(circle at center, ${stageStyle.accentColor}12 0%, ${stageStyle.accentColor}04 50%, transparent 70%)`
                    : undefined,
                  boxShadow: snapshot.isDraggingOver 
                    ? `0 0 0 2px ${stageStyle.accentColor}30, 0 0 20px ${stageStyle.accentColor}20, inset 0 0 20px ${stageStyle.accentColor}08`
                    : undefined
                }}
                animate={{
                  scale: snapshot.isDraggingOver ? 1.02 : 1,
                  borderRadius: snapshot.isDraggingOver ? "16px" : "12px"
                }}
                transition={{ 
                  duration: 0.2, 
                  ease: "easeOut" 
                }}
              >
                {/* Enhanced Drop zone indicator */}
                {snapshot.isDraggingOver && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                    }}
                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                  >
                    <motion.div 
                      className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border-2 border-dashed"
                      style={{ 
                        borderColor: `${stageStyle.accentColor}60`,
                        backgroundColor: `${stageStyle.accentColor}15`,
                        boxShadow: `0 0 32px ${stageStyle.accentColor}30`
                      }}
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 1, -1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: 360,
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="relative"
                      >
                        <IconComponent 
                          className="h-12 w-12" 
                          style={{ color: stageStyle.accentColor }}
                          strokeWidth={1.5}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-dashed"
                          style={{ borderColor: `${stageStyle.accentColor}60` }}
                          animate={{
                            rotate: -360,
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                          }}
                        />
                      </motion.div>
                      <motion.p 
                        className="text-sm font-semibold mt-2 text-center"
                        style={{ color: stageStyle.accentColor }}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        Drop here
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}
                
                {content.length > 0 && (
                  <StaggeredList staggerDelay={0.05}>
                    {content.map((item, index) => (
                      <motion.div
                        key={item._id}
                        layout
                        layoutId={`content-${item._id}`}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                        }}
                        exit={{ 
                          opacity: 0, 
                          y: -20, 
                          scale: 0.8,
                          transition: { duration: 0.2 }
                        }}
                        transition={{
                          layout: { 
                            duration: 0.4, 
                            ease: [0.4, 0, 0.2, 1],
                            type: "spring",
                            stiffness: 350,
                            damping: 25
                          },
                          opacity: { duration: 0.3 },
                          scale: { duration: 0.3 }
                        }}
                        style={{
                          zIndex: index
                        }}
                      >
                        <ContentItemCard
                          content={item}
                          index={index}
                          onView={onViewContent}
                          onEdit={onEditContent}
                          onDelete={onDeleteContent}
                        />
                      </motion.div>
                    ))}
                  </StaggeredList>
                )}
                
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
                          {stage === "idea" && "Ready for new ideas"}
                          {stage === "script" && "No scripts in progress"}
                          {stage === "thumbnail" && "No designs in progress"}
                          {stage === "filming" && "No content in production"}
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