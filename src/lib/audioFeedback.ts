// Web Audio API Synthesizer & Haptic Feedback Controller
// Provides zero-dependency, guaranteed-available tactile audio for 3D unboxing interactions

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

export function triggerHaptic(pattern: number | number[] = [15, 30]) {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      navigator.vibrate(pattern)
    } catch {
      // Ignore vibration errors if not allowed
    }
  }
}

/**
 * 1. Wax Seal Crack & Pop
 * Simulates breaking a brittle botanical wax seal.
 */
export function playWaxCrackSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  triggerHaptic([20, 30, 15])

  const now = ctx.currentTime

  // A. Low thump pop
  const osc = ctx.createOscillator()
  const oscGain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(220, now)
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.12)

  oscGain.gain.setValueAtTime(0.35, now)
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

  osc.connect(oscGain)
  oscGain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.13)

  // B. Brittle crackle noise burst
  const bufferSize = Math.floor(ctx.sampleRate * 0.08)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25))
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(1800, now)
  filter.Q.setValueAtTime(3.0, now)

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.4, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)

  noise.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(ctx.destination)

  noise.start(now)
  noise.stop(now + 0.085)
}

/**
 * 2. Paper Rustle & Slide
 * Simulates thick textured paper sliding out of an envelope pocket.
 */
export function playPaperRustleSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  triggerHaptic([15, 20])

  const now = ctx.currentTime
  const duration = 0.45
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
  filter.frequency.setValueAtTime(800, now)
  filter.frequency.exponentialRampToValueAtTime(2200, now + duration * 0.7)
  filter.frequency.exponentialRampToValueAtTime(600, now + duration)
  filter.Q.setValueAtTime(1.5, now)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.01, now)
  gain.gain.linearRampToValueAtTime(0.2, now + 0.1)
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  noise.start(now)
  noise.stop(now + duration)
}

/**
 * 3. Crisp Paper Tear Sound
 * Granular noise pulse triggered during drag on perforated strip.
 */
let lastTearTime = 0
export function playTearSound(progress: number) {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  // Throttle tear sounds so they don't saturate audio pipeline
  if (now - lastTearTime < 0.04) return
  lastTearTime = now

  triggerHaptic([15, 15])

  const duration = 0.045
  const bufferSize = Math.floor(ctx.sampleRate * duration)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  // Pitch rises slightly as tear completes
  const freq = 1200 + progress * 1600
  filter.frequency.setValueAtTime(freq, now)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.25, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  noise.start(now)
  noise.stop(now + duration)
}

/**
 * 4. Crystalline Glass Chime & Friction
 * Crystalline harmonic chime for acrylic/frosted glass sleeve sliding and release.
 */
export function playGlassChimeSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  triggerHaptic([25, 40])

  const now = ctx.currentTime

  // Bell harmonics
  const frequencies = [1320, 2640, 3960]
  const gains = [0.25, 0.12, 0.05]

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 1.2)

    gain.gain.setValueAtTime(gains[idx], now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 1.25)
  })
}

/**
 * 5. Micro Glass Tick / Radial Crack Sound
 * Crisp, subtle crystalline tick on first tap.
 */
export function playGlassTickSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  triggerHaptic(20)

  const now = ctx.currentTime

  // Sharp high-pitch click
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(3600, now)
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.03)

  gain.gain.setValueAtTime(0.3, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.04)

  // Short crackle noise
  const bufferSize = Math.floor(ctx.sampleRate * 0.03)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2))
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.setValueAtTime(4000, now)

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.25, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

  noise.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(ctx.destination)

  noise.start(now)
  noise.stop(now + 0.035)
}

/**
 * 6. Full Crystalline Glass Shatter Sound
 * Dynamic explosive cascade of crystal shards & resonant dispersion.
 */
export function playGlassShatterSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  triggerHaptic([30, 50])

  const now = ctx.currentTime

  // High-frequency shimmering bell cluster
  const frequencies = [1760, 2480, 3520, 4980, 7040]
  const delays = [0, 0.015, 0.03, 0.05, 0.08]

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const startTime = now + delays[idx]

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, startTime)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.94, startTime + 1.2)

    gain.gain.setValueAtTime(0.2, startTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(startTime)
    osc.stop(startTime + 1.25)
  })

  // Explosive crack noise layer
  const bufferSize = Math.floor(ctx.sampleRate * 0.25)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(3200, now)
  filter.Q.setValueAtTime(1.8, now)

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.5, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

  noise.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(ctx.destination)

  noise.start(now)
  noise.stop(now + 0.26)
}
