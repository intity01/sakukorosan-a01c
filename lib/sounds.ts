// Sound manager for Pomodoro app

export type SoundType = 'start' | 'pause' | 'reset' | 'complete' | 'tick'
export type SoundTheme = 'bell' | 'digital' | 'kitchen' | 'bird'

class SoundManager {
  private audioContext: AudioContext | null = null
  private volume: number = 0.7
  private enabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume / 100))
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  // Simple beep sounds using Web Audio API
  private playBeep(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  // Play different sounds based on action
  play(soundType: SoundType, theme: SoundTheme = 'bell') {
    switch (soundType) {
      case 'start':
        // Ascending beep
        this.playBeep(523.25, 0.1) // C5
        setTimeout(() => this.playBeep(659.25, 0.15), 100) // E5
        break

      case 'pause':
        // Descending beep
        this.playBeep(659.25, 0.1) // E5
        setTimeout(() => this.playBeep(523.25, 0.15), 100) // C5
        break

      case 'reset':
        // Quick low beep
        this.playBeep(392.00, 0.15) // G4
        break

      case 'complete':
        // Victory sound - ascending chord
        this.playBeep(523.25, 0.2) // C5
        setTimeout(() => this.playBeep(659.25, 0.2), 100) // E5
        setTimeout(() => this.playBeep(783.99, 0.3), 200) // G5
        break

      case 'tick':
        // Subtle tick
        this.playBeep(1000, 0.02, 'square')
        break
    }
  }

  // Play notification sound
  playNotification() {
    this.play('complete')
  }
}

export const soundManager = new SoundManager()
