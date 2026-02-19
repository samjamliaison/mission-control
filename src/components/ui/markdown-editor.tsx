"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Link,
  Eye,
  Edit,
  Split
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
}

interface ToolbarButtonProps {
  icon: React.ElementType
  tooltip: string
  onClick: () => void
  active?: boolean
}

function ToolbarButton({ icon: Icon, tooltip, onClick, active }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-8 w-8 p-0 hover:bg-[hsl(var(--command-accent))]/20",
        active && "bg-[hsl(var(--command-accent))]/20 text-[hsl(var(--command-accent))]"
      )}
      title={tooltip}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your markdown here...",
  rows = 12,
  className
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('split')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertAtCursor = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder
    const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end)
    
    onChange(newText)
    
    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length + after.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      textarea.focus()
    }, 0)
  }, [value, onChange])

  const toolbarActions = {
    bold: () => insertAtCursor('**', '**', 'bold text'),
    italic: () => insertAtCursor('*', '*', 'italic text'),
    h1: () => insertAtCursor('# ', '', 'Heading 1'),
    h2: () => insertAtCursor('## ', '', 'Heading 2'), 
    h3: () => insertAtCursor('### ', '', 'Heading 3'),
    ul: () => insertAtCursor('- ', '', 'List item'),
    ol: () => insertAtCursor('1. ', '', 'List item'),
    code: () => insertAtCursor('`', '`', 'code'),
    link: () => insertAtCursor('[', '](url)', 'Link text')
  }

  // Simple markdown to HTML conversion for preview
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^- (.*$)/gm, '<ul><li>$1</li></ul>')
      .replace(/^1\. (.*$)/gm, '<ol><li>$1</li></ol>')
      .replace(/<\/ul>\s*<ul>/g, '')
      .replace(/<\/ol>\s*<ol>/g, '')
      .replace(/\n/g, '<br>')
  }

  const renderEditor = () => (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-[hsl(var(--command-border))] bg-[hsl(var(--command-surface))]/50">
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Bold} tooltip="Bold (Ctrl+B)" onClick={toolbarActions.bold} />
          <ToolbarButton icon={Italic} tooltip="Italic (Ctrl+I)" onClick={toolbarActions.italic} />
        </div>
        
        <div className="w-px h-6 bg-[hsl(var(--command-border))] mx-1" />
        
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Heading1} tooltip="Heading 1" onClick={toolbarActions.h1} />
          <ToolbarButton icon={Heading2} tooltip="Heading 2" onClick={toolbarActions.h2} />
          <ToolbarButton icon={Heading3} tooltip="Heading 3" onClick={toolbarActions.h3} />
        </div>
        
        <div className="w-px h-6 bg-[hsl(var(--command-border))] mx-1" />
        
        <div className="flex items-center gap-1">
          <ToolbarButton icon={List} tooltip="Bullet List" onClick={toolbarActions.ul} />
          <ToolbarButton icon={ListOrdered} tooltip="Numbered List" onClick={toolbarActions.ol} />
        </div>
        
        <div className="w-px h-6 bg-[hsl(var(--command-border))] mx-1" />
        
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Code} tooltip="Inline Code" onClick={toolbarActions.code} />
          <ToolbarButton icon={Link} tooltip="Link" onClick={toolbarActions.link} />
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-1">
          <ToolbarButton 
            icon={Edit} 
            tooltip="Edit Mode" 
            onClick={() => setMode('edit')}
            active={mode === 'edit'}
          />
          <ToolbarButton 
            icon={Split} 
            tooltip="Split View" 
            onClick={() => setMode('split')}
            active={mode === 'split'}
          />
          <ToolbarButton 
            icon={Eye} 
            tooltip="Preview Mode" 
            onClick={() => setMode('preview')}
            active={mode === 'preview'}
          />
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 flex">
        {(mode === 'edit' || mode === 'split') && (
          <div className={cn("flex-1", mode === 'split' && "border-r border-[hsl(var(--command-border))]")}>
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={rows}
              className="h-full resize-none border-0 rounded-none focus:ring-0 focus:border-0 font-mono text-sm"
            />
          </div>
        )}
        
        {(mode === 'preview' || mode === 'split') && (
          <div className={cn("flex-1 p-4 overflow-y-auto bg-[hsl(var(--command-surface))]/30")}>
            {value.trim() ? (
              <div 
                className="prose prose-invert max-w-none prose-headings:text-[hsl(var(--command-text))] prose-p:text-[hsl(var(--command-text-muted))] prose-strong:text-[hsl(var(--command-text))] prose-em:text-[hsl(var(--command-text-muted))] prose-code:text-[hsl(var(--command-accent))] prose-code:bg-[hsl(var(--command-surface))] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-a:text-[hsl(var(--command-accent))]"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
              />
            ) : (
              <div className="text-[hsl(var(--command-text-muted))] italic">
                Preview will appear here as you type...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Card className={cn("glass-morphism border-[hsl(var(--command-border))]", className)}>
      <CardContent className="p-0 h-96">
        {renderEditor()}
      </CardContent>
    </Card>
  )
}