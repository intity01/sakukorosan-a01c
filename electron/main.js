const { app, BrowserWindow, Menu, ipcMain, Tray, Notification, globalShortcut, nativeImage } = require('electron')
const path = require('path')
const AutoLaunch = require('auto-launch')
const rateLimiter = require('./rate-limiter')

let mainWindow
let tray = null
let timerState = {
  isRunning: false,
  timeLeft: 1500, // 25 minutes in seconds
  mode: 'focus'
}
let colorTheme = 'blue' // Current color theme
let minimizeToTray = false // Default: false (close to quit)
let windowSize = 'normal' // 'compact' | 'normal' | 'large'
// Check if running in development mode
const isDev = process.env.ELECTRON_START_URL || process.env.NODE_ENV === 'development' || !app.isPackaged

// Window size presets
const windowSizes = {
  compact: { width: 350, height: 550 },
  normal: { width: 400, height: 600 },
  large: { width: 450, height: 650 }
}

// Validation helpers
function sanitizeText(text, maxLength = 200) {
  if (!text || typeof text !== 'string') return ''
  let sanitized = text.replace(/<[^>]*>/g, '')
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.trim()
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength) + '...'
  }
  return sanitized
}

function validateColorTheme(theme) {
  return ['blue', 'green', 'purple', 'pink', 'orange'].includes(theme)
}

function validateWindowSize(size) {
  return ['compact', 'normal', 'large'].includes(size)
}

function validateTimerState(state) {
  if (!state || typeof state !== 'object') return false
  if (typeof state.isRunning !== 'boolean') return false
  if (typeof state.timeLeft !== 'number' || state.timeLeft < 0 || state.timeLeft > 7200) return false
  if (!['focus', 'shortBreak', 'longBreak'].includes(state.mode)) return false
  return true
}

// Auto launch setup - initialized after app is ready
let autoLauncher = null

function initAutoLauncher() {
  if (autoLauncher) return autoLauncher

  try {
    const appPath = app.getPath('exe')
    // Basic path validation
    if (!appPath || typeof appPath !== 'string') {
      console.error('Invalid application path for auto-launch')
      return null
    }
    // Check if path looks suspicious
    if (appPath.includes('..') || appPath.includes('<') || appPath.includes('>')) {
      console.error('Suspicious application path detected')
      return null
    }

    autoLauncher = new AutoLaunch({
      name: 'Sakukoro Pomodoro',
      path: appPath,
    })
    return autoLauncher
  } catch (error) {
    console.error('Error initializing auto-launcher:', error)
    return null
  }
}

