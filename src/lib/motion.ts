import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useSyncExternalStore } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }

const RM_QUERY = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(RM_QUERY).matches
}

function subscribeRM(cb: () => void) {
  const mq = window.matchMedia(RM_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

/** Reactive prefers-reduced-motion flag. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeRM, prefersReducedMotion, () => false)
}

/**
 * Rough low-power heuristic: few cores, little memory or a data-saver request.
 * Used to switch off the most expensive effects (animated grain, beam glow).
 */
export function isLowPowerDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  const cores = nav.hardwareConcurrency ?? 8
  const mem = nav.deviceMemory ?? 8
  return cores <= 4 || mem <= 4 || nav.connection?.saveData === true
}

/** Split a string into word spans for staggered reveals (kept accessible via aria-label on the parent). */
export function words(text: string): string[] {
  return text.split(' ')
}
