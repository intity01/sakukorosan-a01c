export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: number
  category?: "work" | "study" | "personal"
  estimatedPomodoros?: number
}

export interface PomodoroSession {
  taskId: string
  date: string
  duration: number
  completed: boolean
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
  soundEnabled: boolean
  notificationsEnabled: boolean
  darkMode: boolean
  dailyGoal: number // number of pomodoros per day
  screenReaderEnabled?: boolean
  keyboardShortcutsEnabled?: boolean
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
}