function createWindow() {
  const size = windowSizes[windowSize] || windowSizes.normal

  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    center: true,
    backgroundColor: '#fef6f3',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      // Enable dev tools only in development
      devTools: isDev,
      // Additional security settings
      enableRemoteModule: false,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      webSecurity: true,
      // Disable navigation
      navigateOnDragDrop: false
    },
    icon: path.join(__dirname, '../public/sakudoko-icon.png')
  })

  // Set App User Model ID for Windows notifications
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.sakukoro.pomodoro')
  }

  // Remove menu bar
  Menu.setApplicationMenu(null)

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../out/index.html')}`

  // Set security headers BEFORE loading URL
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const csp = isDev
      ? [
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          "font-src 'self' https://fonts.gstatic.com data:; " +
          "img-src 'self' data: https: blob:; " +
          "connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:*; " +
          "media-src 'self' data: blob:; " +
          "frame-src 'none'; " +
          "object-src 'none'; " +
          "base-uri 'self';"
        ]
      : [
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "font-src 'self' data:; " +
          "img-src 'self' data: blob:; " +
          "media-src 'self' data: blob:; " +
          "frame-src 'none'; " +
          "object-src 'none'; " +
          "base-uri 'self';"
        ]

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': csp,
        'X-Content-Type-Options': ['nosniff'],
        'X-Frame-Options': ['DENY'],
        'X-XSS-Protection': ['1; mode=block'],
        'Referrer-Policy': ['no-referrer']
      }
    })
  })

  // Add error handling for page load
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', validatedURL, errorCode, errorDescription)
  })

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully')
  })

  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('Render process gone:', details)
  })

  console.log('Loading URL:', startUrl)
  mainWindow.loadURL(startUrl)

  // Open DevTools in development (after a delay to not block rendering)
  if (isDev) {
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.openDevTools({ mode: 'detach' })
      }
    }, 2000)
  }

  // Only disable security warnings and DevTools prevention in production
  if (!isDev) {
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

    // Prevent DevTools from opening in production
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  // Disable right-click context menu
  mainWindow.webContents.on('context-menu', (e) => {
    e.preventDefault()
  })

  // Disable keyboard shortcuts (only in production for security)
  if (!isDev) {
    mainWindow.webContents.on('before-input-event', (event, input) => {
      // Disable F12
      if (input.key === 'F12') {
        event.preventDefault()
      }
      // Disable Ctrl+Shift+I (DevTools)
      if (input.control && input.shift && input.key === 'I') {
        event.preventDefault()
      }
      // Disable Ctrl+Shift+J (Console)
      if (input.control && input.shift && input.key === 'J') {
        event.preventDefault()
      }
      // Disable Ctrl+U (View Source)
      if (input.control && input.key === 'U') {
        event.preventDefault()
      }
    })
  }

  // CSP is already set above - removed duplicate

  // Prevent navigation to external URLs
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const parsedUrl = new URL(url)
    const validOrigins = ['localhost:3000', 'file://']

    if (!validOrigins.some(origin => url.includes(origin))) {
      event.preventDefault()
      console.log('Navigation blocked to:', url)
    }
  })

  // Prevent new window creation
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    // Destroy tray when window is closed
    if (tray && !tray.isDestroyed()) {
      tray.destroy()
      tray = null
    }
  })

  // Handle close event (minimize to tray if enabled)
  mainWindow.on('close', (event) => {
    if (minimizeToTray && !app.isQuitting) {
      event.preventDefault()
      mainWindow.hide()
      // Create tray when hiding
      if (!tray) {
        console.log('Creating tray on close...')
        createTray()
      }
    } else {
      // Destroy tray when actually quitting
      if (tray && !tray.isDestroyed()) {
        tray.destroy()
        tray = null
      }
    }
  })

  // Show tray when minimized (only if minimizeToTray is enabled)
  mainWindow.on('minimize', () => {
    if (minimizeToTray && !tray) {
      console.log('Creating tray on minimize...')
      createTray()
    }
  })

  // Hide tray when shown
  mainWindow.on('show', () => {
    if (tray && !tray.isDestroyed()) {
      tray.destroy()
      tray = null
    }
  })

  // Hide tray when restored from minimize
  mainWindow.on('restore', () => {
    if (tray && !tray.isDestroyed()) {
      tray.destroy()
      tray = null
    }
  })

  // Don't create tray on startup
  // createTray()
}

function createTray() {
  // Don't create if already exists
  if (tray && !tray.isDestroyed()) {
    console.log('⚠️ Tray already exists, skipping creation')
    return
  }

  console.log('🎯 Starting tray creation...')
  console.log('📂 __dirname:', __dirname)
  console.log('🔧 isDev:', isDev)

  // Handle icon path for both dev and production
  let iconPath
  if (isDev) {
    // In development, try multiple possible paths
    const possiblePaths = [
      path.join(__dirname, '../public/sakudoko-icon.png'),
      path.join(__dirname, '../../public/sakudoko-icon.png'),
      path.join(process.cwd(), 'public/sakudoko-icon.png')
    ]

    const fs = require('fs')
    iconPath = possiblePaths.find(p => fs.existsSync(p))

    if (!iconPath) {
      console.error('❌ Tray icon not found in any of these paths:')
      possiblePaths.forEach(p => console.error('  -', p))
    }
  } else {
    iconPath = path.join(process.resourcesPath, 'public/sakudoko-icon.png')
  }

  // Check if icon exists
  const fs = require('fs')
  if (!iconPath || !fs.existsSync(iconPath)) {
    console.error('❌ Tray icon not found at:', iconPath || '(no path)')
    console.error('⚠️ Creating tray with empty icon as fallback')
    const image = nativeImage.createEmpty()
    tray = new Tray(image)
  } else {
    console.log('✅ Tray icon found at:', iconPath)
    tray = new Tray(iconPath)
  }

  console.log('✅ Tray created successfully')

  updateTrayMenu()

  tray.setToolTip('Sakukoro Pomodoro - Click to restore')

  // Update tray title on macOS to show timer
  if (process.platform === 'darwin') {
    tray.setTitle('25:00')
  }

  // Click to show/restore window
  tray.on('click', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      } else {
        mainWindow.show()
      }
      mainWindow.focus()
      // Destroy tray after showing window
      if (tray && !tray.isDestroyed()) {
        tray.destroy()
        tray = null
      }
    }
  })

  // Double click also shows window
  tray.on('double-click', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      } else {
        mainWindow.show()
      }
      mainWindow.focus()
      // Destroy tray after showing window
      if (tray && !tray.isDestroyed()) {
        tray.destroy()
        tray = null
      }
    }
  })
}

