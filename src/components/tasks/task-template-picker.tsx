"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Search, 
  X, 
  Sparkles, 
  Clock, 
  User, 
  Tag,
  ChevronRight,
  FileText,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TaskTemplate, taskTemplates, getAllCategories } from "@/lib/task-templates"

interface TaskTemplatePickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: TaskTemplate) => void
}

const agentAvatars = {
  "Hamza": "👤",
  "Manus": "🤘",
  "Monica": "✈️", 
  "Jarvis": "🔍",
  "Luna": "🌙"
}

export function TaskTemplatePicker({ open, onOpenChange, onSelectTemplate }: TaskTemplatePickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  const categories = getAllCategories()

  // Filter templates based on search and category
  const filteredTemplates = taskTemplates.filter(template => {
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !selectedCategory || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleSelectTemplate = (template: TaskTemplate) => {
    onSelectTemplate(template)
    onOpenChange(false)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] glass-morphism border-[hsl(var(--command-border-bright))] p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative p-6 pb-4 border-b border-[hsl(var(--command-border))]">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: "linear-gradient(135deg, hsl(var(--command-accent)) 0%, transparent 70%)"
            }}
          />
          
          <DialogHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 glass-morphism rounded-lg">
                <FileText className="h-5 w-5 text-[hsl(var(--command-accent))]" />
              </div>
              <DialogTitle className="text-xl font-display font-bold">
                Mission Templates
              </DialogTitle>
            </div>
            <DialogDescription className="text-[hsl(var(--command-text-muted))]">
              Choose from pre-configured mission templates to accelerate task creation.
            </DialogDescription>
          </DialogHeader>

          {/* Search and Filters */}
          <div className="mt-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(var(--command-text-muted))]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="pl-10 glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-[hsl(var(--command-text-muted))]">Categories:</span>
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "h-8 px-3 rounded-full text-xs",
                  selectedCategory === null && "bg-[hsl(var(--command-accent))] text-white"
                )}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "h-8 px-3 rounded-full text-xs",
                    selectedCategory === category && "bg-[hsl(var(--command-accent))] text-white"
                  )}
                >
                  {category}
                </Button>
              ))}
              
              {(searchQuery || selectedCategory) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 px-2 rounded-full text-xs text-[hsl(var(--command-text-muted))] hover:text-[hsl(var(--command-text))]"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          {filteredTemplates.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHoveredTemplate(template.id)}
                  onHoverEnd={() => setHoveredTemplate(null)}
                  className="cursor-pointer"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <Card className={cn(
                    "glass-morphism border-[hsl(var(--command-border))] transition-all duration-200 h-full relative overflow-hidden",
                    hoveredTemplate === template.id && "border-[hsl(var(--command-accent))]/50 shadow-lg shadow-[hsl(var(--command-accent))]/10"
                  )}>
                    {/* Template Color Accent */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: template.color }}
                    />
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg backdrop-blur-sm border"
                            style={{ 
                              backgroundColor: `${template.color}15`,
                              borderColor: `${template.color}30`
                            }}
                          >
                            {template.icon}
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">
                              {template.name}
                            </CardTitle>
                            <Badge 
                              variant="outline" 
                              className="text-xs mt-1"
                              style={{ 
                                borderColor: `${template.color}50`,
                                color: template.color
                              }}
                            >
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                        <motion.div
                          animate={{ x: hoveredTemplate === template.id ? 0 : 5, opacity: hoveredTemplate === template.id ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                        </motion.div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <CardDescription className="text-sm text-[hsl(var(--command-text-muted))] leading-relaxed">
                        {template.description}
                      </CardDescription>
                      
                      {/* Template Metadata */}
                      <div className="space-y-2">
                        {/* Priority & Duration */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            <span className={cn(
                              "font-semibold",
                              template.priority === "high" && "text-[hsl(var(--command-danger))]",
                              template.priority === "medium" && "text-[hsl(var(--command-warning))]",
                              template.priority === "low" && "text-[hsl(var(--command-success))]"
                            )}>
                              {template.priority.charAt(0).toUpperCase() + template.priority.slice(1)} Priority
                            </span>
                          </div>
                          
                          {template.estimatedDuration && (
                            <div className="flex items-center gap-1 text-[hsl(var(--command-text-muted))]">
                              <Clock className="h-3 w-3" />
                              <span>{template.estimatedDuration}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Suggested Assignee */}
                        {template.suggestedAssignee && (
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-[hsl(var(--command-text-muted))]" />
                            <div className="flex items-center gap-1">
                              <span className="text-sm">
                                {agentAvatars[template.suggestedAssignee as keyof typeof agentAvatars]}
                              </span>
                              <span className="text-xs text-[hsl(var(--command-text-muted))]">
                                Suggested: {template.suggestedAssignee}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* Tags */}
                        {template.tags && template.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Tag className="h-3 w-3 text-[hsl(var(--command-text-muted))]" />
                            <div className="flex gap-1 flex-wrap">
                              {template.tags.slice(0, 3).map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="outline" 
                                  className="text-xs px-2 py-0 h-5 bg-[hsl(var(--command-surface))]/50"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {template.tags.length > 3 && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs px-2 py-0 h-5 bg-[hsl(var(--command-surface))]/50 text-[hsl(var(--command-text-muted))]"
                                >
                                  +{template.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto glass-morphism rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-[hsl(var(--command-text-muted))]" />
                </div>
                <h3 className="text-lg font-semibold">No templates found</h3>
                <p className="text-[hsl(var(--command-text-muted))] text-sm">
                  Try adjusting your search or category filters.
                </p>
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-[hsl(var(--command-accent))]"
                >
                  Clear filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[hsl(var(--command-surface))]/50 backdrop-blur border-t border-[hsl(var(--command-border))]">
          <div className="flex justify-between items-center">
            <div className="text-sm text-[hsl(var(--command-text-muted))]">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </div>
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="hover:bg-[hsl(var(--command-text-muted))]/10"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}