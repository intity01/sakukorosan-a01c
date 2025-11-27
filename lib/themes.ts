// Color theme utilities for Pomodoro app

export type ColorTheme = 'blue' | 'green' | 'purple' | 'pink' | 'orange'

export interface ThemeColors {
  primary: string
  primaryForeground: string
  accent: string
  ring: string
}

export const colorThemes: Record<ColorTheme, ThemeColors> = {
  blue: {
    primary: 'hsl(221, 83%, 53%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    accent: 'hsl(210, 100%, 50%)',
    ring: 'hsl(221, 83%, 53%)',
  },
  green: {
    primary: 'hsl(142, 71%, 45%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    accent: 'hsl(160, 84%, 39%)',
    ring: 'hsl(142, 71%, 45%)',
  },
  purple: {
    primary: 'hsl(262, 83%, 58%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    accent: 'hsl(280, 100%, 70%)',
    ring: 'hsl(262, 83%, 58%)',
  },
  pink: {
    primary: 'hsl(330, 81%, 60%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    accent: 'hsl(340, 82%, 52%)',
    ring: 'hsl(330, 81%, 60%)',
  },
  orange: {
    primary: 'hsl(24, 95%, 53%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    accent: 'hsl(33, 100%, 50%)',
    ring: 'hsl(24, 95%, 53%)',
  },
}

export function applyColorTheme(theme: ColorTheme) {
  const colors = colorThemes[theme]
  const root = document.documentElement

  root.style.setProperty('--primary', colors.primary)
  root.style.setProperty('--primary-foreground', colors.primaryForeground)
  root.style.setProperty('--accent', colors.accent)
  root.style.setProperty('--ring', colors.ring)
}

export function getThemeIcon(theme: ColorTheme): string {
  const icons: Record<ColorTheme, string> = {
    blue: '💙',
    green: '💚',
    purple: '💜',
    pink: '💗',
    orange: '🧡',
  }
  return icons[theme]
}
