interface Window {
  electron?: {
    closeWindow: () => void
    minimizeWindow: () => void
    hideWindow: () => void
    setTaskbarStatus: (status: 'idle' | 'focus' | 'break' | 'completed' | { progress: number; mode?: 'normal' | 'paused' | 'indeterminate'; timerMode: string }) => void
    showNotification: (title: string, body: string, icon?: string) => void
    updateTimerState: (state: { isRunning: boolean; timeLeft: number; mode: string }) => void
    updateColorTheme: (theme: 'blue' | 'green' | 'purple' | 'pink') => void
    onTrayAction: (callback: (action: 'toggle' | 'reset' | 'skip') => void) => void
    onGlobalShortcut: (callback: (action: 'toggle-timer' | 'reset-timer' | 'skip-timer') => void) => void
    onOpenAboutDialog: (callback: () => void) => void
    getAutoLaunchEnabled: () => Promise<boolean>
    setAutoLaunch: (enabled: boolean) => Promise<boolean>
    getAlwaysOnTop: () => Promise<boolean>
    setAlwaysOnTop: (enabled: boolean) => Promise<boolean>
    getMinimizeToTray: () => Promise<boolean>
    setMinimizeToTray: (enabled: boolean) => Promise<boolean>
    getWindowSize: () => Promise<'compact' | 'normal' | 'large'>
    setWindowSize: (size: 'compact' | 'normal' | 'large') => Promise<boolean>
  }
}
