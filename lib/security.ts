/**
 * Security utilities for input sanitization and validation
 */

import { SECURITY_CONFIG } from "./config"

/**
 * Sanitize user input to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input) return ""
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, "")
  
  // Remove script tags and event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, "")
  
  // Trim whitespace
  sanitized = sanitized.trim()
  
  // Limit length
  if (sanitized.length > SECURITY_CONFIG.MAX_TASK_TITLE_LENGTH) {
    sanitized = sanitized.substring(0, SECURITY_CONFIG.MAX_TASK_TITLE_LENGTH)
  }
  
  return sanitized
}

/**
 * Validate task title
 */
export function validateTaskTitle(title: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeInput(title)
  
  if (!sanitized) {
    return { valid: false, error: "Task title cannot be empty" }
  }
  
  if (sanitized.length > SECURITY_CONFIG.MAX_TASK_TITLE_LENGTH) {
    return { valid: false, error: `Task title must be less than ${SECURITY_CONFIG.MAX_TASK_TITLE_LENGTH} characters` }
  }
  
  if (sanitized.length < SECURITY_CONFIG.MIN_TASK_TITLE_LENGTH) {
    return { valid: false, error: `Task title must be at least ${SECURITY_CONFIG.MIN_TASK_TITLE_LENGTH} characters` }
  }
  
  return { valid: true }
}

/**
 * Validate date string
 */
export function validateDate(dateStr: string): boolean {
  if (!dateStr) return false
  
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

/**
 * Validate time string (HH:MM format)
 */
export function validateTime(timeStr: string): boolean {
  if (!timeStr) return false
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(timeStr)
}

/**
 * Validate settings values
 */
export function validateSettings(settings: {
  focusDuration?: number
  shortBreakDuration?: number
  longBreakDuration?: number
  dailyGoal?: number
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (settings.focusDuration !== undefined) {
    if (settings.focusDuration < SECURITY_CONFIG.MIN_FOCUS_DURATION || 
        settings.focusDuration > SECURITY_CONFIG.MAX_FOCUS_DURATION) {
      errors.push(`Focus duration must be between ${SECURITY_CONFIG.MIN_FOCUS_DURATION} and ${SECURITY_CONFIG.MAX_FOCUS_DURATION} minutes`)
    }
  }
  
  if (settings.shortBreakDuration !== undefined) {
    if (settings.shortBreakDuration < SECURITY_CONFIG.MIN_BREAK_DURATION || 
        settings.shortBreakDuration > SECURITY_CONFIG.MAX_BREAK_DURATION) {
      errors.push(`Short break duration must be between ${SECURITY_CONFIG.MIN_BREAK_DURATION} and ${SECURITY_CONFIG.MAX_BREAK_DURATION} minutes`)
    }
  }
  
  if (settings.longBreakDuration !== undefined) {
    if (settings.longBreakDuration < SECURITY_CONFIG.MIN_LONG_BREAK_DURATION || 
        settings.longBreakDuration > SECURITY_CONFIG.MAX_LONG_BREAK_DURATION) {
      errors.push(`Long break duration must be between ${SECURITY_CONFIG.MIN_LONG_BREAK_DURATION} and ${SECURITY_CONFIG.MAX_LONG_BREAK_DURATION} minutes`)
    }
  }
  
  if (settings.dailyGoal !== undefined) {
    if (settings.dailyGoal < SECURITY_CONFIG.MIN_DAILY_GOAL || 
        settings.dailyGoal > SECURITY_CONFIG.MAX_DAILY_GOAL) {
      errors.push(`Daily goal must be between ${SECURITY_CONFIG.MIN_DAILY_GOAL} and ${SECURITY_CONFIG.MAX_DAILY_GOAL} pomodoros`)
    }
  }
  
  return { valid: errors.length === 0, errors }
}

/**
 * Safely parse JSON with error handling
 */
export function safeJSONParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.error("Failed to parse JSON:", e)
    return fallback
  }
}

/**
 * Validate color theme
 */
export function validateColorTheme(theme: string): theme is 'blue' | 'green' | 'purple' | 'pink' | 'orange' {
  return ['blue', 'green', 'purple', 'pink', 'orange'].includes(theme)
}

/**
 * Validate window size
 */
export function validateWindowSize(size: string): size is 'compact' | 'normal' | 'large' {
  return ['compact', 'normal', 'large'].includes(size)
}

/**
 * Validate timer state
 */
export function validateTimerState(state: any): boolean {
  if (!state || typeof state !== 'object') return false
  
  // Check required fields
  if (typeof state.isRunning !== 'boolean') return false
  if (typeof state.timeLeft !== 'number' || state.timeLeft < 0 || state.timeLeft > 7200) return false
  if (!['focus', 'shortBreak', 'longBreak'].includes(state.mode)) return false
  
  return true
}

/**
 * Sanitize notification text
 */
export function sanitizeNotificationText(text: string, maxLength: number = 200): string {
  if (!text || typeof text !== 'string') return ''
  
  // Remove HTML tags and scripts
  let sanitized = text.replace(/<[^>]*>/g, '')
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  
  // Trim and limit length
  sanitized = sanitized.trim()
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength) + '...'
  }
  
  return sanitized
}
