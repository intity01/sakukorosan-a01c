"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { usePomodoro } from "@/lib/pomodoro-context"
import { applyColorTheme } from "@/lib/themes"
import {
  X, Settings2, Play, Pause, RotateCcw,
  CheckCircle2, Circle, Plus, Moon, Sun,
  ChevronLeft, ChevronRight, Sparkles, Coffee, Brain,
  Volume2, VolumeX, Rocket, Moon as MoonIcon, Pin, PinOff,
  Minimize2, Maximize2, Info, Keyboard
} from "lucide-react"
import { ConfettiEffect } from "@/components/confetti-effect"
import { AboutDialog } from "@/components/about-dialog-simple"

export default function Page() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const {
    settings, timeLeft, isRunning, setIsRunning,
    timerMode: mode, tasks, getTodayPomodoros,
    showConfetti, resetTimer, updateSettings, addTask,
    toggleTaskComplete, deleteTask, setTimerMode
  } = usePomodoro()

  useEffect(() => { setMounted(true) }, [])

  const completedPomodoros = getTodayPomodoros()
  const dailyGoal = settings.dailyGoal || 8
  const isDark = mounted ? resolvedTheme === 'dark' : false

  const toggleTimer = () => setIsRunning(!isRunning)
  const toggleDarkMode = () => setTheme(isDark ? 'light' : 'dark')
  const skipSession = () => setTimerMode(mode === 'focus' ? 'shortBreak' : 'focus')

  const [panel, setPanel] = useState<'none' | 'tasks' | 'settings'>('none')
  const [newTask, setNewTask] = useState('')
  const [showAddTask, setShowAddTask] = useState(false)

  useEffect(() => {
    if (settings.colorTheme) applyColorTheme(settings.colorTheme)
  }, [settings.colorTheme])

  // Sync Electron settings on mount
  useEffect(() => {
    const syncElectronSettings = async () => {
      try {
        // Sync auto-launch
        if (window.electron?.getAutoLaunchEnabled) {
          const isEnabled = await window.electron.getAutoLaunchEnabled()
          if (isEnabled !== settings.autoStartup) {
            updateSettings({ autoStartup: isEnabled })
          }
        }
        // Sync always on top
        if (window.electron?.getAlwaysOnTop) {
          const isOnTop = await window.electron.getAlwaysOnTop()
          if (isOnTop !== settings.alwaysOnTop) {
            updateSettings({ alwaysOnTop: isOnTop })
          }
        }
        // Sync minimize to tray
        if (window.electron?.getMinimizeToTray) {
          const minimizeToTray = await window.electron.getMinimizeToTray()
          if (minimizeToTray !== settings.minimizeToTray) {
            updateSettings({ minimizeToTray })
          }
        }
        // Sync window size
        if (window.electron?.getWindowSize) {
          const windowSize = await window.electron.getWindowSize()
          if (windowSize !== settings.windowSize) {
            updateSettings({ windowSize })
          }
        }
      } catch (e) {
        console.error('Failed to sync Electron settings:', e)
      }
    }
    syncElectronSettings()
  }, [])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const totalTime = mode === 'focus' ? settings.focusDuration * 60
    : mode === 'shortBreak' ? settings.shortBreakDuration * 60
    : settings.longBreakDuration * 60
  const progress = ((totalTime - timeLeft) / totalTime) * 100

  const handleClose = () => window.electron?.closeWindow?.() || window.close()
  const handleMinimize = () => window.electron?.minimizeWindow?.()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.code === 'Space') { e.preventDefault(); toggleTimer() }
      if (e.key === 'r') resetTimer()
      if (e.key === 's') skipSession()
      if (e.key === 'Escape') {
        setPanel('none')
        setShowAddTask(false)
      }
      if (e.key === 't') {
        setShowAddTask(!showAddTask)
        setPanel('none')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleTimer, resetTimer, panel, showAddTask])

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(newTask.trim(), { category: 'work', priority: 'medium', estimatedPomodoros: 1 })
      setNewTask('')
      setShowAddTask(false)
    }
  }

  const pendingTasks = tasks.filter(t => !t.completed)
  const doneTasks = tasks.filter(t => t.completed)

  // Colors based on mode
  const modeColors = {
    focus: { bg: 'from-amber-500 to-orange-600', text: 'text-amber-500', glow: 'shadow-amber-500/30' },
    shortBreak: { bg: 'from-emerald-400 to-teal-500', text: 'text-emerald-500', glow: 'shadow-emerald-500/30' },
    longBreak: { bg: 'from-blue-400 to-indigo-500', text: 'text-blue-500', glow: 'shadow-blue-500/30' }
  }
  const colors = modeColors[mode]

  return (
    <div className={`h-screen w-screen overflow-hidden transition-all duration-700 ${
      isDark ? 'bg-zinc-950' : 'bg-stone-50'
    }`}>

      {/* === DRAG AREA (invisible, behind header) === */}
      <div
        className="absolute top-0 left-0 right-0 h-12 z-40"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      />

      {/* === HEADER === */}
      <header className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-2 z-50">
        {/* Window Controls - Left */}
        <div className="flex items-center gap-0" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <button
            onClick={handleClose}
            className={`w-11 h-11 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors ${
              isDark ? 'text-white' : 'text-zinc-700'
            }`}
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={handleMinimize}
            className={`w-11 h-11 flex items-center justify-center transition-colors ${
              isDark ? 'text-white hover:bg-white/10' : 'text-zinc-700 hover:bg-black/5'
            }`}
            title="Minimize"
          >
            <svg width="12" height="2" viewBox="0 0 12 2" fill="currentColor">
              <rect width="12" height="2" />
            </svg>
          </button>
        </div>

        {/* Mode Indicator - Center */}
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-500 ${
            panel !== 'none' || showAddTask ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${isDark ? 'bg-white/5' : 'bg-black/5'}`}
        >
          {mode === 'focus' ? <Brain className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${colors.text}`}>
            {mode === 'focus' ? 'Deep Focus' : mode === 'shortBreak' ? 'Quick Break' : 'Long Rest'}
          </span>
        </div>

        {/* Actions - Right (hidden when settings is open) */}
        <div
          className={`flex items-center gap-1 transition-all duration-300 ${
            panel === 'settings' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          {/* Tasks Button */}
          <button
            onClick={() => setShowAddTask(true)}
            className={`p-2 rounded-xl transition-all duration-300 relative ${isDark ? 'text-white hover:bg-white/10' : 'text-zinc-700 hover:bg-zinc-100'}`}
            title="Tasks (T)"
          >
            <Sparkles className="w-4 h-4" />
            {pendingTasks.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {pendingTasks.length > 9 ? '9+' : pendingTasks.length}
              </span>
            )}
          </button>
          {/* Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl transition-all duration-300 ${isDark ? 'text-white hover:bg-white/10' : 'text-zinc-700 hover:bg-zinc-100'}`}
            title="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {/* Settings */}
          <button
            onClick={() => setPanel(panel === 'settings' ? 'none' : 'settings')}
            className={`p-2 rounded-xl transition-all duration-300 ${isDark ? 'text-white hover:bg-white/10' : 'text-zinc-700 hover:bg-zinc-100'}`}
            title="Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* === MAIN CONTENT === */}
      <main className="h-full flex pt-12">

        {/* Left Side - Timer */}
        <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-500 ${
          panel !== 'none' ? 'pr-80' : ''
        }`}>

          {/* Timer Container */}
          <div className="relative">

            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${
              isRunning ? 'opacity-30 scale-125' : 'opacity-0 scale-100'
            } bg-gradient-to-br ${colors.bg}`} />

            {/* Timer Circle */}
            <div className="relative">
              <svg className="w-72 h-72 -rotate-90" viewBox="0 0 100 100">
                {/* Track */}
                <circle
                  cx="50" cy="50" r="44"
                  fill="none"
                  strokeWidth="1"
                  className={isDark ? 'stroke-white/5' : 'stroke-black/5'}
                />
                {/* Progress */}
                <circle
                  cx="50" cy="50" r="44"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
                  className={`transition-all duration-1000 ease-out stroke-current ${colors.text}`}
                />
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-7xl font-thin tracking-tight tabular-nums ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}>
                  {mins.toString().padStart(2, '0')}
                  <span className={`mx-1 ${isRunning ? 'animate-pulse' : ''} opacity-30`}>:</span>
                  {secs.toString().padStart(2, '0')}
                </span>

                {/* Session Progress */}
                <div className="flex items-center gap-1.5 mt-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-1 rounded-full transition-all duration-500 ${
                        i < (completedPomodoros % 4)
                          ? `bg-gradient-to-r ${colors.bg}`
                          : isDark ? 'bg-white/10' : 'bg-black/10'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs mt-2 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                  {completedPomodoros} of {dailyGoal} today
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-8 relative z-10">
              <button
                onClick={resetTimer}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
                  isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                }`}
                title="Reset (R)"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={toggleTimer}
                className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer shadow-2xl ${
                  isRunning
                    ? isDark ? 'bg-white/15 text-white' : 'bg-zinc-300 text-zinc-800'
                    : `bg-gradient-to-br ${colors.bg} ${colors.glow} text-white`
                }`}
                title={isRunning ? "Pause (Space)" : "Play (Space)"}
              >
                {isRunning
                  ? <Pause className="w-8 h-8" />
                  : <Play className="w-8 h-8 ml-1" />
                }
              </button>

              <button
                onClick={skipSession}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
                  isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                }`}
                title="Skip (S)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>


        {/* Full Screen Settings Panel */}
        <div className={`fixed inset-0 transition-all duration-500 ease-out z-50 ${
          panel === 'settings' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } ${isDark ? 'bg-zinc-950 text-white' : 'bg-stone-50 text-zinc-900'}`}>

          {/* Settings Panel */}
          {panel === 'settings' && (
            <div className="h-full flex flex-col animate-in fade-in duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-6 pt-4">
                <button
                  onClick={() => setPanel('none')}
                  className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-zinc-100'}`}
                  style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold">Settings</h2>
                <div className="w-9" /> {/* Spacer for centering */}
              </div>

              {/* Scrollable content - no visible scrollbar */}
              <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-8">
                <div className="max-w-sm mx-auto space-y-6">
                {/* Timer Durations */}
                <div>
                  <p className={`text-xs uppercase tracking-wider mb-4 ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
                    Timer Duration
                  </p>
                  {[
                    { label: 'Focus', key: 'focusDuration', value: settings.focusDuration || 25 },
                    { label: 'Short Break', key: 'shortBreakDuration', value: settings.shortBreakDuration || 5 },
                    { label: 'Long Break', key: 'longBreakDuration', value: settings.longBreakDuration || 15 },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3">
                      <span className="text-sm">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateSettings({ [item.key]: Math.max(1, item.value - 5) })}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-zinc-100 hover:bg-zinc-200'
                          }`}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="w-14 text-center text-sm font-medium tabular-nums">{item.value}m</span>
                        <button
                          onClick={() => updateSettings({ [item.key]: Math.min(60, item.value + 5) })}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-zinc-100 hover:bg-zinc-200'
                          }`}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Daily Goal */}
                <div>
                  <p className={`text-xs uppercase tracking-wider mb-4 ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
                    Daily Goal
                  </p>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm">Sessions</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateSettings({ dailyGoal: Math.max(1, dailyGoal - 1) })}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-zinc-100 hover:bg-zinc-200'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="w-14 text-center text-sm font-medium tabular-nums">{dailyGoal}</span>
                      <button
                        onClick={() => updateSettings({ dailyGoal: Math.min(20, dailyGoal + 1) })}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-zinc-100 hover:bg-zinc-200'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sound Toggle */}
                <div>
                  <p className={`text-xs uppercase tracking-wider mb-4 ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
                    Sound
                  </p>
                  <button
                    onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                    className={`w-full p-4 rounded-2xl text-sm font-medium text-left transition-all duration-300 flex items-center gap-3 ${
                      settings.soundEnabled
                        ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                        : isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-zinc-100 hover:bg-zinc-200'
                    }`}
                  >
                    {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    {settings.soundEnabled ? 'Sound On' : 'Sound Off'}
                  </button>
                </div>

                {/* Desktop Settings */}
                <div>
                  <p className={`text-xs uppercase tracking-wider mb-4 ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
                    Desktop
                  </p>
                  <div className="space-y-3">
                    {/* Auto Start */}
                    <button
                      onClick={async () => {
                        if (window.electron?.setAutoLaunch) {
                          const newValue = !settings.autoStartup
                          const success = await window.electron.setAutoLaunch(newValue)
                          if (success) {
                            updateSettings({ autoStartup: newValue })
                          }
                        }
                      }}
                      className={`w-full p-4 rounded-2xl text-sm font-medium text-left transition-all duration-300 flex items-center gap-3 ${
                        settings.autoStartup
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                          : isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-zinc-100 hover:bg-zinc-200'
                      }`}
                    >
                      <Rocket className="w-4 h-4" />
                      {settings.autoStartup ? 'Start with Windows: On' : 'Start with Windows: Off'}
                    </button>

                    {/* Always on Top */}
                    <button
                      onClick={async () => {
                        if (window.electron?.setAlwaysOnTop) {
                          const current = await window.electron.getAlwaysOnTop?.() ?? true
                          await window.electron.setAlwaysOnTop(!current)
                          updateSettings({ alwaysOnTop: !current })
                        }
                      }}
                      className={`w-full p-4 rounded-2xl text-sm font-medium text-left transition-all duration-300 flex items-center gap-3 ${
                        settings.alwaysOnTop !== false
                          ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                          : isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-zinc-100 hover:bg-zinc-200'
                      }`}
                    >
                      {settings.alwaysOnTop !== false ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                      {settings.alwaysOnTop !== false ? 'Always on Top: On' : 'Always on Top: Off'}
                    </button>

                    {/* Minimize to Tray */}
                    <button
                      onClick={async () => {
                        if (window.electron?.setMinimizeToTray) {
                          const newValue = !settings.minimizeToTray
                          await window.electron.setMinimizeToTray(newValue)
                          updateSettings({ minimizeToTray: newValue })
                        }
                      }}
                      className={`w-full p-4 rounded-2xl text-sm font-medium text-left transition-all duration-300 flex items-center gap-3 ${
                        settings.minimizeToTray
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-zinc-100 hover:bg-zinc-200'
                      }`}
                    >
                      <Minimize2 className="w-4 h-4" />
                      {settings.minimizeToTray ? 'Minimize to Tray: On' : 'Minimize to Tray: Off'}
                    </button>
                  </div>
                </div>

                {/* Window Size */}
                <div>
                  <p className={`text-xs uppercase tracking-wider mb-4 ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
                    Window Size
                  </p>
                  <div className="flex gap-2">
                    {(['compact', 'normal', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={async () => {
                          if (window.electron?.setWindowSize) {
                            await window.electron.setWindowSize(size)
                            updateSettings({ windowSize: size })
                          }
                        }}
                        className={`flex-1 p-3 rounded-xl text-sm font-medium transition-all duration-300 capitalize ${
                          (settings.windowSize || 'normal') === size
                            ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                            : isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-zinc-100 hover:bg-zinc-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
                  <p className={`text-xs uppercase tracking-wider mb-4 ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
                    Keyboard Shortcuts
                  </p>
                  <div className={`p-4 rounded-2xl space-y-2 text-sm ${isDark ? 'bg-white/5' : 'bg-zinc-100'}`}>
                    <div className="flex justify-between"><span>Play/Pause</span><kbd className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`}>Space</kbd></div>
                    <div className="flex justify-between"><span>Reset Timer</span><kbd className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`}>R</kbd></div>
                    <div className="flex justify-between"><span>Skip Session</span><kbd className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`}>S</kbd></div>
                    <div className="flex justify-between"><span>Open Tasks</span><kbd className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`}>T</kbd></div>
                    <div className="flex justify-between"><span>Close Panel</span><kbd className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`}>Esc</kbd></div>
                    <div className={`pt-2 mt-2 border-t text-xs ${isDark ? 'border-white/10 text-white/40' : 'border-zinc-200 text-zinc-400'}`}>
                      <p className="font-medium mb-1">Global Shortcuts:</p>
                      <div className="flex justify-between"><span>Toggle Timer</span><span>Ctrl+Shift+Space</span></div>
                      <div className="flex justify-between"><span>Show/Hide</span><span>Ctrl+Shift+P</span></div>
                    </div>
                  </div>
                </div>

                {/* About Button */}
                <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
                  <button
                    onClick={() => setShowAbout(true)}
                    className={`w-full p-4 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                      isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-zinc-100 hover:bg-zinc-200'
                    }`}
                  >
                    <Info className="w-4 h-4" />
                    About Sakukoro Pomodoro
                  </button>
                </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Keyboard Hints */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-5 text-[10px] transition-all duration-500 ${
        panel !== 'none' || showAddTask ? 'opacity-0' : 'opacity-100'
      } ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>
        <span className="flex items-center gap-1.5"><kbd className={`px-2 py-1 rounded font-mono ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`}>Space</kbd> play</span>
        <span className="flex items-center gap-1.5"><kbd className={`px-2 py-1 rounded font-mono ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`}>R</kbd> reset</span>
        <span className="flex items-center gap-1.5"><kbd className={`px-2 py-1 rounded font-mono ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`}>T</kbd> tasks</span>
      </div>

      {/* Tasks Modal - Full Screen */}
      {showAddTask && (
        <div
          className={`fixed inset-0 z-50 transition-all duration-500 ${
            isDark ? 'bg-zinc-950 text-white' : 'bg-stone-50 text-zinc-900'
          }`}
        >
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-4">
              <button
                onClick={() => setShowAddTask(false)}
                className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-zinc-100'}`}
                style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold">Tasks</h2>
              <div className="w-9" /> {/* Spacer for centering */}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-8">
              <div className="max-w-sm mx-auto space-y-6">
                {/* Add Task Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    placeholder="Add a new task..."
                    className={`flex-1 px-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 ${
                      isDark
                        ? 'bg-white/10 focus:ring-white/20 placeholder:text-white/40'
                        : 'bg-zinc-100 focus:ring-zinc-300 placeholder:text-zinc-400'
                    }`}
                  />
                  <button
                    onClick={handleAddTask}
                    disabled={!newTask.trim()}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-orange-500 to-rose-500"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Task List */}
                <div className="space-y-2">
              {pendingTasks.length === 0 && doneTasks.length === 0 ? (
                <div className={`py-12 flex flex-col items-center justify-center ${isDark ? 'text-white/30' : 'text-zinc-400'}`}>
                  <Sparkles className="w-10 h-10 mb-3" />
                  <p className="text-sm">No tasks yet</p>
                  <p className="text-xs mt-1">Add one above to get started</p>
                </div>
              ) : (
                <>
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                        isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-zinc-100 hover:bg-zinc-200'
                      }`}
                    >
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                          isDark ? 'border-white/30 hover:border-emerald-400 hover:bg-emerald-400/20' : 'border-zinc-400 hover:border-emerald-500 hover:bg-emerald-500/20'
                        }`}
                      >
                        <Circle className="w-2 h-2 opacity-0 group-hover:opacity-50" />
                      </button>
                      <span className="flex-1 text-sm">{task.title}</span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 transition-all duration-300"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}

                  {doneTasks.length > 0 && (
                    <div className={`pt-4 mt-2 border-t ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
                      <p className={`text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>
                        Completed ({doneTasks.length})
                      </p>
                      {doneTasks.slice(0, 5).map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 opacity-50">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm line-through">{task.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confetti */}
      {settings.particleEffects && <ConfettiEffect show={showConfetti} />}

      {/* About Dialog */}
      <AboutDialog isOpen={showAbout} onClose={() => setShowAbout(false)} isDark={isDark} />
    </div>
  )
}
