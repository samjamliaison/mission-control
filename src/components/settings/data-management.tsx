"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  Upload, 
  Trash2, 
  Database, 
  FileText,
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react"
import { 
  exportAllData, 
  importAllData, 
  clearAllData, 
  getStorageStats,
  PersistedData 
} from "@/lib/data-persistence"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useToastActions } from "@/components/ui/toast"

export function DataManagement() {
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)
  const toast = useToastActions()

  const storageStats = getStorageStats()

  const handleExport = () => {
    try {
      const data = exportAllData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `mission-control-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setExportStatus('success')
      toast.success('Data Exported', `Backup file downloaded with ${data.tasks.length} tasks and ${data.content.length} content items.`)
      setTimeout(() => setExportStatus('idle'), 3000)
    } catch (error) {
      console.error('Export failed:', error)
      setExportStatus('error')
      toast.error('Export Failed', 'Unable to export data. Please try again.')
      setTimeout(() => setExportStatus('idle'), 3000)
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as PersistedData
        const success = importAllData(data)
        
        if (success) {
          setImportStatus('success')
          toast.success('Data Imported', `Successfully imported ${data.tasks.length} tasks and ${data.content.length} content items.`)
          // Refresh the page to load new data
          setTimeout(() => window.location.reload(), 1500)
        } else {
          setImportStatus('error')
          toast.error('Import Failed', 'Invalid data format or corrupted file.')
        }
        
        setTimeout(() => setImportStatus('idle'), 3000)
      } catch (error) {
        console.error('Import failed:', error)
        setImportStatus('error')
        toast.error('Import Failed', 'Unable to parse the backup file.')
        setTimeout(() => setImportStatus('idle'), 3000)
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    try {
      const success = clearAllData()
      if (success) {
        setClearConfirmOpen(false)
        toast.warning('Data Cleared', 'All tasks and content have been permanently deleted.')
        // Refresh the page to show empty states
        setTimeout(() => window.location.reload(), 500)
      } else {
        toast.error('Clear Failed', 'Unable to clear data. Please try again.')
      }
    } catch (error) {
      console.error('Clear data failed:', error)
      toast.error('Clear Failed', 'An error occurred while clearing data.')
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Storage Statistics */}
      <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-[hsl(var(--command-accent))]" />
            Storage Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 glass-morphism rounded-lg">
              <div className="text-2xl font-display font-bold text-[hsl(var(--command-accent))]">
                {formatBytes(storageStats.used)}
              </div>
              <div className="text-xs text-[hsl(var(--command-text-muted))]">Used</div>
            </div>
            <div className="text-center p-3 glass-morphism rounded-lg">
              <div className="text-2xl font-display font-bold text-[hsl(var(--command-success))]">
                {formatBytes(storageStats.available)}
              </div>
              <div className="text-xs text-[hsl(var(--command-text-muted))]">Available</div>
            </div>
            <div className="text-center p-3 glass-morphism rounded-lg">
              <div className="text-2xl font-display font-bold">
                {formatBytes(storageStats.total)}
              </div>
              <div className="text-xs text-[hsl(var(--command-text-muted))]">Total</div>
            </div>
            <div className="text-center p-3 glass-morphism rounded-lg">
              <div className="text-2xl font-display font-bold text-yellow-400">
                {storageStats.usedPercent}%
              </div>
              <div className="text-xs text-[hsl(var(--command-text-muted))]">Usage</div>
            </div>
          </div>
          
          {/* Usage Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[hsl(var(--command-text-muted))]">Storage Usage</span>
              <span className="text-[hsl(var(--command-text-muted))]">
                {storageStats.usedPercent}% full
              </span>
            </div>
            <div className="w-full h-2 bg-[hsl(var(--command-surface))] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[hsl(var(--command-accent))] to-[hsl(var(--command-success))]"
                initial={{ width: "0%" }}
                animate={{ width: `${storageStats.usedPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management Actions */}
      <Card className="glass-morphism border-[hsl(var(--command-border-bright))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[hsl(var(--command-accent))]" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export Data */}
          <div className="flex items-center justify-between p-4 glass-morphism rounded-lg">
            <div>
              <h3 className="font-heading font-semibold">Export Data</h3>
              <p className="text-sm text-[hsl(var(--command-text-muted))]">
                Download all your data as a JSON backup file
              </p>
            </div>
            <div className="flex items-center gap-2">
              {exportStatus === 'success' && (
                <Badge variant="outline" className="bg-[hsl(var(--command-success))]/10 text-[hsl(var(--command-success))]">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Exported
                </Badge>
              )}
              {exportStatus === 'error' && (
                <Badge variant="outline" className="bg-[hsl(var(--command-danger))]/10 text-[hsl(var(--command-danger))]">
                  <X className="h-3 w-3 mr-1" />
                  Failed
                </Badge>
              )}
              <Button
                onClick={handleExport}
                disabled={exportStatus !== 'idle'}
                className="btn-premium"
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>

          {/* Import Data */}
          <div className="flex items-center justify-between p-4 glass-morphism rounded-lg">
            <div>
              <h3 className="font-heading font-semibold">Import Data</h3>
              <p className="text-sm text-[hsl(var(--command-text-muted))]">
                Restore data from a previously exported JSON file
              </p>
            </div>
            <div className="flex items-center gap-2">
              {importStatus === 'success' && (
                <Badge variant="outline" className="bg-[hsl(var(--command-success))]/10 text-[hsl(var(--command-success))]">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Imported
                </Badge>
              )}
              {importStatus === 'error' && (
                <Badge variant="outline" className="bg-[hsl(var(--command-danger))]/10 text-[hsl(var(--command-danger))]">
                  <X className="h-3 w-3 mr-1" />
                  Failed
                </Badge>
              )}
              <Button
                disabled={importStatus !== 'idle'}
                className="btn-premium relative overflow-hidden"
              >
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="h-4 w-4 mr-2" />
                Import JSON
              </Button>
            </div>
          </div>

          {/* Clear Data */}
          <div className="flex items-center justify-between p-4 glass-morphism rounded-lg border border-[hsl(var(--command-danger))]/20">
            <div>
              <h3 className="font-heading font-semibold text-[hsl(var(--command-danger))]">
                Clear All Data
              </h3>
              <p className="text-sm text-[hsl(var(--command-text-muted))]">
                Permanently delete all stored data (cannot be undone)
              </p>
            </div>
            <Dialog open={clearConfirmOpen} onOpenChange={setClearConfirmOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="bg-[hsl(var(--command-danger))]/10 text-[hsl(var(--command-danger))] border border-[hsl(var(--command-danger))]/30 hover:bg-[hsl(var(--command-danger))]/20">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Data
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-morphism border-[hsl(var(--command-border-bright))]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-[hsl(var(--command-danger))]">
                    <AlertTriangle className="h-5 w-5" />
                    Confirm Data Deletion
                  </DialogTitle>
                  <DialogDescription className="text-[hsl(var(--command-text-muted))]">
                    This action will permanently delete all your tasks, content, events, and memories. 
                    This cannot be undone. Make sure to export your data first if you want to keep a backup.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setClearConfirmOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleClearData}
                    className="flex-1 bg-[hsl(var(--command-danger))] hover:bg-[hsl(var(--command-danger))]/80"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Everything
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}