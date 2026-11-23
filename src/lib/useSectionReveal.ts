import type { RefObject } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from './motion'

/**
 * Shared editorial entrance for a section: the heading rises out of its mask,
 * the rule draws across, and any [data-reveal] children fade up in order.
 */
export function useSectionReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const head = scope.current?.querySelector('[data-reveal-head]')
      if (head) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: head, start: 'top 85%' } })
        tl.from(head.querySelectorAll('.reveal-line > span'), { yPercent: 110, duration: 1.1, ease: 'expo.out' })
          .from(head.querySelector('.rule'), { scaleX: 0, duration: 1.2, ease: 'power3.inOut' }, 0.1)
          .from(head.querySelectorAll('.section-head__num, .section-head__aside'), { autoAlpha: 0, y: 10, duration: 0.6 }, 0.3)
      }
      gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current).forEach((el) => {
        gsap.from(el, {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
    },
    { scope },
  )
}
