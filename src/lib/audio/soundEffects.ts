// Web Audio API Synthesizers for tactile stationery interaction
// Zero external audio dependency - completely local & instantaneous

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

export function triggerHaptic(duration: number | number[] = 25) {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      navigator.vibrate(duration)
    } catch {
      // Ignore haptic errors on unsupported devices
    }
  }
}

/**
 * 1. Wax Seal Crack / Soft Thud & Tick
 * Simulates breaking a botanical wax seal.
 */
export function playWaxSealCrackSound() {
  const ctx = getAudioContext()
  triggerHaptic(25)
  if (!ctx) return

  const now = ctx.currentTime

  // Soft low thud
  const osc = ctx.createOscillator()
  const oscGain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(200, now)
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.12)

  oscGain.gain.setValueAtTime(0.35, now)
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

  osc.connect(oscGain)
  oscGain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.13)

  // Subtle crackle noise burst
  const bufferSize = Math.floor(ctx.sampleRate * 0.07)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(1600, now)
  filter.Q.setValueAtTime(2.5, now)

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.3, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.07)

  noise.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(ctx.destination)

  noise.start(now)
  noise.stop(now + 0.075)
}

/**
 * 2. Paper Slide & Rustle Sound
 * Simulates textured heavy paper sliding out of an envelope pocket.
 */
export function playPaperSlideSound() {
  const ctx = getAudioContext()
  triggerHaptic([15, 20])
  if (!ctx) return

  const now = ctx.currentTime
  const duration = 0.42
  const bufferSize = Math.floor(ctx.sampleRate * duration)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(750, now)
  filter.frequency.exponentialRampToValueAtTime(2100, now + duration * 0.65)
  filter.frequency.exponentialRampToValueAtTime(550, now + duration)
  filter.Q.setValueAtTime(1.8, now)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.01, now)
  gain.gain.linearRampToValueAtTime(0.22, now + 0.09)
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  noise.start(now)
  noise.stop(now + duration)
}
