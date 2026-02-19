"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  BookOpen,
  Calendar,
  Lightbulb,
  X,
  Tag,
  User,
  FileText,
  CheckCircle,
  Plus,
  Pin,
  Hash
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MemoryEntry } from "@/components/memory/memory-entry"

interface MemoryCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (memory: Partial<MemoryEntry>) => void
  editingMemory?: MemoryEntry | null
}

const categoryOptions = [
  { value: "daily", label: "Daily Notes", icon: Calendar, color: "text-blue-400", description: "Day-to-day observations and notes" },
  { value: "knowledge", label: "Knowledge", icon: BookOpen, color: "text-green-400", description: "Long-term knowledge and insights" },
  { value: "lessons", label: "Lessons Learned", icon: Lightbulb, color: "text-yellow-400", description: "Important lessons and experiences" }
] as const

const authorOptions = ["Hamza", "Manus", "Monica", "Jarvis", "Luna"]

const agentAvatars = {
  "Hamza": "👤",
  "Manus": "🤘",
  "Monica": "✈️",
  "Jarvis": "🔍",
  "Luna": "🌙"
}

// Common tags for suggestions
const suggestedTags = [
  "important",
  "meeting",
  "decision",
  "project",
  "learning",
  "insight",
  "todo",
  "bug",
  "feature",
  "strategy",
  "research",
  "process",
  "team",
  "client",
  "deadline",
  "milestone"
]

