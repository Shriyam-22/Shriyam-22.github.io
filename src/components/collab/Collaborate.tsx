import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { gsap, useGSAP, ScrollTrigger, useReducedMotion } from '../../lib/motion'
import { HandArt, HandDefs } from './HandArt'
import { GRIP, HAND_PIVOT } from './handGeometry'
import { ContactOverlay } from './ContactOverlay'
import './Collaborate.css'

type Layout = {
  name: 'wide' | 'narrow'
  vb: [number, number]
  btn: { cx: number; cy: number; w: number; h: number }
  hand: { x: number; y: number; rot: number; s: number }
}

const LAYOUTS: Record<Layout['name'], Layout> = {
  wide: { name: 'wide', vb: [1200, 640], btn: { cx: 740, cy: 230, w: 440, h: 124 }, hand: { x: 330, y: 470, rot: 30, s: 1.25 } },
  narrow: { name: 'narrow', vb: [600, 780], btn: { cx: 330, cy: 220, w: 420, h: 116 }, hand: { x: 100, y: 590, rot: 30, s: 1.05 } },
}

const NARROW_Q = '(max-width: 700px)'
const subscribeNarrow = (cb: () => void) => {
  const mq = window.matchMedia(NARROW_Q)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
function useLayout(): Layout {
  const narrow = useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia(NARROW_Q).matches,
    () => false,
  )
  return narrow ? LAYOUTS.narrow : LAYOUTS.wide
}

/** Points on the pill's left cap (and one on its underside) where strings attach. */
function anchors(b: Layout['btn']) {
  const r = b.h / 2
  const cx = b.cx - b.w / 2 + r
  const pts = [128, 150, 172, 194, 216].map((deg) => {
    const a = (deg * Math.PI) / 180
    return { x: cx + Math.cos(a) * r, y: b.cy + Math.sin(a) * r }
  })
  pts.push({ x: cx + r * 0.7, y: b.cy + r })
  return pts
}

type Pull = { x: number; y: number; r: number }

function handMatrix(L: Layout, p: Pull) {
  const rot = ((L.hand.rot + p.r) * Math.PI) / 180
  const cos = Math.cos(rot)
  const sin = Math.sin(rot)
  const tx = L.hand.x + p.x
  const ty = L.hand.y + p.y
  const s = L.hand.s
  const apply = (pt: { x: number; y: number }) => {
    const lx = (pt.x - HAND_PIVOT.x) * s
    const ly = (pt.y - HAND_PIVOT.y) * s
    return { x: tx + lx * cos - ly * sin, y: ty + lx * sin + ly * cos }
  }
  const attr = `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) rotate(${(L.hand.rot + p.r).toFixed(2)}) scale(${s}) translate(${-HAND_PIVOT.x} ${-HAND_PIVOT.y})`
  return { apply, attr }
}

// Per-string personality, so no two strings move alike.
const SEEDS = [
  { sag: 16, amp: 3.2, sp: 0.9, ph: 0.0, wob: 3 },
  { sag: 22, amp: 4.1, sp: 0.75, ph: 1.3, wob: -4 },
  { sag: 12, amp: 2.6, sp: 1.05, ph: 2.1, wob: 5 },
  { sag: 26, amp: 4.6, sp: 0.68, ph: 3.4, wob: -2 },
  { sag: 18, amp: 3.4, sp: 0.95, ph: 4.2, wob: 6 },
  { sag: 30, amp: 5.0, sp: 0.6, ph: 5.0, wob: -5 },
]

