"use client"

import { Card, CardHeader, CardTitle, CardContent } from "./card"

/**
 * Color System Reference Component
 * Demonstrates the exact color specifications used throughout Mission Control
 */
export function ColorSystem() {
  const colorSpecs = [
    {
      category: "Background",
      colors: [
        { name: "Background", value: "#09090b", class: "bg-[#09090b]", description: "Primary app background" }
      ]
    },
    {
      category: "Surfaces",
      colors: [
        { name: "Surface", value: "rgba(255,255,255,0.03)", class: "bg-white/[0.03]", description: "Card backgrounds" },
        { name: "Surface Elevated", value: "rgba(255,255,255,0.05)", class: "bg-white/[0.05]", description: "Hover states" }
      ]
    },
    {
      category: "Borders", 
      colors: [
        { name: "Border Default", value: "rgba(255,255,255,0.06)", class: "border-white/[0.06]", description: "Card borders" },
        { name: "Border Bright", value: "rgba(255,255,255,0.12)", class: "border-white/[0.12]", description: "Hover borders" }
      ]
    },
    {
      category: "Text",
      colors: [
        { name: "Text Primary", value: "rgba(255,255,255,0.9)", class: "text-white/90", description: "Primary content" },
        { name: "Text Secondary", value: "rgba(255,255,255,0.5)", class: "text-white/50", description: "Secondary content" },
        { name: "Text Dim", value: "rgba(255,255,255,0.3)", class: "text-white/30", description: "Disabled/subtle" }
      ]
    },
    {
      category: "Semantic Colors",
      colors: [
        { name: "Accent (Cyan)", value: "#06b6d4", class: "bg-[#06b6d4]", description: "Primary actions" },
        { name: "Success (Green)", value: "#22c55e", class: "bg-[#22c55e]", description: "Success states" },
        { name: "Warning (Orange)", value: "#f59e0b", class: "bg-[#f59e0b]", description: "Warning states" },
        { name: "Danger (Red)", value: "#ef4444", class: "bg-[#ef4444]", description: "Error states" }
      ]
    }
  ]

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold bg-gradient-to-br from-white/90 via-[#06b6d4] to-white/70 bg-clip-text text-transparent mb-2">
          Mission Control Color System
        </h2>
        <p className="text-white/50">Exact color specifications for consistent design</p>
      </div>

      {colorSpecs.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle>{category.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.colors.map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 hover:scale-[1.02] transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className={`w-8 h-8 rounded-lg border border-white/[0.12] ${color.class}`}
                    />
                    <div>
                      <div className="font-medium text-white/90">{color.name}</div>
                      <div className="text-xs text-white/50 font-mono">{color.value}</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/60">{color.description}</p>
                  <div className="text-xs text-white/40 font-mono mt-2 p-2 bg-white/[0.02] rounded border border-white/[0.04]">
                    {color.class}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Usage Example */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] hover:scale-[1.01] transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white/90 font-semibold">Sample Component</h3>
              <div className="bg-[#06b6d4] text-white text-xs px-2 py-1 rounded">Active</div>
            </div>
            <p className="text-white/50 text-sm mb-3">
              This demonstrates the consistent color usage across components.
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-[#22c55e] text-white text-xs px-2 py-1 rounded">Success</div>
              <div className="bg-[#f59e0b] text-white text-xs px-2 py-1 rounded">Warning</div>
              <div className="bg-[#ef4444] text-white text-xs px-2 py-1 rounded">Danger</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}