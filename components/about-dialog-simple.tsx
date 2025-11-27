"use client"

import { ChevronLeft, Heart, Github, Mail } from "lucide-react"

interface AboutDialogProps {
  isOpen: boolean
  onClose: () => void
  isDark: boolean
}

export function AboutDialog({ isOpen, onClose, isDark }: AboutDialogProps) {
  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-[100] transition-all duration-500 ${
        isDark ? 'bg-zinc-950 text-white' : 'bg-stone-50 text-zinc-900'
      }`}
    >
      <div className="h-full flex flex-col animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-4">
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-zinc-100'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold">About</h2>
          <div className="w-9" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-8">
          <div className="max-w-sm mx-auto space-y-6">
            {/* App Info with Logo */}
            <div className="text-center py-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-3xl overflow-hidden shadow-lg">
                <img
                  src="./sakudoko-icon.png"
                  alt="Sakudoko Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold mb-1">Sakudoko</h2>
              <p className={`text-sm ${isDark ? 'text-white/60' : 'text-zinc-600'}`}>
                Version 1.3.4
              </p>
            </div>

            {/* Description */}
            <p className={`text-sm text-center leading-relaxed ${isDark ? 'text-white/70' : 'text-zinc-700'}`}>
              A beautiful and minimalist Pomodoro timer to boost your productivity and focus.
            </p>

            {/* Features */}
            <div className={`p-5 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-zinc-100'}`}>
              <p className={`text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
                Features
              </p>
              <ul className={`text-sm space-y-2 ${isDark ? 'text-white/70' : 'text-zinc-700'}`}>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/40' : 'bg-zinc-400'}`} />
                  Clean & distraction-free interface
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/40' : 'bg-zinc-400'}`} />
                  Task management
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/40' : 'bg-zinc-400'}`} />
                  Dark/Light mode
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/40' : 'bg-zinc-400'}`} />
                  Keyboard shortcuts
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/40' : 'bg-zinc-400'}`} />
                  Privacy-focused (offline)
                </li>
              </ul>
            </div>

            {/* Developer */}
            <div className={`p-5 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-zinc-100'}`}>
              <p className={`text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
                Developer
              </p>
              <p className={`text-sm ${isDark ? 'text-white/70' : 'text-zinc-700'}`}>
                MAMIPOKODESE
              </p>
            </div>

            {/* Links */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <a
                href="https://github.com/intity01"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-xl transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-zinc-100 hover:bg-zinc-200'}`}
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:aoom5961@gmail.com"
                className={`p-3 rounded-xl transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-zinc-100 hover:bg-zinc-200'}`}
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            {/* Footer */}
            <p className={`text-xs text-center pt-4 ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>
              Made with <Heart className="w-3 h-3 inline text-red-500 mx-0.5" /> by MAMIPOKODESE
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
