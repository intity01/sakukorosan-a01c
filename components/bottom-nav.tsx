"use client"

import { Lightbulb } from "lucide-react"
import Image from "next/image"

interface BottomNavProps {
  currentScreen: "progress" | "dashboard" | "timer" | "stats"
  onScreenChange: (screen: "progress" | "dashboard" | "timer" | "stats") => void
}

export function BottomNav({ currentScreen, onScreenChange }: BottomNavProps) {
  return (
    <div className="p-6 pt-4 border-t border-border/50">
      <div className="flex items-center justify-between">
        <div className="w-16 h-16 relative">
          <Image src="/sakukoro-logo.png" alt="Sakukoro mascot" width={64} height={64} className="object-contain" />
        </div>

        {/* Page Indicators */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
          <button
            onClick={() => onScreenChange("progress")}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentScreen === "progress"
                ? "bg-foreground scale-110"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label="Progress screen"
          />
          <button
            onClick={() => onScreenChange("dashboard")}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentScreen === "dashboard"
                ? "bg-foreground scale-110"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label="Dashboard screen"
          />
          <button
            onClick={() => onScreenChange("timer")}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentScreen === "timer"
                ? "bg-foreground scale-110"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label="Timer screen"
          />
        </div>

        <button
          onClick={() => onScreenChange("stats")}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
        >
          <Lightbulb className="w-5 h-5 text-primary" />
        </button>
      </div>
    </div>
  )
}
