"use client"

import Image from "next/image"
import { SettingsDialog } from "./settings-dialog"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AboutDialog } from "./about-dialog"

export function AppHeader() {
  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 relative">
            <Image src="/sakukoro-logo.png" alt="Sakukoro mascot" width={48} height={48} className="object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground leading-none tracking-tight">SAKUKORO</h1>
            <p className="text-sm font-bold text-primary leading-none mt-0.5 tracking-tight">POMODORO</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10"
            onClick={() => setShowAbout(true)}
          >
            <Info className="w-5 h-5 text-muted-foreground" />
          </Button>
          <SettingsDialog />
        </div>
      </div>
      <AboutDialog open={showAbout} onOpenChange={setShowAbout} />
    </>
  )
}
