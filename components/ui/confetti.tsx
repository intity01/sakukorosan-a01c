"use client"

import { useEffect, useState } from 'react'

interface ConfettiProps {
  active: boolean
  onComplete?: () => void
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; y: number; rotation: number; color: string; delay: number }>>([])

  useEffect(() => {
    if (active) {
      // Generate confetti pieces
      const newPieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -20,
        rotation: Math.random() * 360,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][Math.floor(Math.random() * 6)],
        delay: Math.random() * 0.5,
      }))
      setPieces(newPieces)

      // Clear after animation
      const timer = setTimeout(() => {
        setPieces([])
        onComplete?.()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [active, onComplete])

  if (!active || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-[confetti-fall_2s_ease-out_forwards]"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
