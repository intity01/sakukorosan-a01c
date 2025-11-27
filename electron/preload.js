const { contextBridge, ipcRenderer } = require('electron')

console.log('Preload script loaded!')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Window controls
  closeWindow: () => ipcRenderer.send('close-window'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  hideWindow: () => ipcRenderer.send('hide-window'),

  // Taskbar status
  setTaskbarStatus: (status) => ipcRenderer.send('set-taskbar-status', status),

  // Notifications
  showNotification: (title, body, icon) => {
    ipcRenderer.send('show-notification', { title, body, icon })
  },

  // Timer state sync
  updateTimerState: (state) => ipcRenderer.send('update-timer-state', state),

  // Color theme
  updateColorTheme: (theme) => ipcRenderer.send('update-color-theme', theme),

  // Tray actions listener
  onTrayAction: (callback) => {
    ipcRenderer.on('tray-toggle-timer', () => callback('toggle'))
    ipcRenderer.on('tray-reset-timer', () => callback('reset'))
    ipcRenderer.on('tray-skip-timer', () => callback('skip'))
  },

  // Global shortcuts listener
  onGlobalShortcut: (callback) => {
    ipcRenderer.on('global-shortcut', (event, action) => callback(action))
  },

  // About dialog listener
  onOpenAboutDialog: (callback) => {
    ipcRenderer.on('open-about-dialog', () => callback())
  },

  // Auto launch
  getAutoLaunchEnabled: () => ipcRenderer.invoke('get-auto-launch-enabled'),
  setAutoLaunch: (enabled) => ipcRenderer.invoke('set-auto-launch', enabled),

  // Always on top
  getAlwaysOnTop: () => ipcRenderer.invoke('get-always-on-top'),
  setAlwaysOnTop: (enabled) => ipcRenderer.invoke('set-always-on-top', enabled),

  // Minimize to tray
  getMinimizeToTray: () => ipcRenderer.invoke('get-minimize-to-tray'),
  setMinimizeToTray: (enabled) => ipcRenderer.invoke('set-minimize-to-tray', enabled),

  // Window size
  getWindowSize: () => ipcRenderer.invoke('get-window-size'),
  setWindowSize: (size) => ipcRenderer.invoke('set-window-size', size)
})
