"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar,
  BookOpen,
  Lightbulb,
  Clock,
  Tag,
  Eye,
  FileText
} from "lucide-react"
import { MemoryEntry } from "./memory-entry"
import { cn } from "@/lib/utils"

interface MemoryCardProps {
  memory: MemoryEntry
  onClick: () => void
}

const categoryConfig = {
  "daily": {
    icon: Calendar,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "0 0 15px hsl(210 100% 50% / 0.3)",
    label: "Daily Notes"
  },
  "knowledge": {
    icon: BookOpen,
    color: "text-green-400", 
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    glow: "0 0 15px hsl(142 69% 58% / 0.3)",
    label: "Knowledge"
  },
  "lessons": {
    icon: Lightbulb,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10", 
    border: "border-yellow-500/20",
    glow: "0 0 15px hsl(45 100% 50% / 0.3)",
    label: "Lessons"
  }
}

export function MemoryCard({ memory, onClick }: MemoryCardProps) {
  const config = categoryConfig[memory.category]
  const IconComponent = config.icon
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const getContentPreview = (content: string) => {
    // Remove markdown headers and get first paragraph
    const cleaned = content
      .replace(/^#.*/gm, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .trim()
    
    const firstParagraph = cleaned.split('\n\n')[0]
    return firstParagraph.length > 200 
      ? firstParagraph.slice(0, 200) + '...'
      : firstParagraph
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1] as any
      }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card
        className="glass-morphism-premium border-[hsl(var(--command-border-bright))] h-full relative overflow-hidden card-hover-premium group"
        style={{
          boxShadow: `0 4px 20px rgba(0,0,0,0.1), ${config.glow}`
        }}
      >
        {/* Category glow overlay */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 0% 50%, ${config.color.replace('text-', 'hsl(var(--command-')} 0%, transparent 50%)`
          }}
        />

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${config.color.replace('text-', 'hsl(var(--command-')} 0%, transparent 70%)`
          }}
        />

        <CardHeader className="pb-3 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className={cn(
                    "p-1.5 rounded-lg glass-morphism",
                    config.bg,
                    config.border
                  )}
                  style={{ boxShadow: config.glow }}
                >
                  <IconComponent className={cn("h-3 w-3", config.color)} />
                </div>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs px-2 py-0.5",
                    config.bg,
                    config.color,
                    config.border
                  )}
                >
                  {config.label}
                </Badge>
              </div>
              <h3 className="font-heading font-semibold text-base leading-tight group-hover:text-[hsl(var(--command-accent))] transition-colors">
                {memory.title}
              </h3>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4 relative">
          {/* Content Preview */}
          <p className="text-xs text-[hsl(var(--command-text-muted))] line-clamp-4 leading-relaxed">
            {getContentPreview(memory.content)}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {memory.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs px-2 py-0.5 bg-[hsl(var(--command-surface))]/50 border-[hsl(var(--command-border))]"
              >
                #{tag}
              </Badge>
            ))}
            {memory.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-0.5 bg-[hsl(var(--command-surface))]/50 border-[hsl(var(--command-border))] text-[hsl(var(--command-text-dim))]"
              >
                +{memory.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-[hsl(var(--command-text-dim))]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDate(memory.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{memory.wordCount}w</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>{memory.tags.length}</span>
            </div>
          </div>

          {/* Read More Indicator */}
          <motion.div
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
          >
            <div className="glass-morphism p-1.5 rounded-lg">
              <FileText className="h-3 w-3 text-[hsl(var(--command-accent))]" />
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}