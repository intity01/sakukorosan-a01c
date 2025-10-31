"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Task, PomodoroSession, TimerMode, PomodoroState, Settings, StreakData } from "./types"
import { formatLocalDate } from "./utils"

interface PomodoroContextType extends PomodoroState {
  addTask: (title: string, category?: Task["category"]) => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
  setCurrentTask: (task: Task | null) => void
  addSession: (session: PomodoroSession) => void
  setTimerMode: (mode: TimerMode) => void
  getTotalPomodoros: () => number
  getCompletedDates: () => string[]
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
  streakData: StreakData
  updateStreak: () => void
  playCompletionSound: () => void
  showNotification: (title: string, body: string) => void
  getTodayPomodoros: () => number
  setTimeLeft: (time: number) => void
  setIsRunning: (running: boolean) => void
  resetTimer: () => void
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined)

const STORAGE_KEY = "pomodoro-data"
const SETTINGS_KEY = "pomodoro-settings"
const STREAK_KEY = "pomodoro-streak"

const DEFAULT_SETTINGS: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
  notificationsEnabled: true,
  darkMode: false,
  dailyGoal: 8,
  screenReaderEnabled: true,
  keyboardShortcutsEnabled: true,
}

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: "",
}

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [currentTask, setCurrentTaskState] = useState<Task | null>(null)
  const [timerMode, setTimerModeState] = useState<TimerMode>("focus")
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK)

  // Timer state
  const getInitialTime = (mode: TimerMode) => {
    switch (mode) {
      case "focus":
        return settings.focusDuration * 60
      case "shortBreak":
        return settings.shortBreakDuration * 60
      case "longBreak":
        return settings.longBreakDuration * 60
    }
  }

  const [timeLeft, setTimeLeft] = useState(getInitialTime(timerMode))
  const [isRunning, setIsRunning] = useState(false)
  const [initialTime, setInitialTime] = useState(getInitialTime(timerMode))

  // Update timer when mode or settings change
  useEffect(() => {
    const newTime = getInitialTime(timerMode)
    setTimeLeft(newTime)
    setInitialTime(newTime)
    setIsRunning(false)
  }, [timerMode, settings.focusDuration, settings.shortBreakDuration, settings.longBreakDuration])

  // Timer countdown logic
  useEffect(() => {
    if (!isRunning || timeLeft === 0) {
      if (timeLeft === 0 && isRunning) {
        setIsRunning(false)
        playCompletionSound()
        showNotification(
          "Pomodoro Complete!",
          timerMode === "focus" ? "Great work! Time for a break." : "Break's over! Ready to focus?",
        )

        if (timerMode === "focus" && currentTask) {
          addSession({
            taskId: currentTask.id,
            date: formatLocalDate(),
            duration: initialTime,
            completed: true,
          })
        }
      }
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, timerMode, currentTask, initialTime])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setTasks(data.tasks || [])
        setSessions(data.sessions || [])
        if (data.currentTask) {
          setCurrentTaskState(data.currentTask)
        }
      } catch (e) {
        console.error("Failed to load data:", e)
      }
    }

    const storedSettings = localStorage.getItem(SETTINGS_KEY)
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings))
      } catch (e) {
        console.error("Failed to load settings:", e)
      }
    }

    const storedStreak = localStorage.getItem(STREAK_KEY)
    if (storedStreak) {
      try {
        setStreakData(JSON.parse(storedStreak))
      } catch (e) {
        console.error("Failed to load streak:", e)
      }
    }

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    const data = { tasks, sessions, currentTask }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [tasks, sessions, currentTask])

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))

    if (settings.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [settings])

  useEffect(() => {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData))
  }, [streakData])

  const addTask = (title: string, category?: Task["category"]) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: Date.now(),
      category,
    }
    setTasks((prev) => [...prev, newTask])
    if (!currentTask) {
      setCurrentTaskState(newTask)
    }
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    if (currentTask?.id === id) {
      setCurrentTaskState(null)
    }
  }

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const addSession = (session: PomodoroSession) => {
    setSessions((prev) => [...prev, session])
    if (session.completed) {
      updateStreak()
    }
  }

  const setCurrentTask = (task: Task | null) => {
    setCurrentTaskState(task)
  }

  const setTimerMode = (mode: TimerMode) => {
    setTimerModeState(mode)
  }

  const resetTimer = () => {
    const newTime = getInitialTime(timerMode)
    setTimeLeft(newTime)
    setInitialTime(newTime)
    setIsRunning(false)
  }

  const getTotalPomodoros = () => {
    return sessions.filter((s) => s.completed).length
  }

  const getCompletedDates = () => {
    const dates = new Set(sessions.filter((s) => s.completed).map((s) => s.date))
    return Array.from(dates)
  }

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const updateStreak = () => {
    const today = formatLocalDate()
    const yesterday = formatLocalDate(new Date(Date.now() - 86400000))

    setStreakData((prev) => {
      if (prev.lastActiveDate === today) {
        return prev
      }

      let newStreak = prev.currentStreak
      if (prev.lastActiveDate === yesterday) {
        newStreak += 1
      } else if (prev.lastActiveDate !== today) {
        newStreak = 1
      }

      return {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, prev.longestStreak),
        lastActiveDate: today,
      }
    })
  }

  const playCompletionSound = () => {
    if (!settings.soundEnabled) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (e) {
      console.error("Failed to play sound:", e)
    }
  }

  const showNotification = (title: string, body: string) => {
    if (!settings.notificationsEnabled) return

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/sakukoro-logo.png",
        badge: "/sakukoro-logo.png",
      })
    }
  }

  const getTodayPomodoros = () => {
    const today = formatLocalDate()
    return sessions.filter((s) => s.completed && s.date === today).length
  }

  return (
    <PomodoroContext.Provider
      value={{
        tasks,
        sessions,
        currentTask,
        timerMode,
        timeLeft,
        isRunning,
        initialTime,
        addTask,
        deleteTask,
        toggleTaskComplete,
        setCurrentTask,
        addSession,
        setTimerMode,
        getTotalPomodoros,
        getCompletedDates,
        settings,
        updateSettings,
        streakData,
        updateStreak,
        playCompletionSound,
        showNotification,
        getTodayPomodoros,
        setTimeLeft,
        setIsRunning,
        resetTimer,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  )
}

export function usePomodoro() {
  const context = useContext(PomodoroContext)
  if (!context) {
    throw new Error("usePomodoro must be used within PomodoroProvider")
  }
  return context
}