function stringPath(A: { x: number; y: number }, B: { x: number; y: number }, i: number, t: number, tension: number, px: number) {
  const sd = SEEDS[i % SEEDS.length]
  const dx = B.x - A.x
  const dy = B.y - A.y
  const len = Math.hypot(dx, dy) || 1
  let nx = -dy / len
  let ny = dx / len
  if (ny < 0) {
    nx = -nx
    ny = -ny
  }
  const sway = Math.sin(t * sd.sp + sd.ph) * sd.amp + px * 7
  const sag = sd.sag * (1 - 0.75 * tension)
  const c1 = { x: A.x + dx * 0.33 + nx * (sag * 0.85 + sway), y: A.y + dy * 0.33 + ny * (sag * 0.85 + sway) }
  const c2 = {
    x: A.x + dx * 0.68 + nx * (sag * 0.7 - sway * 0.6 + sd.wob * (1 - tension)),
    y: A.y + dy * 0.68 + ny * (sag * 0.7 - sway * 0.6 + sd.wob * (1 - tension)),
  }
  const f = (n: number) => n.toFixed(2)
  return `M${f(A.x)} ${f(A.y)} C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(B.x)} ${f(B.y)}`
}

function CollabButton({ onOpen, btnRef }: { onOpen: () => void; btnRef: React.RefObject<HTMLButtonElement | null> }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 220, damping: 18 })
  const rotateY = useSpring(ry, { stiffness: 220, damping: 18 })

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ry.set(x * 14)
    rx.set(-y * 18)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.button
      ref={btnRef}
      type="button"
      layoutId="collab-pill"
      className="collab__btn"
      onClick={onOpen}
      onPointerMove={onMove}
      onPointerLeave={reset}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
      whileFocus="hover"
      variants={{
        rest: { y: 0, scale: 1, boxShadow: '0 18px 30px -12px rgba(0,0,0,0.55), 0 4px 10px rgba(0,0,0,0.25)' },
        hover: { y: -6, scale: 1.02, boxShadow: '0 34px 50px -16px rgba(0,0,0,0.6), 0 8px 18px rgba(0,0,0,0.25)' },
        tap: { y: -2, scale: 0.98 },
      }}
      style={{ rotateX, rotateY, transformPerspective: 900, borderRadius: 999 }}
      aria-haspopup="dialog"
    >
      <span className="collab__gloss" aria-hidden="true" />
      <motion.span
        className="collab__sweep"
        aria-hidden="true"
        variants={{
          rest: { x: '-140%' },
          hover: { x: '140%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
          tap: { x: '140%' },
        }}
      />
      <span className="collab__label">Let&rsquo;s collaborate</span>
    </motion.button>
  )
}

