import { useRef } from 'react'
import { SectionHead } from './SectionHead'
import { useSectionReveal } from '../lib/useSectionReveal'
import { skills } from '../data/content'
import './Skills.css'

export function Skills() {
  const root = useRef<HTMLElement>(null)
  useSectionReveal(root)

  return (
    <section id="skills" ref={root} className="section skills" aria-labelledby="skills-title">
      <div className="wrap">
        <SectionHead num="04" title="The stack" id="skills-title" aside="Organised by the job each tool does." />
        <ol className="skills__index">
          {skills.map((s, i) => (
            <li key={s.group} className="skills__row" data-reveal>
              <span className="mono skills__num">{String(i + 1).padStart(2, '0')}</span>
              <div className="skills__head">
                <h3 className="display skills__group">{s.group}</h3>
                {s.note && <p className="skills__note">{s.note}</p>}
              </div>
              <p className="skills__items">
                {s.items.map((it, j) => (
                  <span key={it}>
                    {it}
                    {j < s.items.length - 1 && (
                      <span className="skills__sep" aria-hidden="true">
                        {' '}
                        /{' '}
                      </span>
                    )}
                  </span>
                ))}
              </p>
              <span className="mono skills__count" aria-hidden="true">
                &times;{s.items.length}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
