import { useEffect, useRef } from "react"

/**
 * Hook to monitor component render performance
 * Logs warnings if render time exceeds threshold
 */
export function usePerformanceMonitor(componentName: string, threshold: number = 100) {
  const renderStartTime = useRef<number>(0)

  useEffect(() => {
    renderStartTime.current = performance.now()
  })

  useEffect(() => {
    const renderDuration = performance.now() - renderStartTime.current
    
    if (renderDuration > threshold) {
      console.warn(
        `[Performance] ${componentName} took ${renderDuration.toFixed(2)}ms to render (threshold: ${threshold}ms)`
      )
    }
  })
}

/**
 * Hook to track component mount/unmount
 */
export function useComponentLifecycle(componentName: string, debug: boolean = false) {
  useEffect(() => {
    if (debug) {
      console.log(`[Lifecycle] ${componentName} mounted`)
    }
    
    return () => {
      if (debug) {
        console.log(`[Lifecycle] ${componentName} unmounted`)
      }
    }
  }, [componentName, debug])
}
