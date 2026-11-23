import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { contact } from '../../data/content'

type Props = { onClose: () => void; reduced: boolean }

const items = [
  { label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
  { label: 'LinkedIn', value: contact.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), href: contact.linkedin },
  { label: 'GitHub', value: contact.github.replace(/^https?:\/\//, ''), href: contact.github },
]

/**
 * The pill grows into this panel (shared layoutId "collab-pill").
 * Focus moves to the close control, stays inside the dialog, and Escape closes it.
 */
export function ContactOverlay({ onClose, reduced }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeBtn.current?.focus({ preventScroll: true })
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      const focusables = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const t = reduced ? { duration: 0 } : undefined
  const projectHref = `mailto:${contact.email}?subject=${encodeURIComponent(contact.projectMailSubject)}`

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={t ?? { duration: 0.35 }}
      onClick={onClose}
    >
      <motion.div
        ref={panel}
        layoutId="collab-pill"
        className="overlay__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="overlay-title"
        onClick={(e) => e.stopPropagation()}
        transition={t ?? { type: 'spring', stiffness: 260, damping: 30 }}
        style={{ borderRadius: 28 }}
      >
        <motion.div
          className="overlay__inner"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={t ?? { delay: 0.18, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="overlay__top">
            <p className="mono overlay__kicker">Let&rsquo;s collaborate</p>
            <motion.button
              ref={closeBtn}
              type="button"
              className="overlay__close mono"
              onClick={onClose}
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close contact details"
            >
              <span aria-hidden="true">&times;</span>
            </motion.button>
          </div>

          <h2 id="overlay-title" className="overlay__title">
            Tell me what you&rsquo;re building.
          </h2>

          <ul className="overlay__list">
            {items.map((it, i) => (
              <motion.li
                key={it.label}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={t ?? { delay: 0.28 + i * 0.06 }}
              >
                <motion.a
                  href={it.href}
                  target={it.href.startsWith('http') ? '_blank' : undefined}
                  rel={it.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="overlay__link"
                  whileHover={{ x: 8 }}
                >
                  <span className="mono overlay__label">{it.label}</span>
                  <span className="overlay__value">{it.value}</span>
                  <span className="overlay__arrow" aria-hidden="true">
                    &#8599;
                  </span>
                </motion.a>
              </motion.li>
            ))}
          </ul>

          <motion.a href={projectHref} className="overlay__cta" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Start a Project <span aria-hidden="true">&rarr;</span>
          </motion.a>
          <p className="mono overlay__hint">Esc to close</p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
