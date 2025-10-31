"use client"

import { useEffect } from "react"
import { AppHeader } from "@/components/app-header"
import { usePomodoro } from "@/lib/pomodoro-context"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TimerScreen() {
  const {
    currentTask,
    timerMode,
    setTimerMode,
    settings,
    timeLeft,
    isRunning,
    setTimeLeft,
    setIsRunning,
    resetTimer,
  } = usePomodoro()

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const initialTime =
    timerMode === "focus"
      ? settings.focusDuration * 60
      : timerMode === "shortBreak"
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60
  const progress = ((initialTime - timeLeft) / initialTime) * 100

  // Keyboard shortcuts
  useEffect(() => {
    if (!settings.keyboardShortcutsEnabled) return

    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.code === "Space") {
        e.preventDefault()
        setIsRunning(!isRunning)
      } else if (e.code === "KeyR") {
        e.preventDefault()
        resetTimer()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [settings.keyboardShortcutsEnabled, isRunning, setIsRunning, resetTimer])

  // Screen reader announcements
  useEffect(() => {
    if (!settings.screenReaderEnabled) return

    const announceTimeLeft = () => {
      if (timeLeft === 60) {
        const announcement = document.createElement("div")
        announcement.setAttribute("role", "status")
        announcement.setAttribute("aria-live", "polite")
        announcement.className = "sr-only"
        announcement.textContent = "1 minute remaining"
        document.body.appendChild(announcement)
        setTimeout(() => document.body.removeChild(announcement), 1000)
      }
    }

    if (isRunning) announceTimeLeft()
  }, [timeLeft, isRunning, settings.screenReaderEnabled])

  // Update browser tab title
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const minutes = Math.floor(timeLeft / 60)
      const seconds = timeLeft % 60
      document.title = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} - ${timerMode === "focus" ? "Focus" : timerMode === "shortBreak" ? "Short Break" : "Long Break"}`
    } else {
      document.title = "Sakukoro Pomodoro"
    }

    return () => {
      document.title = "Sakukoro Pomodoro"
    }
  }, [isRunning, timeLeft, timerMode])

  return (
    <div className="flex flex-col h-full">
      <AppHeader />

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <h2 className="text-3xl font-bold text-foreground mb-6 text-balance">
          {timerMode === "focus" ? "Focus Time" : timerMode === "shortBreak" ? "Short Break" : "Long Break"}
        </h2>

        <div className="flex gap-2 mb-10">
          <Button
            size="sm"
            variant={timerMode === "focus" ? "default" : "outline"}
            onClick={() => setTimerMode("focus")}
            className="rounded-xl px-4 py-2 font-medium transition-all"
          >
            Focus
          </Button>
          <Button
            size="sm"
            variant={timerMode === "shortBreak" ? "default" : "outline"}
            onClick={() => setTimerMode("shortBreak")}
            className="rounded-xl px-4 py-2 font-medium transition-all"
          >
            Short Break
          </Button>
          <Button
            size="sm"
            variant={timerMode === "longBreak" ? "default" : "outline"}
            onClick={() => setTimerMode("longBreak")}
            className="rounded-xl px-4 py-2 font-medium transition-all"
          >
            Long Break
          </Button>
        </div>

        <div className="relative w-80 h-80 mb-8">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="152"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-primary/15"
            />
            <circle
              cx="160"
              cy="160"
              r="152"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 152}`}
              strokeDashoffset={`${2 * Math.PI * 152 * (1 - progress / 100)}`}
              className="text-primary transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 rounded-full bg-card flex items-center justify-center shadow-lg">
            <div className="text-center">
              <div className="text-7xl font-bold text-foreground tabular-nums mb-6 tracking-tight">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  size="lg"
                  onClick={() => setIsRunning(!isRunning)}
                  className="rounded-full w-14 h-14 shadow-md hover:shadow-lg transition-all"
                >
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={resetTimer}
                  className="rounded-full w-14 h-14 bg-card hover:bg-primary/5 border-primary/20"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {currentTask ? (
          <div className="bg-card rounded-2xl px-6 py-3 border border-primary/20">
            <p className="text-sm text-muted-foreground text-center">
              <span className="font-semibold text-primary">Task:</span> {currentTask.title}
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl px-6 py-3 border border-border/50">
            <p className="text-sm text-muted-foreground text-center">No task selected</p>
          </div>
        )}
      </div>
    </div>
  )
}