export function Collaborate() {
  const root = useRef<HTMLElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const btnWrap = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const L = useLayout()
  const A = anchors(L.btn)
  const [vbW, vbH] = L.vb

  const close = useCallback(() => setOpen(false), [])

  // Return focus to the pill after the overlay closes.
  useEffect(() => {
    if (open) {
      wasOpen.current = true
    } else if (wasOpen.current) {
      requestAnimationFrame(() => btnRef.current?.focus({ preventScroll: true }))
    }
  }, [open])

  useGSAP(
    () => {
      const svgEl = svg.current
      if (!svgEl) return
      const hand = svgEl.querySelector<SVGGElement>('.collab__hand')
      const paths = Array.from(svgEl.querySelectorAll<SVGPathElement>('.collab__string'))
      const pull: Pull = { x: 0, y: 0, r: 0 }
      const ptr = { x: 0, tx: 0 }
      const tension = { v: 0 }
      const t0 = performance.now()

      const render = () => {
        const t = (performance.now() - t0) / 1000
        ptr.x += (ptr.tx - ptr.x) * 0.06
        const m = handMatrix(L, pull)
        hand?.setAttribute('transform', m.attr)
        paths.forEach((p, i) => {
          const a = m.apply(GRIP[i % GRIP.length])
          p.setAttribute('d', stringPath(a, A[i % A.length], i, reduced ? 0 : t, tension.v, ptr.x))
        })
        // The pill gives a little toward the hand on each tug.
        if (btnWrap.current) {
          const k = svgEl.clientWidth / vbW
          gsap.set(btnWrap.current, { x: -7 * tension.v * k, y: 5 * tension.v * k })
        }
      }
      render()

      if (reduced) {
        gsap.set(paths, { attr: { 'stroke-dashoffset': 0 } })
        return
      }

      // Entrance
      const enter = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%' } })
      enter
        .from('.collab__line > span', { yPercent: 110, duration: 1.1, stagger: 0.08, ease: 'expo.out' })
        .from(btnWrap.current, { autoAlpha: 0, scale: 0.86, duration: 1, ease: 'expo.out' }, 0.2)
        .fromTo(pull, { x: -160, y: 160, r: -10 }, { x: 0, y: 0, r: 0, duration: 1.4, ease: 'expo.out' }, 0.3)
        .fromTo(
          paths,
          { attr: { 'stroke-dashoffset': 1 } },
          { attr: { 'stroke-dashoffset': 0 }, duration: 1.2, stagger: 0.09, ease: 'power2.inOut' },
          0.7,
        )
        .from('.collab__aside > *', { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.7 }, 0.8)

      // Small, natural tugs: pull back, hold, ease off.
      const tug = gsap.timeline({ repeat: -1, repeatDelay: 1.6, delay: 2.4, paused: true })
      tug
        .to(pull, { x: -9, y: 7, r: -2.2, duration: 0.7, ease: 'power2.inOut' })
        .to(tension, { v: 1, duration: 0.7, ease: 'power2.inOut' }, 0)
        .to(pull, { x: -4, y: 3, r: -1, duration: 0.5, ease: 'sine.inOut' })
        .to(pull, { x: 0, y: 0, r: 0, duration: 1.3, ease: 'elastic.out(1, 0.6)' })
        .to(tension, { v: 0, duration: 1.4, ease: 'sine.out' }, '<')

      // Only animate while the section is on screen.
      let active = false
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          active = self.isActive
          if (active) {
            gsap.ticker.add(render)
            tug.play()
          } else {
            gsap.ticker.remove(render)
            tug.pause()
          }
        },
      })

      const onPointer = (e: PointerEvent) => {
        const r = root.current!.getBoundingClientRect()
        ptr.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
      }
      root.current?.addEventListener('pointermove', onPointer, { passive: true })

      return () => {
        gsap.ticker.remove(render)
        tug.kill()
        st.kill()
        root.current?.removeEventListener('pointermove', onPointer)
      }
    },
    { scope: root, dependencies: [L.name, reduced], revertOnUpdate: true },
  )

  const pct = (n: number, of: number) => `${(n / of) * 100}%`

  return (
    <section id="contact" ref={root} className="collab" aria-labelledby="collab-title">
      <div className="collab__inner">
        <header className="collab__head">
          <p className="mono collab__kicker">05 &mdash; Hire me</p>
          <h2 id="collab-title" className="collab__title">
            <span className="collab__line reveal-line">
              <span>Got a problem worth</span>
            </span>
            <span className="collab__line reveal-line">
              <span>
                <em>measuring?</em>
              </span>
            </span>
          </h2>
        </header>

        <div className={`collab__stage collab__stage--${L.name}`} style={{ aspectRatio: `${vbW} / ${vbH}` }}>
          <svg ref={svg} className="collab__svg" viewBox={`0 0 ${vbW} ${vbH}`} aria-hidden="true" focusable="false">
            <HandDefs />
            <g className="collab__strings">
              {A.map((_, i) => (
                <path key={i} className="collab__string" pathLength={1} strokeDasharray="1" strokeDashoffset={reduced ? 0 : 1} />
              ))}
            </g>
            <g className="collab__hand" filter="url(#hand-shadow)">
              <HandArt />
            </g>
          </svg>

          <div
            ref={btnWrap}
            className="collab__btn-wrap"
            style={{
              left: pct(L.btn.cx - L.btn.w / 2, vbW),
              top: pct(L.btn.cy - L.btn.h / 2, vbH),
              width: pct(L.btn.w, vbW),
              height: pct(L.btn.h, vbH),
            }}
          >
            {!open && <CollabButton onOpen={() => setOpen(true)} btnRef={btnRef} />}
          </div>

          <div className="collab__aside">
            <p className="mono">Open to AI engineering and product engineering roles</p>
            <p className="collab__aside-copy">Agents, evals, applied ML, and the software around them.</p>
          </div>
        </div>
      </div>

      <AnimatePresence>{open && <ContactOverlay onClose={close} reduced={reduced} />}</AnimatePresence>
    </section>
  )
}
