import { useRef } from 'react'
import { SectionHead } from './SectionHead'
import { useSectionReveal } from '../lib/useSectionReveal'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { experience, education, achievements } from '../data/content'
import './Experience.css'

export function Experience() {
  const root = useRef<HTMLElement>(null)
  useSectionReveal(root)

  // The timeline spine draws itself as the section scrolls through.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.xp__spine',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.xp__list', start: 'top 70%', end: 'bottom 60%', scrub: true } },
      )
    },
    { scope: root },
  )

  return (
    <section id="experience" ref={root} className="section xp" aria-labelledby="xp-title">
      <div className="wrap">
        <SectionHead num="03" title="Experience" id="xp-title" aside="Two internships in 2026, both shipping ML to people who use it." />

        <div className="xp__list">
          <span className="xp__spine" aria-hidden="true" />
          <ol className="xp__items">
            {experience.map((x) => (
              <li key={x.org} className="xp__item" data-reveal>
                <p className="xp__dates mono">{x.dates}</p>
                <div className="xp__main">
                  <h3 className="xp__org display">{x.org}</h3>
                  <p className="xp__role">{x.role}</p>
                  <ul className="xp__points">
                    {x.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="xp__foot">
          <div className="xp__edu" data-reveal>
            <h3 className="mono xp__foot-title">Education</h3>
            <p className="display xp__school">{education.school}</p>
            <p>
              {education.degree} &middot; {education.grade} &middot; <span className="mono">{education.dates}</span>
            </p>
          </div>
          <div className="xp__ach" data-reveal>
            <h3 className="mono xp__foot-title">Achievements</h3>
            <ul>
              {achievements.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
