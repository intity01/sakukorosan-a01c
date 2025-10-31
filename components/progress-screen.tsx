"use client"

import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Timer, Flame, Target } from "lucide-react"
import { usePomodoro } from "@/lib/pomodoro-context"
import { formatLocalDate } from "@/lib/utils"

export function ProgressScreen() {
  const { getCompletedDates, setTimerMode, streakData, getTodayPomodoros, settings } = usePomodoro()
  const completedDates = getCompletedDates()
  const todayPomodoros = getTodayPomodoros()
  const goalProgress = (todayPomodoros / settings.dailyGoal) * 100

  const daysOfWeek = ["SU", "M", "TU", "W", "TH", "F", "S"]
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const hasCompletedSession = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return completedDates.includes(formatLocalDate(date))
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader />

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-foreground mb-6 text-balance">My Progress</h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-2xl p-5 border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Current Streak</p>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{streakData.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Longest: {streakData.longestStreak} days</p>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Daily Goal</p>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">
              {todayPomodoros}/{settings.dailyGoal}
            </p>
            <div className="w-full bg-primary/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(goalProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            className="flex-1 bg-card border-primary/20 text-foreground rounded-xl h-auto py-4 hover:bg-primary/5 hover:border-primary/30 transition-all"
            onClick={() => setTimerMode("focus")}
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Timer className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground font-medium">Focus</p>
              <p className="text-sm font-bold text-foreground">{settings.focusDuration} Mins</p>
            </div>
          </Button>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-primary/10">
          <h3 className="text-base font-bold text-foreground mb-4">{currentMonth}</h3>

          <div className="grid grid-cols-7 gap-2 mb-3">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-xs font-bold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {calendarDays.map((day) => (
              <div
                key={day}
                className={`aspect-square flex items-center justify-center text-sm rounded-xl transition-all font-medium ${
                  hasCompletedSession(day)
                    ? "bg-primary/25 text-foreground shadow-sm scale-105"
                    : day === currentDate.getDate()
                      ? "bg-primary/10 text-foreground ring-2 ring-primary/30"
                      : "text-muted-foreground hover:bg-primary/5"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
