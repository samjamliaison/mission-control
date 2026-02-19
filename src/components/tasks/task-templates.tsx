"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Bug,
  Sparkles,
  Search,
  FileText,
  Rocket,
  Zap,
  Clock,
  User,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Task } from "./task-card"

interface TaskTemplate {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
  priority: "low" | "medium" | "high"
  defaultAssignee: string
  titleTemplate: string
  descriptionTemplate: string
  tags?: string[]
  estimatedTime?: string
}

interface TaskTemplatesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: TaskTemplate) => void
}

const taskTemplates: TaskTemplate[] = [
  {
    id: "bug-fix",
    name: "Bug Fix",
    description: "Address and resolve system issues",
    icon: Bug,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    priority: "high",
    defaultAssignee: "Manus",
    titleTemplate: "Fix: [Issue Description]",
    descriptionTemplate: "**Issue:** Describe the bug or problem\n\n**Steps to Reproduce:**\n1. \n2. \n3. \n\n**Expected Behavior:**\n\n**Actual Behavior:**\n\n**Solution Approach:**\n\n**Testing Notes:**\n",
    tags: ["bug", "urgent", "fix"],
    estimatedTime: "2-4 hours"
  },
  {
    id: "feature",
    name: "Feature",
    description: "Develop new functionality or enhancement",
    icon: Sparkles,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    priority: "medium",
    defaultAssignee: "Hamza",
    titleTemplate: "Feature: [Feature Name]",
    descriptionTemplate: "**Goal:** What are we building and why?\n\n**User Story:** As a [user type], I want [goal] so that [reason].\n\n**Acceptance Criteria:**\n- [ ] Criterion 1\n- [ ] Criterion 2\n- [ ] Criterion 3\n\n**Technical Requirements:**\n\n**Design Notes:**\n\n**Testing Strategy:**\n",
    tags: ["feature", "enhancement", "development"],
    estimatedTime: "1-3 days"
  },
  {
    id: "research",
    name: "Research",
    description: "Investigate and analyze information",
    icon: Search,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    priority: "low",
    defaultAssignee: "Jarvis",
    titleTemplate: "Research: [Topic/Question]",
    descriptionTemplate: "**Research Objective:** What are we trying to learn or validate?\n\n**Key Questions:**\n- \n- \n- \n\n**Research Method:**\n\n**Success Criteria:** How will we know when we're done?\n\n**Deliverables:**\n- [ ] Research summary\n- [ ] Recommendations\n- [ ] Next steps\n\n**Resources:**\n",
    tags: ["research", "analysis", "investigation"],
    estimatedTime: "4-8 hours"
  },
  {
    id: "content",
    name: "Content",
    description: "Create or update content and documentation",
    icon: FileText,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    priority: "medium",
    defaultAssignee: "Monica",
    titleTemplate: "Content: [Content Title]",
    descriptionTemplate: "**Content Type:** [Article/Video/Documentation/Script]\n\n**Target Audience:** Who is this for?\n\n**Key Messages:**\n- \n- \n- \n\n**Content Outline:**\n1. \n2. \n3. \n\n**Success Metrics:** How will we measure success?\n\n**Publication Date:**\n\n**Review Process:**\n- [ ] Draft complete\n- [ ] Review and feedback\n- [ ] Final edits\n- [ ] Publish\n",
    tags: ["content", "documentation", "writing"],
    estimatedTime: "1-2 days"
  },
  {
    id: "deploy",
    name: "Deploy",
    description: "Deploy changes to production systems",
    icon: Rocket,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    priority: "high",
    defaultAssignee: "Luna",
    titleTemplate: "Deploy: [Release/Version]",
    descriptionTemplate: "**Release Version:** \n\n**Deployment Environment:** [Staging/Production]\n\n**Changes Included:**\n- \n- \n- \n\n**Pre-deployment Checklist:**\n- [ ] Code reviewed and approved\n- [ ] Tests passing\n- [ ] Staging deployment successful\n- [ ] Database migrations ready\n- [ ] Backup completed\n\n**Deployment Steps:**\n1. \n2. \n3. \n\n**Post-deployment Verification:**\n- [ ] Application starts successfully\n- [ ] Key functionality verified\n- [ ] Performance metrics normal\n\n**Rollback Plan:**\n",
    tags: ["deploy", "release", "production"],
    estimatedTime: "1-2 hours"
  }
]

const priorityIcons = {
  low: CheckCircle,
  medium: Zap,
  high: AlertTriangle
}

