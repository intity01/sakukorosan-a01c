"use client"

import { useState, useEffect } from "react"
import { TimerScreen } from "@/components/timer-screen"
import { DashboardScreen } from "@/components/dashboard-screen"
import { ProgressScreen } from "@/components/progress-screen"
import { StatsScreen } from "@/components/stats-screen"
import { BottomNav } from "@/components/bottom-nav"
import { FeedbackButton } from "@/components/feedback-button"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"progress" | "dashboard" | "timer" | "stats">("dashboard")

  // Keyboard navigation between screens
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      // Number keys 1-4 for screen navigation
      if (e.key === "1") {
        setCurrentScreen("progress")
      } else if (e.key === "2") {
        setCurrentScreen("dashboard")
      } else if (e.key === "3") {
        setCurrentScreen("timer")
      } else if (e.key === "4") {
        setCurrentScreen("stats")
      }
      // Arrow keys for sequential navigation
      else if (e.key === "ArrowLeft") {
        e.preventDefault()
        setCurrentScreen((prev) => {
          if (prev === "dashboard") return "progress"
          if (prev === "timer") return "dashboard"
          if (prev === "stats") return "timer"
          return prev
        })
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setCurrentScreen((prev) => {
          if (prev === "progress") return "dashboard"
          if (prev === "dashboard") return "timer"
          if (prev === "timer") return "stats"
          return prev
        })
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5d5c8] via-[#f0c4b8] to-[#f5d5c8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[800px] flex flex-col">
          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto">
            {currentScreen === "progress" && <ProgressScreen />}
            {currentScreen === "dashboard" && <DashboardScreen />}
            {currentScreen === "timer" && <TimerScreen />}
            {currentScreen === "stats" && <StatsScreen />}
          </div>

          {/* Bottom Navigation */}
          <BottomNav currentScreen={currentScreen} onScreenChange={setCurrentScreen} />
        </div>
      </div>

      {/* Feedback Button */}
      <FeedbackButton />
    </div>
  )
}
