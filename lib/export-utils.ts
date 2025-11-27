/**
 * Export utilities for statistics and data
 */

import type { Task, DailyStats } from './types'

interface ExportData {
  tasks: Task[]
  stats: DailyStats[]
  settings: Record<string, unknown>
  exportDate: string
  version: string
}

/**
 * Export data as JSON file
 */
export function exportAsJSON(data: ExportData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  downloadFile(blob, `sakukoro-backup-${formatDate(new Date())}.json`)
}

/**
 * Export statistics as CSV
 */
export function exportStatsAsCSV(stats: DailyStats[]): void {
  const headers = ['Date', 'Completed Pomodoros', 'Total Focus Time (min)', 'Tasks Completed']

  const rows = stats.map(stat => [
    stat.date,
    stat.completedPomodoros.toString(),
    stat.totalFocusTime.toString(),
    stat.tasksCompleted.toString()
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  downloadFile(blob, `sakukoro-stats-${formatDate(new Date())}.csv`)
}

/**
 * Export tasks as CSV
 */
export function exportTasksAsCSV(tasks: Task[]): void {
  const headers = [
    'Title',
    'Category',
    'Priority',
    'Status',
    'Estimated Pomodoros',
    'Completed Pomodoros',
    'Created Date',
    'Due Date'
  ]

  const rows = tasks.map(task => [
    task.title,
    task.category || '',
    task.priority || '',
    task.completed ? 'Completed' : 'Pending',
    task.estimatedPomodoros?.toString() || '0',
    task.completedPomodoros?.toString() || '0',
    task.createdAt || '',
    task.dueDate || ''
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  downloadFile(blob, `sakukoro-tasks-${formatDate(new Date())}.csv`)
}

/**
 * Generate statistics summary as text
 */
export function generateStatsSummary(stats: DailyStats[]): string {
  const totalPomodoros = stats.reduce((sum, s) => sum + s.completedPomodoros, 0)
  const totalFocusTime = stats.reduce((sum, s) => sum + s.totalFocusTime, 0)
  const totalTasks = stats.reduce((sum, s) => sum + s.tasksCompleted, 0)
  const avgPomodorosPerDay = stats.length > 0 ? (totalPomodoros / stats.length).toFixed(1) : '0'

  const focusHours = Math.floor(totalFocusTime / 60)
  const focusMinutes = totalFocusTime % 60

  return `
📊 Sakukoro Pomodoro Statistics Summary
========================================

📅 Period: ${stats.length} days
🍅 Total Pomodoros: ${totalPomodoros}
⏱️ Total Focus Time: ${focusHours}h ${focusMinutes}m
✅ Tasks Completed: ${totalTasks}
📈 Average Pomodoros/Day: ${avgPomodorosPerDay}

Generated on: ${new Date().toLocaleString()}
  `.trim()
}

/**
 * Download file helper
 */
function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Format date for filename
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Import data from JSON file
 */
export async function importFromJSON(file: File): Promise<ExportData | null> {
  try {
    const text = await file.text()
    const data = JSON.parse(text) as ExportData

    // Validate structure
    if (!data.tasks || !Array.isArray(data.tasks)) {
      throw new Error('Invalid data format: missing tasks')
    }

    return data
  } catch (error) {
    console.error('Import error:', error)
    return null
  }
}
