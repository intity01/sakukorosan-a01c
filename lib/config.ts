/**
 * Security and Performance Configuration
 */

export const SECURITY_CONFIG = {
  // Input validation limits
  MAX_TASK_TITLE_LENGTH: 200,
  MIN_TASK_TITLE_LENGTH: 2,
  MAX_ESTIMATED_POMODOROS: 50,
  MIN_ESTIMATED_POMODOROS: 1,
  
  // Timer limits (in minutes)
  MIN_FOCUS_DURATION: 1,
  MAX_FOCUS_DURATION: 120,
  MIN_BREAK_DURATION: 1,
  MAX_BREAK_DURATION: 60,
  MIN_LONG_BREAK_DURATION: 1,
  MAX_LONG_BREAK_DURATION: 120,
  
  // Daily goal limits
  MIN_DAILY_GOAL: 1,
  MAX_DAILY_GOAL: 50,
  
  // Storage limits
  MAX_SESSIONS_TO_KEEP: 1000,
  DATA_RETENTION_DAYS: 90,
  AUTO_CLEANUP_THRESHOLD_DAYS: 30,
  
  // Performance
  DEBOUNCE_DELAY: 500, // milliseconds
  THROTTLE_DELAY: 1000, // milliseconds
  RENDER_PERFORMANCE_THRESHOLD: 100, // milliseconds
  
  // Rate limiting
  MAX_TASKS_PER_MINUTE: 10,
  MAX_SESSIONS_PER_MINUTE: 20,
}

export const ALLOWED_CATEGORIES = [
  "work",
  "personal",
  "study",
  "exercise",
  "other",
] as const

export const ALLOWED_PRIORITIES = ["low", "medium", "high"] as const

export const ALLOWED_TIMER_MODES = ["focus", "shortBreak", "longBreak"] as const