function updateTrayMenu() {
  if (!tray) return

  const minutes = Math.floor(timerState.timeLeft / 60)
  const seconds = timerState.timeLeft % 60
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`

  const modeText = timerState.mode === 'focus' ? 'Focus' : timerState.mode === 'shortBreak' ? 'Short Break' : 'Long Break'
  const statusText = timerState.isRunning ? 'Running' : 'Paused'

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `${modeText} - ${timeDisplay} (${statusText})`,
      enabled: false
    },
    { type: 'separator' },
    {
      label: timerState.isRunning ? 'Pause' : 'Start',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('tray-toggle-timer')
        }
      }
    },
    {
      label: 'Reset',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('tray-reset-timer')
        }
      }
    },
    {
      label: 'Skip',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('tray-skip-timer')
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Show Window',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          if (mainWindow.isMinimized()) {
            mainWindow.restore()
          } else {
            mainWindow.show()
          }
          mainWindow.focus()
          // Destroy tray after showing window
          if (tray && !tray.isDestroyed()) {
            tray.destroy()
            tray = null
          }
        }
      }
    },
    {
      label: 'Hide Window',
      click: () => {
        if (mainWindow) {
          mainWindow.hide()
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)
}


// IPC handlers
ipcMain.on('minimize-window', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.minimize()
  }
})

ipcMain.on('hide-window', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    // Prevent flickering by setting opacity to 0 before hiding
    mainWindow.setOpacity(0)

    // Use setImmediate to ensure opacity change is processed first
    setImmediate(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.hide()
        // Restore opacity for when window is shown again
        mainWindow.setOpacity(1)
      }
    })
  }
})

ipcMain.on('close-window', () => {
  if (mainWindow) {
    mainWindow.close()
  }
})

// Update color theme
ipcMain.on('update-color-theme', (event, theme) => {
  // Rate limiting
  if (!rateLimiter.check('update-color-theme')) {
    console.warn('Rate limit exceeded for update-color-theme')
    return
  }

  // Validate theme
  if (!validateColorTheme(theme)) {
    console.warn('Invalid color theme:', theme)
    return
  }

  colorTheme = theme
  updateTrayMenu()
  console.log('Color theme updated:', theme)
})

// Native notification handler with taskbar icon animation
ipcMain.on('show-notification', (event, { title, body, icon }) => {
  // Rate limiting
  if (!rateLimiter.check('show-notification')) {
    console.warn('Rate limit exceeded for show-notification')
    return
  }

  // Sanitize inputs
  const sanitizedTitle = sanitizeText(title || 'Sakukoro Pomodoro', 100)
  const sanitizedBody = sanitizeText(body || '', 200)

  if (Notification.isSupported()) {
    try {
      const notification = new Notification({
        title: sanitizedTitle,
        body: sanitizedBody,
        icon: path.join(__dirname, '../public/sakudoko-icon.png'),
        silent: false,
        timeoutType: 'default',
        urgency: 'normal'
      })

      notification.show()

      // Flash/bounce taskbar icon to grab attention
      if (mainWindow) {
        // Flash the window frame (works on Windows and Linux)
        mainWindow.flashFrame(true)

        // Stop flashing after 3 seconds
        setTimeout(() => {
          if (mainWindow) {
            mainWindow.flashFrame(false)
          }
        }, 3000)

        // On macOS, bounce the dock icon
        if (process.platform === 'darwin') {
          app.dock.bounce('informational')
        }
      }

      // Flash tray icon as well
      if (tray) {
        let flashCount = 0
        const flashInterval = setInterval(() => {
          if (flashCount >= 6) {
            clearInterval(flashInterval)
            tray.setImage(path.join(__dirname, '../public/sakudoko-icon.png'))
            return
          }
          // Alternate between visible and hidden
          if (flashCount % 2 === 0) {
            tray.setImage(path.join(__dirname, '../public/sakudoko-icon.png'))
          } else {
            // Create a small transparent icon or use empty
            tray.setImage(require('electron').nativeImage.createEmpty())
          }
          flashCount++
        }, 500)
      }

      // Click to show window - prevent flickering by checking state first
      notification.on('click', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          // Stop flashing first
          mainWindow.flashFrame(false)

          // Only restore if minimized
          if (mainWindow.isMinimized()) {
            mainWindow.restore()
          }
          // Only show if not visible (don't call if already visible)
          else if (!mainWindow.isVisible()) {
            mainWindow.show()
          }
          // Always focus regardless of state
          mainWindow.focus()
        }
      })

      // Log for debugging
      console.log('Notification shown:', title, body)
    } catch (error) {
      console.error('Notification error:', error)
    }
  } else {
    console.log('Notifications not supported on this system')
  }
})

// Set taskbar status (progress bar and overlay)
ipcMain.on('set-taskbar-status', (event, status) => {
  // Rate limiting
  if (!rateLimiter.check('set-taskbar-status')) {
    return
  }

  if (!mainWindow) return

  try {
    // status can be: 'focus', 'break', 'idle', 'completed'
    // or an object with { mode: 'focus', progress: 0.5 }

    if (typeof status === 'string') {
      switch (status) {
        case 'focus':
          // Red/orange for focus mode
          if (process.platform === 'win32') {
            mainWindow.setProgressBar(2, { mode: 'indeterminate' }) // Pulsing animation
          }
          if (tray) {
            tray.setToolTip('🍅 Sakukoro Pomodoro - Focus Time')
          }
          break

        case 'break':
          // Green for break mode
          if (process.platform === 'win32') {
            mainWindow.setProgressBar(2, { mode: 'paused' }) // Yellow/paused state
          }
          if (tray) {
            tray.setToolTip('☕ Sakukoro Pomodoro - Break Time')
          }
          break

        case 'completed':
          // Flash briefly then reset
          if (process.platform === 'win32') {
            mainWindow.setProgressBar(1, { mode: 'normal' }) // Full progress
            setTimeout(() => {
              mainWindow.setProgressBar(-1) // Clear
            }, 2000)
          }
          if (tray) {
            tray.setToolTip('✅ Sakukoro Pomodoro - Completed!')
          }
          break

        case 'idle':
        default:
          // Clear progress bar
          if (process.platform === 'win32') {
            mainWindow.setProgressBar(-1)
          }
          if (tray) {
            tray.setToolTip('Sakukoro Pomodoro')
          }
          break
      }
    } else if (typeof status === 'object' && status.progress !== undefined) {
      // Set specific progress (0.0 to 1.0)
      if (process.platform === 'win32') {
        mainWindow.setProgressBar(status.progress, { mode: status.mode || 'normal' })
      }

      // Update tray tooltip with percentage
      if (tray) {
        const percent = Math.round(status.progress * 100)
        const emoji = status.timerMode === 'focus' ? '🍅' : '☕'
        tray.setToolTip(`${emoji} Sakukoro Pomodoro - ${percent}%`)
      }
    }

    console.log('Taskbar status updated:', status)
  } catch (error) {
    console.error('Error setting taskbar status:', error)
  }
})

// Update timer state from renderer
ipcMain.on('update-timer-state', (event, state) => {
  // Rate limiting
  if (!rateLimiter.check('update-timer-state')) {
    return
  }

  // Validate state
  if (!validateTimerState(state)) {
    console.warn('Invalid timer state received:', state)
    return
  }

  timerState = { ...timerState, ...state }
  updateTrayMenu()

  // Update tray title on macOS and Windows
  if (tray) {
    const minutes = Math.floor(timerState.timeLeft / 60)
    const seconds = timerState.timeLeft % 60
    const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`

    if (process.platform === 'darwin') {
      tray.setTitle(timeDisplay)
    }

    const modeEmoji = timerState.mode === 'focus' ? '🍅' : '☕'
    tray.setToolTip(`${modeEmoji} Sakukoro Pomodoro - ${timeDisplay}`)
  }
})

