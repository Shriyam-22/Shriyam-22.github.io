import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { person } from '../data/content'
import './Hero.css'

const NAME = person.name.toUpperCase().split('')

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('[data-hero-hidden]', { autoAlpha: 1 })
        return
      }
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.set('[data-hero-hidden]', { autoAlpha: 1 })
        .from('.hero__rule', { scaleX: 0, duration: 1.4, stagger: 0.12, ease: 'power3.inOut' })
        .from('.hero__cap', { yPercent: 110, duration: 0.9, stagger: 0.06 }, '-=1.0')
        .fromTo(
          '.hero__frame',
          { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 0 0)' },
          { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)', duration: 1.6, ease: 'expo.inOut' },
          '-=0.7',
        )
        .from('.hero__frame img', { scale: 1.35, duration: 2.2 }, '<')
        .from('.hero__letter', { yPercent: 105, duration: 1.3, stagger: 0.055 }, '-=1.4')
        .from('.hero__thesis .reveal-line > span', { yPercent: 110, duration: 1.1, stagger: 0.08 }, '-=1.1')
        .from('.hero__note', { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.08 }, '-=0.7')
        .from('.hero__annot path', { strokeDashoffset: 140, duration: 0.9, ease: 'power2.out' }, '-=0.6')

      // Scroll: the portrait drifts slower than the type; the name spreads.
      gsap.to('.hero__frame', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero__name--fill, .hero__name--line', {
        xPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero__top', {
        autoAlpha: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: '30% top', end: '70% top', scrub: true },
      })
    },
    { scope: root },
  )

  const nameRow = (cls: string, hidden: boolean) => (
    <div className={`hero__name ${cls}`} aria-hidden={hidden || undefined}>
      {NAME.map((ch, i) => (
        <span className="hero__letter-mask" key={i}>
          <span className="hero__letter">{ch}</span>
        </span>
      ))}
    </div>
  )

  return (
    <section id="top" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__top" data-hero-hidden>
        <div className="hero__rule rule" />
        <div className="hero__meta">
          <p className="mono hero__capline">
            <span className="hero__cap">File Nº 001</span>
          </p>
          <p className="mono hero__capline">
            <span className="hero__cap">
              {person.role} &mdash; {person.location}
            </span>
          </p>
          <p className="mono hero__capline hero__capline--right">
            <span className="hero__cap">
              <span className="hero__live" aria-hidden="true" /> {person.status}
            </span>
          </p>
        </div>
        <div className="hero__rule rule" />

        <h1 id="hero-title" className="hero__thesis">
          <span className="sr-only">
            {person.fullName}, {person.role}.{' '}
          </span>
          <span className="reveal-line">
            <span>I build AI products</span>
          </span>
          <span className="reveal-line">
            <span>
              that hold up <em className="marker">in the</em>
            </span>
          </span>
          <span className="reveal-line">
            <span>
              <em className="marker">real world.</em>
            </span>
          </span>
        </h1>

        <div className="hero__notes">
          <p className="hero__note">
            <span className="mono hero__note-label">Focus</span>
            LLM agents with real tools, guardrails that check the model&rsquo;s work in code, and evals that say whether a change made
            things better.
          </p>
          <p className="hero__note">
            <span className="mono hero__note-label">Background</span>
            Test automation &rarr; AI engineering.
          </p>
          <a href="#dark-room" className="hero__note hero__scroll mono">
            <span aria-hidden="true">&darr;</span> Scroll into the dark room
          </a>
        </div>
      </div>

      <div className="hero__stage" data-hero-hidden>
        {nameRow('hero__name--fill', false)}
        <figure className="hero__figure">
          <div className="hero__frame">
            <img src={person.portrait} alt={person.portraitAlt} width={660} height={942} fetchPriority="high" />
          </div>
          <figcaption className="mono hero__figcap">
            Fig. 1 &mdash; {person.name}, {person.location}
          </figcaption>
          <svg className="hero__annot" viewBox="0 0 160 80" aria-hidden="true">
            <path d="M4 76 C 40 70, 70 40, 156 6" pathLength={140} strokeDasharray="140" />
            <circle cx="4" cy="76" r="3" />
          </svg>
        </figure>
        {nameRow('hero__name--line outline', true)}
      </div>
    </section>
  )
}
