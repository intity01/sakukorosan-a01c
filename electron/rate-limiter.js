/**
 * Simple rate limiter for IPC calls
 */

const limits = {
  'update-color-theme': { maxCalls: 10, windowMs: 1000 },
  'show-notification': { maxCalls: 5, windowMs: 5000 },
  'set-taskbar-status': { maxCalls: 60, windowMs: 1000 },
  'update-timer-state': { maxCalls: 60, windowMs: 1000 }
}

const callHistory = {}

function check(action) {
  const limit = limits[action]
  if (!limit) return true // No limit defined, allow

  const now = Date.now()

  if (!callHistory[action]) {
    callHistory[action] = []
  }

  // Remove old entries outside the window
  callHistory[action] = callHistory[action].filter(
    timestamp => now - timestamp < limit.windowMs
  )

  // Check if we're over the limit
  if (callHistory[action].length >= limit.maxCalls) {
    return false // Rate limited
  }

  // Record this call
  callHistory[action].push(now)
  return true
}

module.exports = { check }
