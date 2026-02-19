"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Keyboard, 
  Zap, 
  Navigation, 
  Command, 
  X, 
  Hash,
  ArrowRight,
  Search,
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { KeyboardShortcut } from "@/hooks/use-keyboard-shortcuts"

interface ShortcutsHelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shortcuts: KeyboardShortcut[]
  pendingSequence?: string | null
}

const categoryIcons = {
  global: Command,
  navigation: Navigation,
  actions: Zap,
  modals: X
}

const categoryColors = {
  global: 'text-[hsl(var(--command-accent))] bg-[hsl(var(--command-accent))]/10 border-[hsl(var(--command-accent))]/20',
  navigation: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  actions: 'text-green-400 bg-green-500/10 border-green-500/20',
  modals: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
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
      ease: [0.4, 0.0, 0.2, 1] as any
    }
  }
}

function KeyBadge({ 
  keyStr, 
  modifier, 
  sequence = false, 
  isPending = false 
}: { 
  keyStr: string | string[]
  modifier?: string
  sequence?: boolean
  isPending?: boolean
}) {
  const keys = Array.isArray(keyStr) ? keyStr : [keyStr]
  
  const formatKey = (key: string) => {
    const keyMap: Record<string, string> = {
      'cmd': '⌘',
      'ctrl': 'Ctrl',
      'shift': '⇧',
      'alt': '⌥',
      'escape': 'Esc',
      'arrowup': '↑',
      'arrowdown': '↓',
      'arrowleft': '←',
      'arrowright': '→',
      ' ': 'Space'
    }
    return keyMap[key.toLowerCase()] || key.toUpperCase()
  }

  return (
    <div className="flex items-center gap-1">
      {modifier && (
        <>
          <Badge 
            variant="outline" 
            className="px-2 py-1 text-xs font-mono bg-[hsl(var(--command-surface))] border-[hsl(var(--command-border))]"
          >
            {formatKey(modifier)}
          </Badge>
          <span className="text-[hsl(var(--command-text-muted))] text-sm">+</span>
        </>
      )}
      
      {sequence && keys.length > 1 ? (
        <div className="flex items-center gap-1">
          <Badge 
            variant="outline" 
            className={cn(
              "px-2 py-1 text-xs font-mono",
              isPending && keys[0] === 'g' 
                ? "bg-[hsl(var(--command-accent))]/20 border-[hsl(var(--command-accent))]/40 text-[hsl(var(--command-accent))]"
                : "bg-[hsl(var(--command-surface))] border-[hsl(var(--command-border))]"
            )}
          >
            {formatKey(keys[0])}
          </Badge>
          <ArrowRight className="h-3 w-3 text-[hsl(var(--command-text-muted))]" />
          <Badge 
            variant="outline" 
            className="px-2 py-1 text-xs font-mono bg-[hsl(var(--command-surface))] border-[hsl(var(--command-border))]"
          >
            {formatKey(keys[1])}
          </Badge>
        </div>
      ) : (
        keys.map((key, index) => (
          <Badge 
            key={index}
            variant="outline" 
            className="px-2 py-1 text-xs font-mono bg-[hsl(var(--command-surface))] border-[hsl(var(--command-border))]"
          >
            {formatKey(key)}
          </Badge>
        ))
      )}
    </div>
  )
}

export function ShortcutsHelpModal({ 
  open, 
  onOpenChange, 
  shortcuts, 
  pendingSequence 
}: ShortcutsHelpModalProps) {
  
  const categorizedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, KeyboardShortcut[]>)

  const categoryOrder: (keyof typeof categoryIcons)[] = ['global', 'navigation', 'actions', 'modals']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden glass-morphism border-[hsl(var(--command-border-bright))] p-0">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-[hsl(var(--command-border))]">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: "linear-gradient(135deg, hsl(var(--command-accent)) 0%, transparent 50%)"
            }}
          />
          
          <DialogHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 glass-morphism rounded-lg">
                <Keyboard className="h-5 w-5 text-[hsl(var(--command-accent))]" />
              </div>
              <DialogTitle className="text-xl font-display font-bold">
                Keyboard Shortcuts
              </DialogTitle>
            </div>
            <DialogDescription className="text-[hsl(var(--command-text-muted))]">
              Master Mission Control with these keyboard shortcuts. Press <Badge variant="outline" className="px-1 py-0.5 text-xs">?</Badge> anytime to open this help.
            </DialogDescription>
            
            {/* Pending sequence indicator */}
            <AnimatePresence>
              {pendingSequence && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 p-2 bg-[hsl(var(--command-accent))]/10 border border-[hsl(var(--command-accent))]/20 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Hash className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                    <span className="text-[hsl(var(--command-accent))]">
                      Sequence started: <Badge variant="outline" className="ml-1 px-1 py-0.5 text-xs">{pendingSequence.toUpperCase()}</Badge>
                    </span>
                    <span className="text-[hsl(var(--command-text-muted))]">
                      - Press the next key to complete
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {categoryOrder.map((categoryKey) => {
              const category = categorizedShortcuts[categoryKey]
              if (!category) return null
              
              const Icon = categoryIcons[categoryKey]
              const colorClass = categoryColors[categoryKey]
              
              return (
                <motion.div key={categoryKey} variants={itemVariants}>
                  <Card className="glass-morphism border-[hsl(var(--command-border))] h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-base">
                        <div className={cn("p-2 rounded-lg", colorClass)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="capitalize font-semibold">
                          {categoryKey === 'global' ? 'Global' : 
                           categoryKey === 'navigation' ? 'Navigation' :
                           categoryKey === 'actions' ? 'Actions' : 'Modals'}
                        </span>
                        <Badge variant="outline" className="ml-auto">
                          {category.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {category.map((shortcut, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="flex items-center justify-between p-3 glass-morphism rounded-lg group hover:bg-[hsl(var(--command-surface))]/30 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[hsl(var(--command-text))]">
                              {shortcut.description}
                            </p>
                          </div>
                          <KeyBadge 
                            keyStr={shortcut.key}
                            modifier={shortcut.modifier}
                            sequence={shortcut.sequence}
                            isPending={
                              shortcut.sequence && 
                              Array.isArray(shortcut.key) && 
                              shortcut.key[0] === pendingSequence
                            }
                          />
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Tips section */}
          <motion.div variants={itemVariants} className="mt-6">
            <Card className="glass-morphism border-[hsl(var(--command-border))]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Search className="h-4 w-4 text-[hsl(var(--command-accent))]" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[hsl(var(--command-accent))] rounded-full" />
                      <span className="text-[hsl(var(--command-text-muted))]">
                        Sequences like <KeyBadge keyStr="g" /> then <KeyBadge keyStr="t" /> have a 2-second timeout
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-[hsl(var(--command-text-muted))]">
                        Shortcuts work globally except when typing in inputs
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full" />
                      <span className="text-[hsl(var(--command-text-muted))]">
                        <KeyBadge keyStr="Escape" /> always works to close modals
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span className="text-[hsl(var(--command-text-muted))]">
                        Use number keys 1-8 for quick page navigation
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}