export function MemoryCreationDialog({ open, onOpenChange, onSave, editingMemory }: MemoryCreationDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState<string>("knowledge")
  const [author, setAuthor] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [pinned, setPinned] = useState(false)

  // Initialize form when dialog opens or editingMemory changes
  useEffect(() => {
    if (open) {
      if (editingMemory) {
        setTitle(editingMemory.title)
        setContent(editingMemory.content)
        setCategory(editingMemory.category)
        setAuthor(editingMemory.author)
        setTags(editingMemory.tags || [])
        setPinned((editingMemory as any).pinned || false)
      } else {
        setTitle("")
        setContent("")
        setCategory("knowledge")
        setAuthor("")
        setTags([])
        setNewTag("")
        setPinned(false)
      }
    }
  }, [open, editingMemory])

  const handleSave = () => {
    if (!title.trim() || !content.trim() || !author) return

    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length

    const memoryData: Partial<MemoryEntry> = {
      ...(editingMemory && { _id: editingMemory._id }),
      title: title.trim(),
      content: content.trim(),
      category: category as MemoryEntry["category"],
      author,
      tags,
      wordCount,
      pinned
    }

    onSave(memoryData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags(prev => [...prev, newTag.trim().toLowerCase()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleSuggestedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags(prev => [...prev, tag])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const isFormValid = title.trim() && content.trim() && author
  const selectedCategory = categoryOptions.find(c => c.value === category)
  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] glass-morphism border-[hsl(var(--command-border-bright))] p-0 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: selectedCategory
                ? `linear-gradient(135deg, ${selectedCategory.color.replace('text-', 'hsl(var(--command-')} 0%, transparent 50%)`
                : "linear-gradient(135deg, hsl(var(--command-accent)) 0%, transparent 50%)"
            }}
          />

          <DialogHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 glass-morphism rounded-lg">
                <Brain className="h-5 w-5 text-[hsl(var(--command-accent))]" />
              </div>
              <DialogTitle className="text-xl font-display font-bold">
                {editingMemory ? "Edit Memory Entry" : "Create Memory Entry"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-[hsl(var(--command-text-muted))]">
              {editingMemory
                ? "Update this memory entry with new information or insights."
                : "Capture important knowledge, insights, or daily notes for the command center."
              }
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* Memory Title */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="title" className="text-sm font-heading font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              Memory Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title for this memory..."
              className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))] font-medium"
            />
          </motion.div>

          {/* Memory Content */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="content" className="text-sm font-heading font-semibold text-[hsl(var(--command-text))]">
                Content *
              </label>
              <div className="text-xs text-[hsl(var(--command-text-muted))] flex items-center gap-2">
                <Hash className="h-3 w-3" />
                {wordCount} words
              </div>
            </div>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Write your memory content here using Markdown. You can include insights, notes, lessons learned, or any important information..."
              rows={8}
              className="w-full"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-sm font-heading font-semibold flex items-center gap-2">
                {selectedCategory && <selectedCategory.icon className={cn("h-4 w-4", selectedCategory.color)} />}
                Category *
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]">
                  <SelectValue>
                    {selectedCategory && (
                      <div className="flex items-center gap-2">
                        <selectedCategory.icon className={cn("h-4 w-4", selectedCategory.color)} />
                        <span>{selectedCategory.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="glass-morphism border-[hsl(var(--command-border-bright))]">
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="focus:bg-[hsl(var(--command-accent))]/10">
                      <div className="py-1">
                        <div className="flex items-center gap-2">
                          <cat.icon className={cn("h-4 w-4", cat.color)} />
                          <span>{cat.label}</span>
                        </div>
                        <div className="text-xs text-[hsl(var(--command-text-muted))] mt-1">
                          {cat.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Author */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-sm font-heading font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                Author *
              </label>
              <Select value={author} onValueChange={setAuthor}>
                <SelectTrigger className="glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]">
                  <SelectValue placeholder="Select author">
                    {author && (
                      <div className="flex items-center gap-2">
                        <span>{agentAvatars[author as keyof typeof agentAvatars]}</span>
                        <span>{author}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="glass-morphism border-[hsl(var(--command-border-bright))]">
                  {authorOptions.map((authorOption) => (
                    <SelectItem key={authorOption} value={authorOption} className="focus:bg-[hsl(var(--command-accent))]/10">
                      <div className="flex items-center gap-3 py-1">
                        <span className="text-lg">{agentAvatars[authorOption as keyof typeof agentAvatars]}</span>
                        <span>{authorOption}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          {/* Pin Toggle */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="text-sm font-heading font-semibold flex items-center gap-2">
              <Pin className={cn("h-4 w-4", pinned ? "text-[hsl(var(--command-warning))]" : "text-[hsl(var(--command-text-muted))]")} />
              Pin Memory
            </label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant={pinned ? "default" : "outline"}
                size="sm"
                onClick={() => setPinned(!pinned)}
                className={cn(
                  "glass-morphism transition-all duration-200",
                  pinned
                    ? "bg-[hsl(var(--command-warning))]/20 border-[hsl(var(--command-warning))]/30 text-[hsl(var(--command-warning))]"
                    : "border-[hsl(var(--command-border))]"
                )}
              >
                <Pin className="h-3 w-3 mr-2" />
                {pinned ? "Pinned" : "Pin to Top"}
              </Button>
              <span className="text-xs text-[hsl(var(--command-text-muted))]">
                Pinned memories appear at the top of the list
              </span>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="text-sm font-heading font-semibold flex items-center gap-2">
              <Tag className="h-4 w-4 text-[hsl(var(--command-accent))]" />
              Tags
            </label>

            {/* Tag Input */}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                className="flex-1 glass-morphism border-[hsl(var(--command-border))] focus:ring-1 focus:ring-[hsl(var(--command-accent))]"
              />
              <Button
                type="button"
                size="icon"
                onClick={handleAddTag}
                disabled={!newTag.trim() || tags.includes(newTag.trim().toLowerCase())}
                className="glass-morphism hover:bg-[hsl(var(--command-accent))]/20"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Current Tags */}
            {tags.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-[hsl(var(--command-text-muted))]">Current Tags:</div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))]/20 hover:bg-[hsl(var(--command-accent))]/20 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Tags */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-[hsl(var(--command-text-muted))]">Suggested Tags:</div>
              <div className="flex flex-wrap gap-1">
                {suggestedTags
                  .filter(tag => !tags.includes(tag))
                  .slice(0, 10)
                  .map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-[hsl(var(--command-surface))]/60 transition-colors"
                      onClick={() => handleSuggestedTag(tag)}
                    >
                      <Plus className="h-2 w-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          </motion.div>

          {/* Preview */}
          {author && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center p-4 glass-morphism rounded-xl"
            >
              <div className="text-center space-y-2">
                <div className="text-xs text-[hsl(var(--command-text-muted))] font-medium">Memory Preview</div>
                <div className="flex items-center gap-2 justify-center">
                  <Badge
                    variant="outline"
                    className="bg-[hsl(var(--command-accent))]/10 text-[hsl(var(--command-accent))] border-[hsl(var(--command-accent))]/20 text-sm px-3 py-1"
                  >
                    <span className="mr-1">{agentAvatars[author as keyof typeof agentAvatars]}</span>
                    {author}
                  </Badge>

                  {selectedCategory && (
                    <Badge
                      variant="outline"
                      className={cn("text-sm px-3 py-1", selectedCategory.color, "border-current/20")}
                    >
                      <selectedCategory.icon className="h-3 w-3 mr-1" />
                      {selectedCategory.label}
                    </Badge>
                  )}

                  {pinned && (
                    <Badge
                      variant="outline"
                      className="bg-[hsl(var(--command-warning))]/10 text-[hsl(var(--command-warning))] border-[hsl(var(--command-warning))]/20 text-sm px-3 py-1"
                    >
                      <Pin className="h-3 w-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-[hsl(var(--command-text-muted))]">
                  {wordCount} words • {tags.length} tags
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
                <CheckCircle className="h-4 w-4 mr-2" />
                {editingMemory ? "Update Memory" : "Save Memory"}
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}