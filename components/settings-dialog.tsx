"use client"

import type { ChangeEvent } from "react"
import { usePomodoro } from "@/lib/pomodoro-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Settings as SettingsType } from "@/lib/types"

export function SettingsDialog() {
  const { settings, updateSettings } = usePomodoro()
  type NumericSettingKey = "focusDuration" | "shortBreakDuration" | "longBreakDuration" | "dailyGoal"

  const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

  const handleNumericChange = (min: number, max: number, key: NumericSettingKey) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value, 10)
      if (Number.isNaN(value)) return
      const clamped = clampNumber(value, min, max)
      updateSettings({ [key]: clamped } as Partial<SettingsType>)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Timer Duration</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="focus-duration" className="text-sm font-medium">
                  Focus (minutes)
                </Label>
                <Input
                  id="focus-duration"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.focusDuration}
                  onChange={handleNumericChange(1, 60, "focusDuration")}
                  className="w-20 text-center"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="short-break" className="text-sm font-medium">
                  Short Break (minutes)
                </Label>
                <Input
                  id="short-break"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreakDuration}
                  onChange={handleNumericChange(1, 30, "shortBreakDuration")}
                  className="w-20 text-center"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="long-break" className="text-sm font-medium">
                  Long Break (minutes)
                </Label>
                <Input
                  id="long-break"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakDuration}
                  onChange={handleNumericChange(1, 60, "longBreakDuration")}
                  className="w-20 text-center"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Goals</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-goal" className="text-sm font-medium">
                Daily Pomodoro Goal
              </Label>
              <Input
                id="daily-goal"
                type="number"
                min="1"
                max="20"
                value={settings.dailyGoal}
                onChange={handleNumericChange(1, 20, "dailyGoal")}
                className="w-20 text-center"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Notifications</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound" className="text-sm font-medium">
                Sound Alerts
              </Label>
              <Switch
                id="sound"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-sm font-medium">
                Browser Notifications
              </Label>
              <Switch
                id="notifications"
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Appearance</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-sm font-medium">
                Dark Mode
              </Label>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Accessibility</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="screen-reader" className="text-sm font-medium">
                    Screen Reader Announcements
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Announce timer events for screen readers
                  </p>
                </div>
                <Switch
                  id="screen-reader"
                  checked={settings.screenReaderEnabled ?? true}
                  onCheckedChange={(checked) => updateSettings({ screenReaderEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="keyboard-shortcuts" className="text-sm font-medium">
                    Keyboard Shortcuts
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Space: Play/Pause • R: Reset<br />
                    1-4: Switch Screens • ←→: Navigate
                  </p>
                </div>
                <Switch
                  id="keyboard-shortcuts"
                  checked={settings.keyboardShortcutsEnabled ?? true}
                  onCheckedChange={(checked) => updateSettings({ keyboardShortcutsEnabled: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