app.whenReady().then(() => {
  createWindow()

  // Register global shortcuts
  registerGlobalShortcuts()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // Don't quit on window close, keep in tray
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
})

app.on('before-quit', () => {
  app.isQuitting = true

  // Unregister all shortcuts
  globalShortcut.unregisterAll()

  // Cleanup tray
  if (tray && !tray.isDestroyed()) {
    tray.destroy()
    tray = null
  }
})

// Register global keyboard shortcuts
function registerGlobalShortcuts() {
  // Toggle timer (Start/Pause) - Ctrl+Shift+Space
  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    console.log('Global shortcut: Toggle timer')
    if (mainWindow) {
      mainWindow.webContents.send('global-shortcut', 'toggle-timer')
    }
  })

  // Show/Hide window - Ctrl+Shift+P
  globalShortcut.register('CommandOrControl+Shift+P', () => {
    console.log('Global shortcut: Toggle window visibility')
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        if (mainWindow.isMinimized()) {
          mainWindow.restore()
        } else {
          mainWindow.show()
        }
        mainWindow.focus()
      }
    }
  })

  // Reset timer - Ctrl+Shift+R
  globalShortcut.register('CommandOrControl+Shift+R', () => {
    console.log('Global shortcut: Reset timer')
    if (mainWindow) {
      mainWindow.webContents.send('global-shortcut', 'reset-timer')
    }
  })

  // Skip to next session - Ctrl+Shift+S
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    console.log('Global shortcut: Skip session')
    if (mainWindow) {
      mainWindow.webContents.send('global-shortcut', 'skip-timer')
    }
  })

  console.log('Global shortcuts registered successfully')
  console.log('  - Ctrl+Shift+Space: Toggle timer')
  console.log('  - Ctrl+Shift+P: Show/Hide window')
  console.log('  - Ctrl+Shift+R: Reset timer')
  console.log('  - Ctrl+Shift+S: Skip session')
}

