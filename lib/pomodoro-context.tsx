"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from "react"
import type { Task, PomodoroSession, TimerMode, PomodoroState, Settings, StreakData } from "./types"
import { formatLocalDate } from "./utils"
import { sanitizeInput, validateTaskTitle, validateSettings, safeJSONParse } from "./security"
import { debounce } from "./debounce"
import { logger } from "./logger"
import { IdleDetector } from "./idle-detector"

interface PomodoroContextType extends PomodoroState {
  addTask: (
    title: string,
    options?: {
      category?: Task["category"]
      estimatedPomodoros?: number
      scheduledDate?: string
      scheduledTime?: string
      dueDate?: string
      priority?: Task["priority"]
    },
  ) => void
  updateTask: (id: string, updates: Partial<Task>) => void
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
  exportData: () => string
  importData: (jsonData: string) => boolean
  clearOldData: (daysToKeep: number) => void
  clearAllData: () => void
  showConfetti: boolean
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
  // Sound settings
  soundTheme: "bell",
  soundVolume: 70,
  // Auto features
  autoStartNextSession: false,
  autoStartBreaks: false,
  pauseDetection: true,
  focusMode: false,
  // Visual settings
  colorTheme: "blue",
  timerAnimation: "smooth",
  breathingAnimation: true,
  particleEffects: true,
  // Desktop integration
  autoStartup: false,
  minimizeToTray: false,
  showMenubarTimer: false,
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
  const [notifiedTasks, setNotifiedTasks] = useState<Set<string>>(new Set())
  const [showConfetti, setShowConfetti] = useState(false)
  const confettiTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const idleDetectorRef = useRef<IdleDetector | null>(null)

