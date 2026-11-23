import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { gsap, isLowPowerDevice, useReducedMotion } from '../lib/motion'
import './Flashlight.css'

export type FlashlightProps = {
  /** Layer shown everywhere: the dark room. */
  cover: ReactNode
  /** Layer revealed under the beam. Keep it aligned with `cover`. */
  children: ReactNode
  /** Beam radius in px (desktop). */
  radius?: number
  /** Share of the radius that stays fully lit, 0–1. Lower = softer falloff. */
  core?: number
  /** Ambient glow strength, 0–1. Switched off on low-power devices. */
  glow?: number
  /** Beam easing toward the pointer, 0–1 (1 = snap). */
  follow?: number
  /** Where the beam rests before the visitor moves it, in % of the stage. */
  rest?: { x: number; y: number }
  /** Slow idle drift so first-time visitors see the effect. */
  idleDrift?: boolean
  className?: string
  /** Accessible name for the "lights on" toggle. */
  toggleLabel?: [on: string, off: string]
}

/**
 * Torchlight reveal. The revealed layer is masked with a radial gradient whose
 * centre is driven by CSS custom properties. Pointer movement is sampled into a
 * ref and applied in a requestAnimationFrame loop, so React never re-renders
 * while the beam moves.
 */
export function Flashlight({
  cover,
  children,
  radius = 240,
  core = 0.38,
  glow = 0.55,
  follow = 0.16,
  rest = { x: 34, y: 46 },
  idleDrift = true,
  className = '',
  toggleLabel = ['Turn the lights on', 'Turn the lights off'],
}: FlashlightProps) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [lit, setLit] = useState(false)
  const [lowPower] = useState(isLowPowerDevice)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const ease = reduced ? 1 : follow
    const pos = { x: 0, y: 0 } // current beam centre (px)
    const target = { x: 0, y: 0 } // where the pointer is
    let scale = 1 // beam size multiplier (touch beams are a bit wider)
    let raf = 0
    let interacted = false
    let rect = el.getBoundingClientRect()

    const write = () => {
      el.style.setProperty('--fx', `${pos.x.toFixed(1)}px`)
      el.style.setProperty('--fy', `${pos.y.toFixed(1)}px`)
      el.style.setProperty('--fr', `${(radius * scale).toFixed(1)}px`)
    }

    const tick = () => {
      const dx = target.x - pos.x
      const dy = target.y - pos.y
      pos.x += dx * ease
      pos.y += dy * ease
      write()
      raf = Math.abs(dx) + Math.abs(dy) > 0.4 ? requestAnimationFrame(tick) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const placeAtRest = () => {
      rect = el.getBoundingClientRect()
      target.x = pos.x = (rest.x / 100) * rect.width
      target.y = pos.y = (rest.y / 100) * rect.height
      scale = rect.width < 700 ? 0.72 : 1
      write()
    }
    placeAtRest()

    // A slow figure-eight before the first interaction, to show what's there.
    let drift: gsap.core.Tween | null = null
    if (idleDrift && !reduced) {
      const d = { t: 0 }
      drift = gsap.to(d, {
        t: Math.PI * 2,
        duration: 11,
        ease: 'none',
        repeat: -1,
        onUpdate: () => {
          if (interacted) return
          target.x = rect.width * (rest.x / 100 + 0.16 * Math.sin(d.t))
          target.y = rect.height * (rest.y / 100 + 0.1 * Math.sin(d.t * 2))
          kick()
        },
      })
    }

    const onMove = (e: PointerEvent) => {
      interacted = true
      drift?.kill()
      rect = el.getBoundingClientRect()
      target.x = e.clientX - rect.left
      target.y = e.clientY - rect.top
      scale = e.pointerType === 'touch' ? 0.85 : rect.width < 700 ? 0.72 : 1
      el.dataset.active = 'true'
      kick()
    }
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') el.dataset.active = 'false'
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerdown', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave, { passive: true })
    const ro = new ResizeObserver(() => {
      if (!interacted) placeAtRest()
      else rect = el.getBoundingClientRect()
    })
    ro.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      drift?.kill()
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerdown', onMove)
      el.removeEventListener('pointerleave', onLeave)
      ro.disconnect()
    }
  }, [radius, follow, rest.x, rest.y, idleDrift, reduced])

  return (
    <div
      ref={root}
      className={`torch ${lit ? 'is-lit' : ''} ${lowPower ? 'is-low' : ''} ${className}`}
      style={{ ['--fcore' as string]: `${core * 100}%`, ['--fglow' as string]: lowPower ? 0 : glow }}
    >
      <div className="torch__cover" aria-hidden="true">
        {cover}
      </div>
      <div className="torch__reveal">{children}</div>
      <div className="torch__glow" aria-hidden="true" />
      <motion.button
        type="button"
        className="torch__toggle mono"
        aria-pressed={lit}
        onClick={() => setLit((v) => !v)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
      >
        <span className="torch__toggle-dot" aria-hidden="true" />
        {lit ? toggleLabel[1] : toggleLabel[0]}
      </motion.button>
    </div>
  )
}
