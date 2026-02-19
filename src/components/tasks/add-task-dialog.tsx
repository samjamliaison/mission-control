"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Rocket, User, Flag, X, Zap, AlertTriangle, CheckCircle, FileText, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { logTaskAction } from "@/lib/activity-logger"
import { Task } from "./task-card"
import { TaskTemplatePicker } from "./task-template-picker"
import { TaskTemplate, createTaskFromTemplate } from "@/lib/task-templates"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: Partial<Task>) => void
  editingTask?: Task | null
}

const assigneeOptions = ["Hamza", "Manus", "Monica", "Jarvis", "Luna"]
const priorityOptions = [
  { value: "low", label: "Low Priority", icon: CheckCircle, color: "text-[hsl(var(--command-success))]" },
  { value: "medium", label: "Medium Priority", icon: Zap, color: "text-[hsl(var(--command-warning))]" },
  { value: "high", label: "High Priority", icon: AlertTriangle, color: "text-[hsl(var(--command-danger))]" }
] as const

const agentAvatars = {
  "Hamza": "👤",
  "Manus": "🤘",
  "Monica": "✈️", 
  "Jarvis": "🔍",
  "Luna": "🌙"
}

const agentDescriptions = {
  "Hamza": "Mission Commander",
  "Manus": "Systems Engineer", 
  "Monica": "Flight Operations",
  "Jarvis": "Intelligence Analytics",
  "Luna": "Navigation Specialist"
}

