"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Clock, File, CheckSquare, Calendar, Users, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  type: "task" | "memory" | "calendar" | "agent" | "page"
  description?: string
  url?: string
}

interface RecentSearch {
  query: string
  timestamp: number
}

export function GlobalSearch() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('mission-control-recent-searches')
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch {}
    }
  }, [])

  // Save recent searches
  const saveRecentSearch = (query: string) => {
    const newSearch: RecentSearch = { query, timestamp: Date.now() }
    const updated = [newSearch, ...recentSearches.filter(s => s.query !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('mission-control-recent-searches', JSON.stringify(updated))
  }

  // Mock search function - replace with real search logic
  const performSearch = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return []

    const mockResults: SearchResult[] = [
      {
        id: "1",
        title: "Update dashboard components",
        type: "task",
        description: "Enhance the main dashboard with new metrics",
        url: "/tasks/1"
      },
      {
        id: "2",
        title: "Project Meeting Notes",
        type: "memory",
        description: "Weekly sync discussion points",
        url: "/memory/2"
      },
      {
        id: "3",
        title: "Sprint Planning",
        type: "calendar",
        description: "Plan upcoming development cycle",
        url: "/calendar/3"
      },
      {
        id: "4",
        title: "Hamza",
        type: "agent",
        description: "Primary agent - Development Lead",
        url: "/team"
      }
    ]

    return mockResults.filter(r =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Handle search
  useEffect(() => {
    if (query.trim()) {
      const searchResults = performSearch(query)
      setResults(searchResults)
    } else {
      setResults([])
    }
  }, [query])

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim())
      // Here you could navigate to a full search results page
      setIsOpen(false)
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('mission-control-recent-searches')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckSquare className="h-4 w-4" />
      case 'memory': return <File className="h-4 w-4" />
      case 'calendar': return <Calendar className="h-4 w-4" />
      case 'agent': return <Users className="h-4 w-4" />
      default: return <File className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task': return 'text-blue-400 bg-blue-500/10'
      case 'memory': return 'text-purple-400 bg-purple-500/10'
      case 'calendar': return 'text-green-400 bg-green-500/10'
      case 'agent': return 'text-orange-400 bg-orange-500/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  return (
    <div ref={searchRef} className="relative max-w-md w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query)
            }
            if (e.key === 'Escape') {
              setIsOpen(false)
              inputRef.current?.blur()
            }
          }}
          placeholder="Search everything..."
          className="pl-10 bg-[hsl(var(--command-surface))]/50 border-white/20 text-white placeholder:text-white/60 focus:border-[hsl(var(--command-accent))]/50 focus:ring-[hsl(var(--command-accent))]/25"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[hsl(var(--command-surface-elevated))]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50"
          >
            {query.trim() ? (
              <div>
                {results.length > 0 ? (
                  <div className="p-2">
                    <div className="text-xs font-semibold text-white/60 px-3 py-2 uppercase tracking-wider">
                      Results
                    </div>
                    {results.map((result) => (
                      <motion.a
                        key={result.id}
                        href={result.url || '#'}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        whileHover={{ x: 2 }}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className={cn("p-2 rounded-lg", getTypeColor(result.type))}>
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white/90 font-medium truncate">
                            {result.title}
                          </div>
                          {result.description && (
                            <div className="text-white/60 text-sm truncate">
                              {result.description}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-white/40 capitalize">
                          {result.type}
                        </div>
                      </motion.a>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-white/60">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2">
                {recentSearches.length > 0 && (
                  <>
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Recent
                      </div>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-white/40 hover:text-white/60 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search.query)
                          handleSearch(search.query)
                        }}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                      >
                        <Clock className="h-4 w-4 text-white/40" />
                        <span className="text-white/70">{search.query}</span>
                      </button>
                    ))}
                  </>
                )}
                <div className="px-3 py-4 text-center text-white/40 text-sm">
                  Start typing to search...
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}