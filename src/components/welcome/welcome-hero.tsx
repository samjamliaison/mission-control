"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Bot, 
  Activity, 
  Calendar, 
  PieChart, 
  Zap, 
  Shield, 
  ArrowRight,
  Sparkles
} from "lucide-react"

export function WelcomeHero() {
  const router = useRouter()

  const features = [
    {
      icon: Bot,
      title: "AI Agents",
      description: "Deploy and manage intelligent AI agents"
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Track agent performance and system health"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Automated task scheduling and planning"
    },
    {
      icon: PieChart,
      title: "Analytics",
      description: "Deep insights into agent behavior"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed and efficiency"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security and uptime"
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-900 via-slate-900 to-indigo-900">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm mb-8 animate-fadeIn">
              <Sparkles className="w-4 h-4" />
              Welcome to the Future of AI Management
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black text-white mb-6 tracking-tight leading-none animate-slideUp">
              Mission 
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent block">
                Control
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-white/80 mb-12 font-light animate-slideUp delay-200">
              Command center for your AI agents
            </p>
            
            <Button 
              onClick={() => router.push("/")}
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 text-lg px-8 py-6 rounded-2xl shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105 animate-slideUp delay-400"
            >
              <span className="flex items-center gap-3">
                Enter Command Center
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto animate-slideUp delay-600">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent"></div>
    </div>
  )
}