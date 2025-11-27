import type { PomodoroSession } from "./types"

export interface Analytics {
  bestFocusHour: number // Hour of day (0-23) with most sessions
  averageSessionQuality: number // Percentage 0-100
  weeklyComparison: {
    thisWeek: number
    lastWeek: number
    change: number // Percentage change
  }
  monthlyComparison: {
    thisMonth: number
    lastMonth: number
    change: number
  }
  productivityScore: number // 0-100
  hourlyDistribution: { hour: number; count: number }[]
}

export function calculateAnalytics(sessions: PomodoroSession[]): Analytics {
  const completedSessions = sessions.filter(s => s.completed)
  
  // Best Focus Hour
  const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
    const count = completedSessions.filter(s => {
      const sessionDate = new Date(s.date)
      return sessionDate.getHours() === hour
    }).length
    return { hour, count }
  })
  
  const bestFocusHour = hourlyDistribution.reduce((best, current) => 
    current.count > best.count ? current : best
  ).hour

  // Average Session Quality (based on completion rate and consistency)
  const totalSessions = sessions.length
  const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0
  const averageSessionQuality = Math.min(completionRate, 100)

  // Weekly Comparison
  const now = new Date()
  const thisWeekStart = new Date(now)
  thisWeekStart.setDate(now.getDate() - now.getDay())
  thisWeekStart.setHours(0, 0, 0, 0)
  
  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)
  
  const thisWeek = completedSessions.filter(s => {
    const sessionDate = new Date(s.date)
    return sessionDate >= thisWeekStart
  }).length
  
  const lastWeek = completedSessions.filter(s => {
    const sessionDate = new Date(s.date)
    return sessionDate >= lastWeekStart && sessionDate < thisWeekStart
  }).length
  
  const weeklyChange = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0

  // Monthly Comparison
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  
  const thisMonth = completedSessions.filter(s => {
    const sessionDate = new Date(s.date)
    return sessionDate >= thisMonthStart
  }).length
  
  const lastMonth = completedSessions.filter(s => {
    const sessionDate = new Date(s.date)
    return sessionDate >= lastMonthStart && sessionDate <= lastMonthEnd
  }).length
  
  const monthlyChange = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0

  // Productivity Score (weighted combination)
  const streakBonus = Math.min(thisWeek * 5, 30) // Up to 30 points for consistency
  const volumeBonus = Math.min(thisMonth * 2, 40) // Up to 40 points for volume
  const qualityBonus = Math.min(completionRate * 0.3, 30) // Up to 30 points for quality
  const productivityScore = Math.min(Math.round(streakBonus + volumeBonus + qualityBonus), 100)

  return {
    bestFocusHour,
    averageSessionQuality: Math.round(averageSessionQuality),
    weeklyComparison: {
      thisWeek,
      lastWeek,
      change: Math.round(weeklyChange)
    },
    monthlyComparison: {
      thisMonth,
      lastMonth,
      change: Math.round(monthlyChange)
    },
    productivityScore,
    hourlyDistribution
  }
}

export function formatHour(hour: number): string {
  if (hour === 0) return "12 AM"
  if (hour === 12) return "12 PM"
  if (hour < 12) return `${hour} AM`
  return `${hour - 12} PM`
}

export function getProductivityLevel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Excellent", color: "text-green-500" }
  if (score >= 60) return { label: "Good", color: "text-blue-500" }
  if (score >= 40) return { label: "Fair", color: "text-yellow-500" }
  if (score >= 20) return { label: "Needs Improvement", color: "text-orange-500" }
  return { label: "Getting Started", color: "text-red-500" }
}