  // Debounced localStorage save function
  const saveToLocalStorage = useCallback(
    debounce((data: { tasks: Task[]; sessions: PomodoroSession[]; currentTask: Task | null }) => {
      try {
        const dataString = JSON.stringify(data)
        localStorage.setItem(STORAGE_KEY, dataString)
        
        // Check storage usage and warn if > 80%
        const storageSize = new Blob([dataString]).size
        const maxStorage = 5 * 1024 * 1024 // 5MB typical limit
        const usagePercent = (storageSize / maxStorage) * 100
        
        if (usagePercent > 80) {
          logger.warn(`Storage usage: ${usagePercent.toFixed(1)}% - Consider cleaning old data`)
        }
      } catch (e) {
        logger.error("Failed to save data (localStorage may be full):", e)
        // Auto-cleanup old sessions if storage is full
        if (e instanceof Error && e.name === "QuotaExceededError") {
          const oneMonthAgo = new Date()
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
          const filteredSessions = data.sessions.filter((s) => new Date(s.date) > oneMonthAgo)
          const cleanedData = { tasks: data.tasks, sessions: filteredSessions, currentTask: data.currentTask }
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedData))
            logger.info("Auto-cleaned old sessions (older than 1 month)")
            // Notify user
            if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
              new Notification("Storage Cleanup", {
                body: "Automatically cleaned old data to free up space",
                icon: "/sakukoro-mascot.png"
              })
            }
          } catch (cleanupError) {
            logger.error("Still failed after cleanup:", cleanupError)
            // Last resort: clear everything except current task
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
                tasks: data.tasks.slice(-10), // Keep last 10 tasks
                sessions: [], 
                currentTask: data.currentTask 
              }))
              logger.info("Emergency cleanup: Kept only recent tasks")
            } catch (emergencyError) {
              logger.error("Emergency cleanup failed:", emergencyError)
            }
          }
        }
      }
    }, 500), // Debounce for 500ms
    []
  )

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
          
          // Check if task is now complete
          const taskSessions = sessions.filter(s => s.taskId === currentTask.id && s.completed).length + 1
          if (taskSessions >= (currentTask.estimatedPomodoros || 1)) {
            toggleTaskComplete(currentTask.id, true) // Mark as complete
            
            // Show confetti with proper cleanup
            setShowConfetti(true)
            if (confettiTimeoutRef.current) {
              clearTimeout(confettiTimeoutRef.current)
            }
            confettiTimeoutRef.current = setTimeout(() => {
              setShowConfetti(false)
              confettiTimeoutRef.current = null
            }, 4000)
          }
        }

        // Auto-start next session logic
        const shouldAutoStart = 
          (timerMode === "focus" && settings.autoStartBreaks) || 
          (timerMode !== "focus" && settings.autoStartNextSession)

        if (shouldAutoStart) {
          // Determine next mode
          let nextMode: TimerMode = "focus"
          if (timerMode === "focus") {
            // After focus, decide between short or long break
            const focusSessions = sessions.filter(s => s.completed).length + 1
            nextMode = focusSessions % 4 === 0 ? "longBreak" : "shortBreak"
          }
          // After any break, go back to focus

          // Switch mode and auto-start after a brief delay
          setTimeout(() => {
            if (nextMode !== timerMode) {
              setTimerMode(nextMode)
            }
            // Give a moment for mode change to apply, then start
            setTimeout(() => {
              setIsRunning(true)
            }, 100)
          }, 1500) // 1.5 second delay before auto-starting
        }
      }
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, timerMode, currentTask, initialTime])

  // Cleanup confetti timeout on unmount
  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current)
      }
    }
  }, [])

  // Idle Detection System
  useEffect(() => {
    if (!settings.pauseDetection) {
      // Stop idle detection if disabled
      if (idleDetectorRef.current) {
        idleDetectorRef.current.stop()
      }
      return
    }

    // Initialize idle detector (5 minutes threshold)
    if (!idleDetectorRef.current) {
      idleDetectorRef.current = new IdleDetector(5)
    }

    // Only track idle during focus sessions
    if (isRunning && timerMode === 'focus') {
      idleDetectorRef.current.start(() => {
        // User went idle - pause timer and notify
        setIsRunning(false)
        showNotification(
          "⏸️ Timer Paused",
          "You've been away for a while. Timer paused automatically."
        )
      })
    } else {
      idleDetectorRef.current.stop()
    }

    return () => {
      idleDetectorRef.current?.stop()
    }
  }, [isRunning, timerMode, settings.pauseDetection])

  // Check for scheduled tasks every minute
  useEffect(() => {
    const checkScheduledTasks = () => {
      const now = new Date()
      const today = now.toISOString().split("T")[0]
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

      tasks.forEach((task) => {
        if (
          !task.completed &&
          task.scheduledDate === today &&
          task.scheduledTime === currentTime &&
          !notifiedTasks.has(task.id)
        ) {
          showNotification("⏰ เวลาทำงาน!", `ถึงเวลาทำ: ${task.title}`)
          setNotifiedTasks((prev) => new Set(prev).add(task.id))
        }

        // Check for overdue tasks (1 day after due date)
        if (task.dueDate && !task.completed && !notifiedTasks.has(`${task.id}-overdue`)) {
          const dueDate = new Date(task.dueDate)
          const yesterday = new Date(now)
          yesterday.setDate(yesterday.getDate() - 1)

          if (dueDate < yesterday) {
            showNotification("⚠️ งานเลย Deadline!", `${task.title} เลย deadline แล้ว!`)
            setNotifiedTasks((prev) => new Set(prev).add(`${task.id}-overdue`))
          }
        }
      })
    }

    // Check immediately and then every minute
    checkScheduledTasks()
    const interval = setInterval(checkScheduledTasks, 60000) // Every 1 minute

    return () => clearInterval(interval)
  }, [tasks, notifiedTasks])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = safeJSONParse<{ tasks?: Task[]; sessions?: PomodoroSession[]; currentTask?: Task | null }>(
          stored, 
          { tasks: [], sessions: [], currentTask: null }
        )
        
        // Validate and sanitize loaded data
        const sanitizedTasks = (data.tasks || []).map((task: Task) => ({
          ...task,
          title: sanitizeInput(task.title || ""),
        }))
        
        setTasks(sanitizedTasks)
        setSessions(data.sessions || [])
        if (data.currentTask) {
          setCurrentTaskState({
            ...data.currentTask,
            title: sanitizeInput(data.currentTask.title || ""),
          })
        }
      } catch (e) {
        console.error("Failed to load data:", e)
      }
    }

    const storedSettings = localStorage.getItem(SETTINGS_KEY)
    if (storedSettings) {
      try {
        const loadedSettings = safeJSONParse<Settings>(storedSettings, DEFAULT_SETTINGS)
        const validation = validateSettings(loadedSettings)
        
        if (validation.valid) {
          setSettings(loadedSettings)
        } else {
          console.warn("Invalid settings detected:", validation.errors)
          setSettings(DEFAULT_SETTINGS)
        }
      } catch (e) {
        console.error("Failed to load settings:", e)
      }
    }

    const storedStreak = localStorage.getItem(STREAK_KEY)
    if (storedStreak) {
      try {
        setStreakData(safeJSONParse<StreakData>(storedStreak, DEFAULT_STREAK))
      } catch (e) {
        console.error("Failed to load streak:", e)
      }
    }

    // Don't auto-request notification permission on load
    // Let user enable it explicitly in settings
  }, [])

  // Save data with debouncing
  useEffect(() => {
    const data = { tasks, sessions, currentTask }
    saveToLocalStorage(data)
  }, [tasks, sessions, currentTask, saveToLocalStorage])

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    } catch (e) {
      console.error("Failed to save settings:", e)
    }

    if (settings.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Sync minimizeToTray setting with Electron main process
    if (typeof window !== 'undefined' && window.electron?.setMinimizeToTray) {
      window.electron.setMinimizeToTray(settings.minimizeToTray ?? false)
    }
  }, [settings])

  useEffect(() => {
    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify(streakData))
    } catch (e) {
      console.error("Failed to save streak:", e)
    }
  }, [streakData])

  // Electron Desktop Integration
  useEffect(() => {
    if (typeof window === 'undefined' || !window.electron) return

    // Update timer state in Electron main process for menubar/tray
    window.electron.updateTimerState({
      isRunning,
      timeLeft,
      mode: timerMode
    })

    // Update taskbar progress
    if (isRunning && initialTime > 0) {
      const progress = 1 - (timeLeft / initialTime)
      window.electron.setTaskbarStatus({
        progress,
        timerMode
      })
    } else if (!isRunning && timeLeft === initialTime) {
      window.electron.setTaskbarStatus('idle')
    }
  }, [isRunning, timeLeft, timerMode, initialTime])

  // Listen for tray menu actions
  useEffect(() => {
    if (typeof window === 'undefined' || !window.electron?.onTrayAction) return

    window.electron.onTrayAction((action: string) => {
      console.log('Tray action:', action)
      
      switch (action) {
        case 'toggle':
          setIsRunning(prev => !prev)
          break
        case 'reset':
          resetTimer()
          break
        case 'skip':
          // Skip to next session
          if (timerMode === 'focus') {
            const focusSessions = sessions.filter(s => s.completed).length
            const nextMode = focusSessions % 4 === 3 ? 'longBreak' : 'shortBreak'
            setTimerMode(nextMode)
          } else {
            setTimerMode('focus')
          }
          break
      }
    })
  }, [timerMode, sessions])

  // Listen for global keyboard shortcuts
  useEffect(() => {
    if (typeof window === 'undefined' || !window.electron?.onGlobalShortcut) return

    window.electron.onGlobalShortcut((action: string) => {
      console.log('Global shortcut:', action)
      
      switch (action) {
        case 'toggle-timer':
          setIsRunning(prev => !prev)
          break
        case 'reset-timer':
          resetTimer()
          break
        case 'skip-timer':
          // Skip to next session
          if (timerMode === 'focus') {
            const focusSessions = sessions.filter(s => s.completed).length
            const nextMode = focusSessions % 4 === 3 ? 'longBreak' : 'shortBreak'
            setTimerMode(nextMode)
          } else {
            setTimerMode('focus')
          }
          break
      }
    })
  }, [timerMode, sessions])

  const addTask = (
    title: string,
    options?: {
      category?: Task["category"]
      estimatedPomodoros?: number
      scheduledDate?: string
      scheduledTime?: string
      dueDate?: string
      priority?: Task["priority"]
    },
  ) => {
    // Validate and sanitize input
    const validation = validateTaskTitle(title)
    if (!validation.valid) {
      console.error("Invalid task title:", validation.error)
      return
    }
    
    const sanitizedTitle = sanitizeInput(title)
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: sanitizedTitle,
      completed: false,
      createdAt: Date.now(),
      category: options?.category,
      estimatedPomodoros: options?.estimatedPomodoros 
        ? Math.max(1, Math.min(50, options.estimatedPomodoros))
        : undefined,
      scheduledDate: options?.scheduledDate,
      scheduledTime: options?.scheduledTime,
      dueDate: options?.dueDate,
      priority: options?.priority,
    }
    setTasks((prev) => [...prev, newTask])
    if (!currentTask) {
      setCurrentTaskState(newTask)
    }
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    // Sanitize title if being updated
    const sanitizedUpdates = { ...updates }
    if (updates.title) {
      const validation = validateTaskTitle(updates.title)
      if (!validation.valid) {
        console.error("Invalid task title:", validation.error)
        return
      }
      sanitizedUpdates.title = sanitizeInput(updates.title)
    }
    
    // Validate estimatedPomodoros
    if (updates.estimatedPomodoros !== undefined) {
      sanitizedUpdates.estimatedPomodoros = Math.max(1, Math.min(50, updates.estimatedPomodoros))
    }
    
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...sanitizedUpdates } : t)))
    if (currentTask?.id === id) {
      setCurrentTaskState((prev) => (prev ? { ...prev, ...sanitizedUpdates } : null))
    }
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    if (currentTask?.id === id) {
      setCurrentTaskState(null)
    }
  }

  const toggleTaskComplete = (id: string, forceComplete?: boolean) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isCompleted = forceComplete !== undefined ? forceComplete : !t.completed
          if (isCompleted && !t.completed) {
            // Task is being marked as complete for the first time
            showNotification("🎉 Task Complete!", `You've finished: ${t.title}`)
            playCompletionSound()
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 4000)
          }
          return { ...t, completed: isCompleted }
        }
        return t
      }),
    )
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

  const exportData = () => {
    const data = {
      tasks,
      sessions,
      currentTask,
      settings,
      streakData,
      exportDate: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData)
      if (data.tasks) setTasks(data.tasks)
      if (data.sessions) setSessions(data.sessions)
      if (data.currentTask) setCurrentTaskState(data.currentTask)
      if (data.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings })
      if (data.streakData) setStreakData(data.streakData)
      return true
    } catch (e) {
      console.error("Failed to import data:", e)
      return false
    }
  }

  const clearOldData = (daysToKeep: number) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
    
    const filteredSessions = sessions.filter((s) => new Date(s.date) >= cutoffDate)
    setSessions(filteredSessions)
    
    // Also clear completed tasks older than cutoff
    const filteredTasks = tasks.filter((t) => {
      if (!t.completed) return true
      return t.createdAt >= cutoffDate.getTime()
    })
    setTasks(filteredTasks)
  }

  const clearAllData = () => {
    setTasks([])
    setSessions([])
    setCurrentTaskState(null)
    setStreakData(DEFAULT_STREAK)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STREAK_KEY)
  }

  const getTotalPomodoros = () => {
    return sessions.filter((s) => s.completed).length
  }

  const getCompletedDates = () => {
    const dates = new Set(sessions.filter((s) => s.completed).map((s) => s.date))
    return Array.from(dates)
  }

  const updateSettings = (newSettings: Partial<Settings>) => {
    // Validate settings before updating
    const validation = validateSettings(newSettings)
    if (!validation.valid) {
      console.error("Invalid settings:", validation.errors)
      return
    }
    
    // If enabling notifications for the first time, request permission
    if (newSettings.notificationsEnabled && !settings.notificationsEnabled) {
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            setSettings((prev) => ({ ...prev, ...newSettings }))
          } else {
            // User denied, keep notifications disabled
            logger.warn("Notification permission denied")
          }
        })
        return
      }
    }
    
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
      const audio = new Audio('/notification.mp3')
      audio.volume = 0.5
      audio.play().catch((e) => {
        console.error("Failed to play sound:", e)
      })
    } catch (e) {
      console.error("Failed to create audio:", e)
    }
  }

  const showNotification = (title: string, body: string) => {
    if (!settings.notificationsEnabled) {
      logger.debug('Notifications disabled in settings')
      return
    }

    logger.debug('Attempting to show notification:', title, body)

    // Try Electron native notification first
    if (typeof window !== "undefined" && window.electron?.showNotification) {
      logger.debug('Using Electron notification')
      try {
        window.electron.showNotification(title, body, "/sakukoro-mascot.png")
      } catch (e) {
        logger.error('Electron notification error:', e)
      }
    }
    // Fallback to browser notification
    else if (typeof window !== "undefined" && "Notification" in window) {
      logger.debug('Electron not available, trying browser notification')
      if (Notification.permission === "granted") {
        logger.debug('Browser notification permission granted')
        new Notification(title, {
          body,
          icon: "/sakukoro-mascot.png",
          badge: "/sakukoro-mascot.png",
        })
      } else if (Notification.permission !== "denied") {
        logger.debug('Requesting browser notification permission')
        // Request permission
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, {
              body,
              icon: "/sakukoro-logo.png",
              badge: "/sakukoro-logo.png",
            })
          }
        })
      } else {
        logger.debug('Browser notification permission denied')
      }
    } else {
      logger.debug('No notification API available')
    }
  }

  const getTodayPomodoros = useCallback(() => {
    const today = formatLocalDate()
    return sessions.filter((s) => s.completed && s.date === today).length
  }, [sessions])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      tasks,
      sessions,
      currentTask,
      timerMode,
      timeLeft,
      isRunning,
      initialTime,
      showConfetti,
      addTask,
      updateTask,
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
      exportData,
      importData,
      clearOldData,
      clearAllData,
    }),
    [
      tasks,
      sessions,
      currentTask,
      timerMode,
      timeLeft,
      isRunning,
      initialTime,
      showConfetti,
      settings,
      streakData,
      getTodayPomodoros,
    ]
  )

  return (
    <PomodoroContext.Provider value={contextValue}>
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
