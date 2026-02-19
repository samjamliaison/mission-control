"use client"

import { useState } from "react"
import { motion, Reorder } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Plus,
  Trash2,
  GripVertical,
  Palette,
  RotateCcw
} from "lucide-react"
import { useKanbanColumns, KanbanColumn } from "@/hooks/use-kanban-columns"
import { cn } from "@/lib/utils"

const predefinedColors = [
  { name: 'Gray', value: '#6b7280' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' }
]

interface ColumnCustomizationDialogProps {
  trigger?: React.ReactNode
}

export function ColumnCustomizationDialog({ trigger }: ColumnCustomizationDialogProps) {
  const { columns, updateColumn, addColumn, removeColumn, reorderColumns, resetToDefaults } = useKanbanColumns()
  const [open, setOpen] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [newColumnColor, setNewColumnColor] = useState(predefinedColors[0].value)
  const [reorderList, setReorderList] = useState<KanbanColumn[]>([])

  const handleOpen = () => {
    setReorderList([...columns])
    setOpen(true)
  }

  const handleSave = () => {
    if (JSON.stringify(reorderList) !== JSON.stringify(columns)) {
      reorderColumns(reorderList)
    }
    setOpen(false)
  }

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return
    
    addColumn(newColumnTitle.trim(), newColumnColor)
    setNewColumnTitle("")
    setNewColumnColor(predefinedColors[0].value)
    setReorderList(prev => [...prev, {
      id: `col-${Date.now()}`,
      title: newColumnTitle.trim(),
      color: newColumnColor,
      position: prev.length
    }])
  }

  const handleRemoveColumn = (id: string) => {
    const removed = removeColumn(id)
    if (removed) {
      setReorderList(prev => prev.filter(col => col.id !== id))
    }
  }

  const handleUpdateColumn = (id: string, updates: Partial<KanbanColumn>) => {
    updateColumn(id, updates)
    setReorderList(prev => prev.map(col => 
      col.id === id ? { ...col, ...updates } : col
    ))
  }

  const handleReset = () => {
    resetToDefaults()
    setReorderList([
      { id: 'todo', title: 'To Do', color: '#6b7280', position: 0 },
      { id: 'in-progress', title: 'In Progress', color: '#f59e0b', position: 1 },
      { id: 'done', title: 'Done', color: '#22c55e', position: 2 }
    ])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={handleOpen}>
        {trigger || (
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Customize Columns
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Customize Kanban Columns
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Columns */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Current Columns</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-[hsl(var(--command-warning))] hover:text-[hsl(var(--command-warning))]"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
            
            <Reorder.Group
              axis="y"
              values={reorderList}
              onReorder={setReorderList}
              className="space-y-2"
            >
              {reorderList.map((column) => (
                <Reorder.Item
                  key={column.id}
                  value={column}
                  className="bg-accent/50 border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing"
                  whileDrag={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: column.color }}
                    />
                    
                    <Input
                      value={column.title}
                      onChange={(e) => handleUpdateColumn(column.id, { title: e.target.value })}
                      className="flex-1"
                    />
                    
                    <div className="flex items-center gap-1">
                      {predefinedColors.map((color) => (
                        <button
                          key={color.value}
                          className={cn(
                            "w-6 h-6 rounded-full border-2 border-white/20 hover:scale-110 transition-transform",
                            column.color === color.value && "ring-2 ring-white/50"
                          )}
                          style={{ backgroundColor: color.value }}
                          onClick={() => handleUpdateColumn(column.id, { color: color.value })}
                          title={color.name}
                        />
                      ))}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveColumn(column.id)}
                      disabled={reorderList.length <= 1}
                      className="h-8 w-8 text-[hsl(var(--command-danger))] hover:text-[hsl(var(--command-danger))]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          {/* Add New Column */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Column
            </h3>
            
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="column-title" className="text-xs">Column Title</Label>
                <Input
                  id="column-title"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="e.g. In Review, Testing, Blocked"
                />
              </div>
              
              <div>
                <Label className="text-xs">Color</Label>
                <div className="flex gap-1 mt-1">
                  {predefinedColors.slice(0, 5).map((color) => (
                    <button
                      key={color.value}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 border-white/20 hover:scale-110 transition-transform",
                        newColumnColor === color.value && "ring-2 ring-white/50"
                      )}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setNewColumnColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleAddColumn}
              disabled={!newColumnTitle.trim()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}