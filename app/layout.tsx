import type React from "react"
import type { Metadata } from "next"
import { PomodoroProvider } from "@/lib/pomodoro-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sakukoro Pomodoro",
  description: "A cute Pomodoro timer app to boost your productivity",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <PomodoroProvider>{children}</PomodoroProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
