"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, ArrowUp, ArrowDown, CheckCircle, Circle, Timer, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BulkActionBarProps {
  selectedCount: number
  onStatusChange: (status: "todo" | "in-progress" | "done") => void
  onPriorityChange: (priority: "low" | "medium" | "high") => void
  onDelete: () => void
  onClear: () => void
}

export function BulkActionBar({ 
  selectedCount, 
  onStatusChange, 
  onPriorityChange, 
  onDelete, 
  onClear 
}: BulkActionBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-[hsl(var(--command-surface-elevated))]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="text-body-small font-semibold text-[hsl(var(--command-accent))]">
                {selectedCount} task{selectedCount > 1 ? 's' : ''} selected
              </div>
              
              <div className="h-6 w-px bg-white/20" />
              
              {/* Status Change */}
              <Select onValueChange={onStatusChange}>
                <SelectTrigger className="w-32 h-9 bg-transparent border-white/20">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">
                    <div className="flex items-center gap-2">
                      <Circle className="h-4 w-4" />
                      To Do
                    </div>
                  </SelectItem>
                  <SelectItem value="in-progress">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      In Progress
                    </div>
                  </SelectItem>
                  <SelectItem value="done">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Done
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {/* Priority Change */}
              <Select onValueChange={onPriorityChange}>
                <SelectTrigger className="w-32 h-9 bg-transparent border-white/20">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4 text-green-400" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-yellow-400" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-red-400" />
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <div className="h-6 w-px bg-white/20" />
              
              {/* Delete */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-9 px-3 hover:bg-red-500/20 hover:text-red-400 text-red-400/80"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              
              {/* Clear Selection */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="h-9 w-9 p-0 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}