export function AddTaskDialog({ open, onOpenChange, onSave, editingTask }: AddTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignee, setAssignee] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null)
  const [templateUsed, setTemplateUsed] = useState(false)

  // Handle template selection
  const handleTemplateSelect = (template: TaskTemplate) => {
    const taskData = createTaskFromTemplate(template)
    setTitle(taskData.title || "")
    setDescription(taskData.description || "")
    setAssignee(taskData.assignee || "")
    setPriority(taskData.priority || "medium")
    setSelectedTemplate(template)
    setTemplateUsed(true)
    setShowTemplatePicker(false)
  }

  // Update form when dialog opens or editingTask changes
  useEffect(() => {
    if (open) {
      if (editingTask) {
        setTitle(editingTask.title)
        setDescription(editingTask.description)
        setAssignee(editingTask.assignee)
        setPriority(editingTask.priority)
        setSelectedTemplate(null)
        setTemplateUsed(false)
      } else {
        setTitle("")
        setDescription("")
        setAssignee("")
        setPriority("medium")
        setSelectedTemplate(null)
        setTemplateUsed(false)
      }
    }
  }, [open, editingTask])
  
  const handleSave = () => {
    if (!title.trim() || !assignee) return
    
    const taskData = {
      ...(editingTask && { _id: editingTask._id }),
      title: title.trim(),
      description: description.trim(),
      assignee,
      priority,
    }
    
    // Log the activity
    const action = editingTask ? 'updated' : 'created'
    logTaskAction(
      action,
      title.trim(),
      assignee,
      editingTask?._id || 'new',
      { 
        priority, 
        hasDescription: !!description.trim(),
        editedFields: editingTask ? Object.keys(taskData).filter(key => 
          editingTask[key as keyof Task] !== taskData[key as keyof typeof taskData]
        ) : undefined
      }
    )
    
    onSave(taskData)
    onOpenChange(false)
  }
  
  const handleCancel = () => {
    onOpenChange(false)
  }

  const isFormValid = title.trim() && assignee
  const selectedPriority = priorityOptions.find(p => p.value === priority)
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-morphism border-[hsl(var(--command-border-bright))] p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative p-6 pb-4">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: "linear-gradient(135deg, hsl(var(--command-accent)) 0%, transparent 50%)"
            }}
          />
          
          <DialogHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 glass-morphism rounded-lg">
                <Rocket className="h-5 w-5 text-[hsl(var(--command-accent))]" />
              </div>
              <DialogTitle className="text-xl font-display font-bold">
                {editingTask ? "Modify Mission" : "Deploy New Mission"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-[hsl(var(--command-text-muted))]">
              {editingTask 
                ? "Update the mission parameters and agent assignments." 
                : "Configure a new operation for the command center."
              }
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="px-6 pb-6 space-y-6">
          {/* Template Selection */}
          {!editingTask && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              {!templateUsed ? (
                <div className="text-center py-4">
                  <div className="space-y-3">
                    <div className="text-sm text-[hsl(var(--command-text-muted))]">
                      Start with a template or create from scratch
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowTemplatePicker(true)}
                      className="bg-gradient-to-r from-[hsl(var(--command-accent))]/10 to-purple-500/10 border-[hsl(var(--command-accent))]/20 hover:from-[hsl(var(--command-accent))]/20 hover:to-purple-500/20"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Choose Template
                      <FileText className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 glass-morphism rounded-xl border-[hsl(var(--command-accent))]/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                        style={{ 
                          backgroundColor: `${selectedTemplate?.color}15`,
                          border: `1px solid ${selectedTemplate?.color}30`
                        }}
                      >
                        {selectedTemplate?.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Template Applied</div>
                        <div className="text-xs text-[hsl(var(--command-text-muted))]">
                          {selectedTemplate?.name} • {selectedTemplate?.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTemplatePicker(true)}
                        className="h-8 px-3 text-xs"
                      >
                        Change
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setTitle("")
                          setDescription("")
                          setAssignee("")
                          setPriority("medium")
                          setSelectedTemplate(null)
                          setTemplateUsed(false)
                        }}
                        className="h-8 px-3 text-xs text-[hsl(var(--command-text-muted))]"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Divider */}
          {!editingTask && templateUsed && (
            <div className="flex items-center gap-4">
              <div className="h-px bg-[hsl(var(--command-border))] flex-1" />
              <span className="text-xs text-[hsl(var(--command-text-muted))] font-medium">
                Customize Template
              </span>
              <div className="h-px bg-[hsl(var(--command-border))] flex-1" />
            </div>
          )}
          {/* Mission Title */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label htmlFor="title" className="text-sm font-heading font-semibold flex items-center gap-2">
              <Flag className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              Mission Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter mission designation..."
              className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))] font-medium"
            />
          </motion.div>
          
          {/* Mission Brief */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label htmlFor="description" className="text-sm font-heading font-semibold text-[hsl(var(--command-text))]">
              Mission Brief
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the mission objectives and requirements..."
              rows={3}
              className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))] resize-none"
            />
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Agent Assignment */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="text-sm font-heading font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                Agent Assignment *
              </label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]">
                  <SelectValue placeholder="Select agent">
                    {assignee && (
                      <div className="flex items-center gap-2">
                        <span>{agentAvatars[assignee as keyof typeof agentAvatars]}</span>
                        <span>{assignee}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="glass-morphism border-[hsl(var(--command-border-bright))]">
                  {assigneeOptions.map((agent) => (
                    <SelectItem key={agent} value={agent} className="focus:bg-[hsl(var(--command-accent))]/10">
                      <div className="flex items-center gap-3 py-1">
                        <span className="text-lg">{agentAvatars[agent as keyof typeof agentAvatars]}</span>
                        <div>
                          <div className="font-medium">{agent}</div>
                          <div className="text-xs text-[hsl(var(--command-text-muted))]">
                            {agentDescriptions[agent as keyof typeof agentDescriptions]}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            
            {/* Priority Level */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="text-sm font-heading font-semibold flex items-center gap-2">
                {selectedPriority && <selectedPriority.icon className={cn("h-4 w-4", selectedPriority.color)} />}
                Priority Level
              </label>
              <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                <SelectTrigger className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]">
                  <SelectValue>
                    {selectedPriority && (
                      <div className="flex items-center gap-2">
                        <selectedPriority.icon className={cn("h-4 w-4", selectedPriority.color)} />
                        <span>{selectedPriority.label.split(" ")[0]}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="glass-morphism border-[hsl(var(--command-border-bright))]">
                  {priorityOptions.map((p) => (
                    <SelectItem key={p.value} value={p.value} className="focus:bg-[hsl(var(--command-accent))]/10">
                      <div className="flex items-center gap-2 py-1">
                        <p.icon className={cn("h-4 w-4", p.color)} />
                        <span>{p.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>
          
          {/* Preview Badge */}
          {assignee && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center p-4 glass-morphism rounded-xl"
            >
              <div className="text-center space-y-2">
                <div className="text-xs text-[hsl(var(--command-text-muted))] font-medium">Mission Preview</div>
                <Badge 
                  variant="outline" 
                  className="bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))]/20 text-sm px-3 py-1"
                >
                  {agentAvatars[assignee as keyof typeof agentAvatars]} {assignee} • {priority.toUpperCase()}
                </Badge>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="px-6 py-4 bg-[hsl(var(--command-surface))]/50 backdrop-blur border-t border-[hsl(var(--command-border))]">
          <div className="flex justify-end gap-3">
            <Button 
              variant="ghost" 
              onClick={handleCancel}
              className="hover:bg-[hsl(var(--command-text-muted))]/10"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <motion.div
              whileHover={{ scale: isFormValid ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid ? 0.98 : 1 }}
            >
              <Button 
                onClick={handleSave}
                disabled={!isFormValid}
                className={cn(
                  "font-semibold px-6",
                  isFormValid 
                    ? "bg-gradient-to-r from-[hsl(var(--command-accent))] to-[hsl(199_89%_38%)] hover:from-[hsl(199_89%_58%)] hover:to-[hsl(var(--command-accent))] shadow-lg shadow-[hsl(var(--command-accent))]/20" 
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                <Rocket className="h-4 w-4 mr-2" />
                {editingTask ? "Update Mission" : "Deploy Mission"}
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Template Picker Modal */}
        <TaskTemplatePicker
          open={showTemplatePicker}
          onOpenChange={setShowTemplatePicker}
          onSelectTemplate={handleTemplateSelect}
        />
      </DialogContent>
    </Dialog>
  )
}