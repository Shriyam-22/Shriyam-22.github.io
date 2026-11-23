import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { person } from '../data/content'
import './Nav.css'

const links = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export function Nav() {
  const [active, setActive] = useState<string>('')
  const [open, setOpen] = useState(false)

  // Highlight the section in view. IntersectionObserver: no scroll listeners.
  useEffect(() => {
    const seen = new Map<string, number>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0))
        let best = ''
        let bestRatio = 0
        seen.forEach((r, id) => {
          if (r > bestRatio) {
            best = id
            bestRatio = r
          }
        })
        setActive(best)
      },
      { threshold: [0, 0.15, 0.35, 0.6], rootMargin: '-20% 0px -40% 0px' },
    )
    links.forEach((l) => {
      const el = document.getElementById(l.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="nav">
        <a className="nav__brand mono" href="#top" aria-label={`${person.name}, back to top`}>
          <span className="nav__mark" aria-hidden="true">
            S
          </span>
          {person.name} <span className="nav__slash">/</span> <span className="nav__role">{person.role}</span>
        </a>

        <nav aria-label="Primary" className="nav__links">
          <ul>
            {links.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="mono" aria-current={active === l.id ? 'true' : undefined}>
                  {l.label}
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="nav__underline"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <motion.button
          type="button"
          className="nav__menu mono"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.94 }}
        >
          {open ? 'Close' : 'Menu'}
        </motion.button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="nav__sheet"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul>
              {links.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05 }}
                >
                  <a href={`#${l.id}`} className="display" onClick={() => setOpen(false)}>
                    <span className="mono">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
