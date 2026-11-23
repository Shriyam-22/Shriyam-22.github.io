import { useRef } from 'react'
import { Flashlight } from './Flashlight'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { person, images } from '../data/content'
import './DarkRoom.css'

/** One composition, rendered twice: unlit (cover) and lit (revealed). */
function Room({ lit }: { lit: boolean }) {
  return (
    <div className={`room ${lit ? 'room--lit' : 'room--dark'}`}>
      <p className="room__frag room__frag--a display">
        Guardrails
        <br />
        in code.
      </p>

      <p className="room__frag room__frag--b">
        Evals, <em>not screenshots.</em>
      </p>

      <p className="room__frag room__frag--c mono">QA automation &rarr; AI engineering</p>

      <figure className="room__face">
        <img
          src={person.portrait}
          alt={lit ? `${person.name}, portrait detail` : ''}
          loading="lazy"
          decoding="async"
          width={660}
          height={942}
        />
        <figcaption className="mono room__label room__label--face">Fig. 2 &mdash; the engineer</figcaption>
      </figure>

      <figure className="room__shot">
        <img
          src={images.rePredict}
          alt={lit ? 'Real Estate Investment Advisor app: property form and a "Good Investment" verdict' : ''}
          loading="lazy"
          decoding="async"
          width={1400}
          height={1000}
        />
        <figcaption className="mono room__label">Fig. 3 &mdash; Real Estate Investment Advisor, live on Streamlit</figcaption>
      </figure>

      <ul className="room__approach mono" aria-label="Approach">
        {person.approach.map((a, i) => (
          <li key={a}>
            <span className="room__num">0{i + 1}</span> {a}
          </li>
        ))}
      </ul>

      <svg className="room__annot" viewBox="0 0 220 120" aria-hidden="true">
        <path d="M215 4 C 170 10, 120 40, 30 112" />
        <path d="M30 100 L30 112 L42 110" />
      </svg>
      <p className="room__frag room__frag--d mono">Builds: agents &middot; evals &middot; pipelines &middot; the interface</p>
    </div>
  )
}

export function DarkRoom() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.darkroom__intro > *', {
        y: 30,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.darkroom__intro', start: 'top 85%' },
      })
      gsap.fromTo(
        '.darkroom__stage',
        { clipPath: 'inset(8% 6% 8% 6%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: '.darkroom__stage', start: 'top 95%', end: 'top 25%', scrub: true },
        },
      )
    },
    { scope: root },
  )

  return (
    <section id="dark-room" ref={root} className="darkroom" aria-labelledby="darkroom-title">
      <div className="darkroom__intro wrap">
        <p className="mono darkroom__kicker">Interlude &mdash; the dark room</p>
        <h2 id="darkroom-title" className="darkroom__title">
          Move the light. <em>What&rsquo;s underneath is the work.</em>
        </h2>
        <p className="mono darkroom__hint">Desktop: move your pointer &middot; Touch: tap or drag &middot; Or turn the lights on</p>
      </div>
      <div className="darkroom__stage">
        <Flashlight cover={<Room lit={false} />} radius={250} core={0.34} rest={{ x: 30, y: 42 }}>
          <Room lit />
        </Flashlight>
      </div>
    </section>
  )
}
