export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: number
  category?: "work" | "study" | "personal" | "health"
  estimatedPomodoros?: number
  scheduledDate?: string // ISO date string (YYYY-MM-DD)
  scheduledTime?: string // Time string (HH:mm)
  dueDate?: string // ISO date string (YYYY-MM-DD)
  priority?: "low" | "medium" | "high"
}

export interface PomodoroSession {
  taskId: string
  date: string
  duration: number
  completed: boolean
  pauseNotes?: string[] // Notes added during pauses
}

export type TimerMode = "focus" | "shortBreak" | "longBreak"

export interface PomodoroState {
  tasks: Task[]
  sessions: PomodoroSession[]
  currentTask: Task | null
  timerMode: TimerMode
  timeLeft: number
  isRunning: boolean
  initialTime: number
}

export interface Settings {
  focusDuration: number // in minutes
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval?: number // pomodoros before long break (default 4)
  soundEnabled: boolean
  notificationsEnabled: boolean
  darkMode: boolean
  dailyGoal: number // number of pomodoros per day
  screenReaderEnabled?: boolean
  keyboardShortcutsEnabled?: boolean
  // Sound settings
  soundTheme?: "bell" | "digital" | "kitchen" | "bird"
  volume?: number // 0-100 (new name for consistency)
  soundVolume?: number // 0-100 (legacy support)
  // Focus music
  focusMusicEnabled?: boolean
  focusMusicType?: "lofi" | "classical" | "nature" | "whitenoise" | "jazz"
  focusMusicVolume?: number // 0-100
  // Auto features
  autoStartNextSession?: boolean
  autoStartBreaks?: boolean
  autoStartBreak?: boolean // Alias for autoStartBreaks
  autoStartFocus?: boolean
  autoStartPomodoro?: boolean // Alias for autoStartFocus
  pauseDetection?: boolean
  focusMode?: boolean
  // Visual settings
  colorTheme?: "blue" | "green" | "purple" | "pink" | "orange"
  timerAnimation?: "smooth" | "bouncy" | "minimal"
  breathingAnimation?: boolean
  particleEffects?: boolean
  showTips?: boolean
  // Navigation
  idleTimeout?: number // in minutes, default 3
  // Desktop integration
  autoStartup?: boolean
  minimizeToTray?: boolean
  showMenubarTimer?: boolean
  alwaysOnTop?: boolean
  windowSize?: 'compact' | 'normal' | 'large'
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
}