// Auto-startup IPC handlers
ipcMain.handle('get-auto-launch-enabled', async () => {
  try {
    const launcher = initAutoLauncher()
    if (!launcher) return false
    const isEnabled = await launcher.isEnabled()
    return isEnabled
  } catch (error) {
    console.error('Error checking auto-launch status:', error)
    return false
  }
})

ipcMain.handle('set-auto-launch', async (event, enabled) => {
  try {
    const launcher = initAutoLauncher()
    if (!launcher) return false
    if (enabled) {
      await launcher.enable()
      console.log('Auto-launch enabled')
    } else {
      await launcher.disable()
      console.log('Auto-launch disabled')
    }
    return true
  } catch (error) {
    console.error('Error setting auto-launch:', error)
    return false
  }
})

// Always on top toggle
ipcMain.handle('get-always-on-top', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    return mainWindow.isAlwaysOnTop()
  }
  return true
})

ipcMain.handle('set-always-on-top', (event, enabled) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setAlwaysOnTop(enabled)
    console.log('Always on top:', enabled)
    return true
  }
  return false
})

// Minimize to tray toggle
ipcMain.handle('get-minimize-to-tray', () => {
  return minimizeToTray
})

ipcMain.handle('set-minimize-to-tray', (event, enabled) => {
  minimizeToTray = enabled
  console.log('Minimize to tray:', enabled)
  return true
})

// Window size
ipcMain.handle('get-window-size', () => {
  return windowSize
})

ipcMain.handle('set-window-size', (event, size) => {
  // Validate size
  if (!validateWindowSize(size)) {
    console.warn('Invalid window size:', size)
    return false
  }

  if (!windowSizes[size]) return false

  windowSize = size
  if (mainWindow && !mainWindow.isDestroyed()) {
    const newSize = windowSizes[size]
    mainWindow.setSize(newSize.width, newSize.height)
    mainWindow.center()
    console.log('Window size changed to:', size)
  }
  return true
})
