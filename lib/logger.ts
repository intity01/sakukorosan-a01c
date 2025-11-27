// Centralized logging utility
// Automatically disabled in production builds

const isDev = process.env.NODE_ENV === 'development'
const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true'

export const logger = {
  log: (...args: any[]) => {
    if (isDev || isDebug) {
      console.log(...args)
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args)
  },
  
  warn: (...args: any[]) => {
    if (isDev || isDebug) {
      console.warn(...args)
    }
  },
  
  debug: (...args: any[]) => {
    if (isDebug) {
      console.debug(...args)
    }
  },
  
  info: (...args: any[]) => {
    if (isDev || isDebug) {
      console.info(...args)
    }
  }
}
