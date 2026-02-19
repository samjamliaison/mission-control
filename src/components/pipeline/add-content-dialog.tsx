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
import { Film, User, Video, FileText, Users, X, Lightbulb, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { ContentItem } from "./content-item-card"

interface AddContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (content: Partial<ContentItem>) => void
  editingContent?: ContentItem | null
}

const assigneeOptions = ["Hamza", "Manus", "Monica", "Jarvis", "Luna"]
const platformOptions = [
  { value: "YouTube", label: "YouTube", icon: Video, color: "text-red-400" },
  { value: "Blog", label: "Blog Post", icon: FileText, color: "text-green-400" },
  { value: "X", label: "X/Twitter", icon: Users, color: "text-blue-400" }
] as const

const agentAvatars = {
  "Hamza": "👤",
  "Manus": "🤘",
  "Monica": "✈️",
  "Jarvis": "🔍",
  "Luna": "🌙"
}

const agentDescriptions = {
  "Hamza": "Content Director",
  "Manus": "Technical Producer",
  "Monica": "Creative Lead",
  "Jarvis": "Research Specialist",
  "Luna": "Multi-Platform Creator"
}

export function AddContentDialog({ open, onOpenChange, onSave, editingContent }: AddContentDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [platform, setPlatform] = useState<"YouTube" | "Blog" | "X">("YouTube")
  const [assignee, setAssignee] = useState("")
  const [scriptText, setScriptText] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")

  // Update form when dialog opens or editingContent changes
  useEffect(() => {
    if (open) {
      if (editingContent) {
        setTitle(editingContent.title)
        setDescription(editingContent.description)
        setPlatform(editingContent.platform)
        setAssignee(editingContent.assignee)
        setScriptText(editingContent.scriptText)
        setThumbnailUrl(editingContent.thumbnailUrl)
      } else {
        setTitle("")
        setDescription("")
        setPlatform("YouTube")
        setAssignee("")
        setScriptText("")
        setThumbnailUrl("")
      }
    }
  }, [open, editingContent])
  
  const handleSave = () => {
    if (!title.trim() || !assignee) return
    
    onSave({
      ...(editingContent && { _id: editingContent._id }),
      title: title.trim(),
      description: description.trim(),
      platform,
      assignee,
      scriptText: scriptText.trim(),
      thumbnailUrl: thumbnailUrl.trim(),
    })
    
    onOpenChange(false)
  }
  
  const handleCancel = () => {
    onOpenChange(false)
  }

  const isFormValid = title.trim() && assignee
  const selectedPlatform = platformOptions.find(p => p.value === platform)
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] glass-morphism border-[hsl(var(--command-border-bright))] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
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
                <Film className="h-5 w-5 text-[hsl(var(--command-accent))]" />
              </div>
              <DialogTitle className="text-xl font-display font-bold">
                {editingContent ? "Edit Content" : "Create Content"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-[hsl(var(--command-text-muted))]">
              {editingContent 
                ? "Update the content details and pipeline status." 
                : "Add new content to the creation pipeline."
              }
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="px-6 pb-6 space-y-6">
          {/* Content Title */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="title" className="text-sm font-heading font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              Content Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter compelling content title..."
              className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))] font-medium"
            />
          </motion.div>
          
          {/* Content Description */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="description" className="text-sm font-heading font-semibold text-[hsl(var(--command-text))]">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the content goals and target audience..."
              rows={3}
              className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))] resize-none"
            />
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Platform Selection */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-sm font-heading font-semibold flex items-center gap-2">
                {selectedPlatform && <selectedPlatform.icon className={cn("h-4 w-4", selectedPlatform.color)} />}
                Platform *
              </label>
              <Select value={platform} onValueChange={(value: "YouTube" | "Blog" | "X") => setPlatform(value)}>
                <SelectTrigger className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]">
                  <SelectValue>
                    {selectedPlatform && (
                      <div className="flex items-center gap-2">
                        <selectedPlatform.icon className={cn("h-4 w-4", selectedPlatform.color)} />
                        <span>{selectedPlatform.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="glass-morphism border-[hsl(var(--command-border-bright))]">
                  {platformOptions.map((p) => (
                    <SelectItem key={p.value} value={p.value} className="focus:bg-[hsl(var(--command-accent))]/10">
                      <div className="flex items-center gap-3 py-1">
                        <p.icon className={cn("h-4 w-4", p.color)} />
                        <span>{p.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Creator Assignment */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-sm font-heading font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                Creator *
              </label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]">
                  <SelectValue placeholder="Select creator">
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
          </div>

          {/* Script Text */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="scriptText" className="text-sm font-heading font-semibold text-[hsl(var(--command-text))]">
              Script / Content Draft
            </label>
            <Textarea
              id="scriptText"
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              placeholder={
                platform === "YouTube" ? "Video script outline or full transcript..." :
                platform === "Blog" ? "Blog post draft or outline..." :
                "Tweet thread or X content draft..."
              }
              rows={4}
              className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))] resize-none font-mono text-xs"
            />
          </motion.div>

          {/* Thumbnail URL */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="thumbnailUrl" className="text-sm font-heading font-semibold flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              Asset URL
            </label>
            <Input
              id="thumbnailUrl"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="Thumbnail, image, or asset URL..."
              className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]"
            />
          </motion.div>
          
          {/* Preview Badge */}
          {assignee && platform && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center p-4 glass-morphism rounded-xl"
            >
              <div className="text-center space-y-2">
                <div className="text-xs text-[hsl(var(--command-text-muted))] font-medium">Content Preview</div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))]/20 text-sm px-3 py-1"
                  >
                    {agentAvatars[assignee as keyof typeof agentAvatars]} {assignee}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={cn("text-sm px-3 py-1", selectedPlatform && `${selectedPlatform.color.replace('text-', 'text-')} bg-current/10 border-current/20`)}
                  >
                    {selectedPlatform && <selectedPlatform.icon className="h-3 w-3 mr-1" />}
                    {platform}
                  </Badge>
                </div>
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
                <Film className="h-4 w-4 mr-2" />
                {editingContent ? "Update Content" : "Add to Pipeline"}
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}