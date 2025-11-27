/**
 * Idle Detection System
 * Tracks user activity and detects when user goes idle
 */

export class IdleDetector {
  private lastActivityTime: number = Date.now()
  private idleThreshold: number // milliseconds
  private checkInterval: NodeJS.Timeout | null = null
  private onIdleCallback: (() => void) | null = null
  private isIdle: boolean = false

  constructor(idleThresholdMinutes: number = 5) {
    this.idleThreshold = idleThresholdMinutes * 60 * 1000
    this.setupListeners()
  }

  private setupListeners() {
    if (typeof window === 'undefined') return

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const resetTimer = () => {
      this.lastActivityTime = Date.now()
      if (this.isIdle) {
        this.isIdle = false
      }
    }

    events.forEach(event => {
      window.addEventListener(event, resetTimer, true)
    })
  }

  start(onIdle: () => void) {
    this.onIdleCallback = onIdle
    this.lastActivityTime = Date.now()
    
    // Check every 30 seconds
    this.checkInterval = setInterval(() => {
      const idleTime = Date.now() - this.lastActivityTime
      
      if (idleTime >= this.idleThreshold && !this.isIdle) {
        this.isIdle = true
        this.onIdleCallback?.()
      }
    }, 30000)
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
    this.isIdle = false
  }

  reset() {
    this.lastActivityTime = Date.now()
    this.isIdle = false
  }

  getIdleTime(): number {
    return Date.now() - this.lastActivityTime
  }

  setThreshold(minutes: number) {
    this.idleThreshold = minutes * 60 * 1000
  }
}