const priorityColors = {
  low: "text-[hsl(var(--command-success))]",
  medium: "text-[hsl(var(--command-warning))]",
  high: "text-[hsl(var(--command-danger))]"
}

export function TaskTemplatesDialog({ open, onOpenChange, onSelectTemplate }: TaskTemplatesDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null)

  const handleSelectTemplate = (template: TaskTemplate) => {
    setSelectedTemplate(template)
  }

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      onOpenChange(false)
      setSelectedTemplate(null)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedTemplate(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] glass-morphism border-[hsl(var(--command-border-bright))] p-0 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: "linear-gradient(135deg, hsl(var(--command-accent)) 0%, hsl(220_89%_48%) 100%)"
            }}
          />

          <DialogHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 glass-morphism rounded-lg">
                <Zap className="h-5 w-5 text-[hsl(var(--command-accent))]" />
              </div>
              <DialogTitle className="text-xl font-display font-bold">
                Mission Templates
              </DialogTitle>
            </div>
            <DialogDescription className="text-[hsl(var(--command-text-muted))]">
              Select a pre-configured mission template to get started quickly with standardized workflows.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskTemplates.map((template, index) => {
              const Icon = template.icon
              const PriorityIcon = priorityIcons[template.priority]
              const isSelected = selectedTemplate?.id === template.id

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-lg glass-morphism border-[hsl(var(--command-border))]",
                      isSelected
                        ? "ring-2 ring-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))] shadow-[hsl(var(--command-accent))]/20 shadow-lg"
                        : "hover:border-[hsl(var(--command-border-bright))]"
                    )}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn("p-2 rounded-lg", template.bgColor)}>
                          <Icon className={cn("h-5 w-5", template.color)} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold font-display">{template.name}</h3>
                            <div className="flex items-center gap-1">
                              <PriorityIcon className={cn("h-3 w-3", priorityColors[template.priority])} />
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs px-2 py-0.5 capitalize",
                                  template.priority === 'high' ? "border-red-200 text-red-400" :
                                  template.priority === 'medium' ? "border-orange-200 text-orange-400" :
                                  "border-green-200 text-green-400"
                                )}
                              >
                                {template.priority}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-sm text-[hsl(var(--command-text-muted))] mb-3">
                            {template.description}
                          </p>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-[hsl(var(--command-text-muted))]">
                              <User className="h-3 w-3" />
                              <span>Default: {template.defaultAssignee}</span>
                              {template.estimatedTime && (
                                <>
                                  <span>•</span>
                                  <Clock className="h-3 w-3" />
                                  <span>{template.estimatedTime}</span>
                                </>
                              )}
                            </div>

                            {template.tags && (
                              <div className="flex flex-wrap gap-1">
                                {template.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs px-1.5 py-0 bg-[hsl(var(--command-surface))]/50"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Selected template preview */}
          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                    Template Preview
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-[hsl(var(--command-text-muted))] mb-1">Title Template:</div>
                      <div className="text-sm font-mono bg-[hsl(var(--command-surface))]/50 rounded px-2 py-1">
                        {selectedTemplate.titleTemplate}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-[hsl(var(--command-text-muted))] mb-1">Description Template:</div>
                      <div className="text-sm font-mono bg-[hsl(var(--command-surface))]/50 rounded px-2 py-1 whitespace-pre-line max-h-32 overflow-y-auto">
                        {selectedTemplate.descriptionTemplate}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-6 py-4 bg-[hsl(var(--command-surface))]/50 backdrop-blur border-t border-[hsl(var(--command-border))]">
          <div className="flex justify-between items-center">
            <div className="text-sm text-[hsl(var(--command-text-muted))]">
              {selectedTemplate ? (
                <>Selected: <span className="font-medium">{selectedTemplate.name}</span></>
              ) : (
                "Choose a template to continue"
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="hover:bg-[hsl(var(--command-text-muted))]/10"
              >
                Cancel
              </Button>
              <motion.div
                whileHover={{ scale: selectedTemplate ? 1.02 : 1 }}
                whileTap={{ scale: selectedTemplate ? 0.98 : 1 }}
              >
                <Button
                  onClick={handleUseTemplate}
                  disabled={!selectedTemplate}
                  className={cn(
                    "font-semibold px-6",
                    selectedTemplate
                      ? "bg-gradient-to-r from-[hsl(var(--command-accent))] to-[hsl(199_89%_38%)] hover:from-[hsl(199_89%_58%)] hover:to-[hsl(var(--command-accent))] shadow-lg shadow-[hsl(var(--command-accent))]/20"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Export templates for use in other components
export { taskTemplates }
export type { TaskTemplate }