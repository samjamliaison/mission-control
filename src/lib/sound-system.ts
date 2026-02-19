"use client"

// Sound System using Web Audio API - no external files needed
class SoundSystem {
  private audioContext: AudioContext | null = null
  private enabled: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('mission-control-sounds') === 'true'
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    return this.audioContext
  }

  private async ensureAudioContext() {
    const ctx = this.getAudioContext()
    if (!ctx) return null

    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    return ctx
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) {
    return new Promise<void>(async (resolve) => {
      if (!this.enabled) {
        resolve()
        return
      }

      const ctx = await this.ensureAudioContext()
      if (!ctx) {
        resolve()
        return
      }

      try {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.frequency.value = frequency
        oscillator.type = type

        // Envelope for smooth attack and release
        const now = ctx.currentTime
        gainNode.gain.setValueAtTime(0, now)
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.01) // Attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration) // Release

        oscillator.start(now)
        oscillator.stop(now + duration)

        oscillator.onended = () => resolve()
      } catch (error) {
        console.warn('Sound creation failed:', error)
        resolve()
      }
    })
  }

  private createChord(frequencies: number[], duration: number, volume: number = 0.06) {
    return Promise.all(
      frequencies.map(freq => this.createTone(freq, duration, 'sine', volume))
    )
  }

  // Notification sounds
  async playNotificationPing() {
    // Pleasant two-tone ping: C6 -> G6
    await this.createTone(1046.5, 0.15, 'sine', 0.08) // C6
    await new Promise(resolve => setTimeout(resolve, 50))
    await this.createTone(1568, 0.2, 'sine', 0.06) // G6
  }

  async playTaskComplete() {
    // Success chord progression: C-E-G (major triad)
    await this.createChord([523.25, 659.25, 783.99], 0.3, 0.05) // C5-E5-G5
  }

  async playButtonClick() {
    // Subtle click sound
    await this.createTone(800, 0.1, 'square', 0.03)
  }

  async playError() {
    // Low warning tone
    await this.createTone(220, 0.4, 'sawtooth', 0.04) // A3
  }

  async playSuccess() {
    // Ascending success tones
    await this.createTone(523.25, 0.15, 'sine', 0.05) // C5
    await new Promise(resolve => setTimeout(resolve, 80))
    await this.createTone(659.25, 0.15, 'sine', 0.05) // E5
    await new Promise(resolve => setTimeout(resolve, 80))
    await this.createTone(783.99, 0.2, 'sine', 0.05) // G5
  }

  async playDelete() {
    // Descending delete sound
    await this.createTone(440, 0.1, 'triangle', 0.04) // A4
    await new Promise(resolve => setTimeout(resolve, 50))
    await this.createTone(330, 0.15, 'triangle', 0.03) // E4
  }

  async playHover() {
    // Very subtle hover sound
    await this.createTone(1000, 0.05, 'sine', 0.02)
  }

  async playToggle() {
    // Toggle switch sound
    await this.createTone(600, 0.08, 'square', 0.03)
  }

  // Settings
  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('mission-control-sounds', enabled.toString())
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }

  // Test sound
  async playTestSound() {
    await this.playNotificationPing()
    await new Promise(resolve => setTimeout(resolve, 300))
    await this.playTaskComplete()
  }
}

// Export singleton instance
export const soundSystem = new SoundSystem()

// React hook for managing sound preferences
import { useState, useEffect } from 'react'

export function useSoundSettings() {
  const [soundEnabled, setSoundEnabled] = useState(false)

  useEffect(() => {
    setSoundEnabled(soundSystem.isEnabled())
  }, [])

  const toggleSound = () => {
    const newEnabled = !soundEnabled
    setSoundEnabled(newEnabled)
    soundSystem.setEnabled(newEnabled)
    
    if (newEnabled) {
      soundSystem.playTestSound()
    }
  }

  return {
    soundEnabled,
    toggleSound,
    playNotificationPing: () => soundSystem.playNotificationPing(),
    playTaskComplete: () => soundSystem.playTaskComplete(),
    playButtonClick: () => soundSystem.playButtonClick(),
    playError: () => soundSystem.playError(),
    playSuccess: () => soundSystem.playSuccess(),
    playDelete: () => soundSystem.playDelete(),
    playHover: () => soundSystem.playHover(),
    playToggle: () => soundSystem.playToggle()
  }
}