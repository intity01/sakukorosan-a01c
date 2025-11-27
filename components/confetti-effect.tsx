"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  speed: number
  size: number
  delay: number
}

const COLORS = [
  "#ec4899", // pink
  "#a855f7", // purple
  "#3b82f6", // blue
  "#22c55e", // green
  "#eab308", // yellow
  "#ef4444", // red
  "#06b6d4", // cyan
  "#f97316", // orange
]

export function ConfettiEffect({ show }: { show: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!show) {
      setParticles([])
      return
    }

    // Generate particles
    const newParticles: Particle[] = []

    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 30,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        speed: 2 + Math.random() * 3,
        size: 6 + Math.floor(Math.random() * 8),
        delay: Math.random() * 0.5,
      })
    }

    setParticles(newParticles)

    // Clear after animation
    const timeout = setTimeout(() => {
      setParticles([])
    }, 4000)

    return () => clearTimeout(timeout)
  }, [show])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animation: `confetti-fall ${particle.speed}s linear forwards`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
