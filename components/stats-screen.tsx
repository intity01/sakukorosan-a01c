"use client"

import { AppHeader } from "@/components/app-header"
import { usePomodoro } from "@/lib/pomodoro-context"
import { formatLocalDate } from "@/lib/utils"
import { Clock, TrendingUp, Calendar, Flame, Target, BarChart3 } from "lucide-react"

export function StatsScreen() {
  const { sessions, getTotalPomodoros, streakData, getTodayPomodoros, settings, tasks } = usePomodoro()

  const completedSessions = sessions.filter((s) => s.completed)
  const totalMinutes = completedSessions.reduce((acc, s) => acc + s.duration / 60, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = Math.floor(totalMinutes % 60)

  const getLast7DaysData = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const formattedDate = formatLocalDate(date)
      const count = sessions.filter((s) => s.completed && s.date === formattedDate).length
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
      return { date: formattedDate, count, dayName }
    })
  }

  const weekData = getLast7DaysData()
  const maxCount = Math.max(...weekData.map((d) => d.count), 1)
  const weeklyTotal = weekData.reduce((acc, day) => acc + day.count, 0)
  const avgDaily = (weeklyTotal / 7).toFixed(1)

  const todayPomodoros = getTodayPomodoros()
  const goalProgress = (todayPomodoros / settings.dailyGoal) * 100

  const categoryStats = tasks.reduce(
    (acc, task) => {
      if (task.category) {
        acc[task.category] = (acc[task.category] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="flex flex-col h-full">
      <AppHeader />

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-foreground mb-6 text-balance">Statistics</h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-2xl p-5 border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Total Time</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalHours}h {remainingMinutes}m
            </p>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Total Sessions</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{getTotalPomodoros()}</p>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Current Streak</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{streakData.currentStreak} days</p>
            <p className="text-xs text-muted-foreground mt-1">Best: {streakData.longestStreak} days</p>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Avg Daily</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{avgDaily}</p>
            <p className="text-xs text-muted-foreground mt-1">sessions/day</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-primary/10 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground">Today's Goal</h3>
          </div>
          <div className="flex items-end justify-between mb-2">
            <p className="text-3xl font-bold text-foreground">
              {todayPomodoros}/{settings.dailyGoal}
            </p>
            <p className="text-sm text-muted-foreground">{Math.min(Math.round(goalProgress), 100)}%</p>
          </div>
          <div className="w-full bg-primary/10 rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(goalProgress, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-primary/10 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground">Last 7 Days</h3>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {weekData.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex-1 w-full flex items-end">
                  <div
                    className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30"
                    style={{ height: `${(day.count / maxCount) * 100}%`, minHeight: day.count > 0 ? "8px" : "0" }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-foreground">{day.count}</p>
                  <p className="text-xs text-muted-foreground">{day.dayName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {Object.keys(categoryStats).length > 0 && (
          <div className="bg-card rounded-2xl p-5 border border-primary/10">
            <h3 className="text-base font-bold text-foreground mb-4">Tasks by Category</h3>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <p className="text-sm text-foreground capitalize">{category}</p>
                  </div>
                  <p className="text-sm font-bold text-foreground">{count}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
