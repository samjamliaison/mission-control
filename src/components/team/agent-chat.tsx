"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Send,
  MessageCircle,
  Zap,
  Clock
} from "lucide-react"
// Use RealAgent interface instead of Agent
interface RealAgent {
  id: string
  name: string
  avatar: string
  role: string
  status: 'online' | 'active' | 'idle' | 'offline'
  workspace: string
  soul?: string
  currentActivity?: string
  activeTasks: number
  completedTasks: number
  skills: string[]
  expertise: string[]
  lastSeen: number
  joinedAt: number
  efficiency: number
  description: string
}
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  timestamp: number
  isUser: boolean
}

interface AgentChatProps {
  agent: RealAgent | null
  isOpen: boolean
  onClose: () => void
}

// Pre-set personality messages for each agent
const agentPersonalities = {
  "Manus": [
    { id: "1", content: "Task analysis complete. Inefficiencies identified.", timestamp: Date.now() - 300000, isUser: false },
    { id: "2", content: "Direct approach recommended. No time for pleasantries.", timestamp: Date.now() - 240000, isUser: false },
    { id: "3", content: "Status: Operational. Ready for next directive.", timestamp: Date.now() - 180000, isUser: false }
  ],
  "Monica": [
    { id: "1", content: "Hey! Just got back from researching that travel itinerary ✈️", timestamp: Date.now() - 300000, isUser: false },
    { id: "2", content: "Found some amazing local spots and transport options. Want the details?", timestamp: Date.now() - 240000, isUser: false },
    { id: "3", content: "BTW, weather looks perfect for the trip! 🌞", timestamp: Date.now() - 180000, isUser: false }
  ],
  "Jarvis": [
    { id: "1", content: "Analytical review of recent data patterns completed.", timestamp: Date.now() - 300000, isUser: false },
    { id: "2", content: "Statistical significance: 94.7%. Confidence interval established.", timestamp: Date.now() - 240000, isUser: false },
    { id: "3", content: "Recommendation: Proceed with calculated approach based on metrics.", timestamp: Date.now() - 180000, isUser: false }
  ],
  "Luna": [
    { id: "1", content: "Just had the most inspiring idea for the creative brief! 🌙✨", timestamp: Date.now() - 300000, isUser: false },
    { id: "2", content: "What if we reimagined the whole concept through a dreamy, ethereal lens?", timestamp: Date.now() - 240000, isUser: false },
    { id: "3", content: "I'm seeing silver threads, soft lighting, and poetic narratives...", timestamp: Date.now() - 180000, isUser: false }
  ],
  "Hamza": [
    { id: "1", content: "System integration running smoothly today.", timestamp: Date.now() - 300000, isUser: false },
    { id: "2", content: "All agents reporting normal operational status.", timestamp: Date.now() - 240000, isUser: false },
    { id: "3", content: "Ready to coordinate next phase of mission objectives.", timestamp: Date.now() - 180000, isUser: false }
  ]
}

const statusColors = {
  "online": "text-[hsl(var(--command-success))]",
  "active": "text-[hsl(var(--command-accent))]",
  "idle": "text-yellow-400",
  "offline": "text-gray-400"
}

export function AgentChat({ agent, isOpen, onClose }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load agent-specific messages
  useEffect(() => {
    if (agent && isOpen) {
      const agentMessages = agentPersonalities[agent.name as keyof typeof agentPersonalities] || []
      setMessages(agentMessages)
      
      // Focus input when chat opens
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [agent, isOpen])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim() || !agent) return

    // Add user message (demo only - doesn't actually send)
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      timestamp: Date.now(),
      isUser: true
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")

    // Simulate agent typing response (demo)
    setTimeout(() => {
      const responses = [
        "Got it! Processing your request...",
        "Let me analyze that for you.",
        "Interesting approach. Working on it.",
        "Thanks for the input. On it!",
        "Roger that. Implementing now."
      ]
      
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
        isUser: false
      }

      setMessages(prev => [...prev, agentResponse])
    }, 1000 + Math.random() * 1000)
  }

  if (!agent) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Chat Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="glass-morphism border-[hsl(var(--command-border-bright))] shadow-2xl">
              {/* Header */}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{agent.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            statusColors[agent.status]
                          )}
                        >
                          {agent.status}
                        </Badge>
                        <span className="text-[hsl(var(--command-text-muted))]">
                          {agent.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 hover:bg-[hsl(var(--command-danger))]/20 hover:text-[hsl(var(--command-danger))]"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Messages Area */}
                <div className="h-80 overflow-y-auto space-y-3 pr-2">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex",
                        message.isUser ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] p-3 rounded-lg text-sm",
                          message.isUser
                            ? "bg-[hsl(var(--command-accent))]/20 text-[hsl(var(--command-accent))] rounded-br-none"
                            : "glass-morphism rounded-bl-none"
                        )}
                      >
                        <div className="font-medium mb-1">
                          {message.isUser ? "You" : agent.name}
                        </div>
                        <div className="leading-relaxed">{message.content}</div>
                        <div className="text-xs text-[hsl(var(--command-text-muted))] mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={`Message ${agent.name}...`}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      size="icon"
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-[hsl(var(--command-text-muted))] bg-[hsl(var(--command-warning))]/10 text-[hsl(var(--command-warning))] p-2 rounded-lg border border-[hsl(var(--command-warning))]/20">
                    <MessageCircle className="h-3 w-3 inline mr-1" />
                    Demo interface - messages simulate agent personality but don't actually send
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}