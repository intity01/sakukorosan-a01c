/**
 * Rate limiting utilities to prevent abuse
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()

  /**
   * Check if action is allowed based on rate limit
   * @param key - Unique identifier for the action
   * @param maxRequests - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns true if action is allowed, false if rate limited
   */
  checkLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const entry = this.limits.get(key)

    // If no entry or reset time has passed, create new entry
    if (!entry || now >= entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return true
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      return false
    }

    // Increment count
    entry.count++
    return true
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string): void {
    this.limits.delete(key)
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.limits.clear()
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.limits.entries()) {
      if (now >= entry.resetTime) {
        this.limits.delete(key)
      }
    }
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter()

// Cleanup expired entries every minute
if (typeof window !== "undefined") {
  setInterval(() => {
    rateLimiter.cleanup()
  }, 60000)
}

/**
 * Rate limit decorator for functions
 */
export function rateLimit(maxRequests: number, windowMs: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      const key = `${target.constructor.name}.${propertyKey}`
      
      if (!rateLimiter.checkLimit(key, maxRequests, windowMs)) {
        console.warn(`Rate limit exceeded for ${key}`)
        return
      }

      return originalMethod.apply(this, args)
    }

    return descriptor
  }
}
