import { useRef } from 'react'
import { SectionHead } from './SectionHead'
import { useSectionReveal } from '../lib/useSectionReveal'
import { person, education } from '../data/content'
import './About.css'

export function About() {
  const root = useRef<HTMLElement>(null)
  useSectionReveal(root)

  return (
    <section id="about" ref={root} className="section about" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead num="01" title="About" id="about-title" aside="From the test lab to the agent loop." />

        <div className="about__grid">
          <div className="about__lede" data-reveal>
            <p className="about__dropcap">
              {person.thesis.replace(/\.$/, ':')} {person.intro}
            </p>
            <p>{person.background}</p>
            <p>{person.method}</p>
          </div>

          <aside className="about__sheet" aria-label="At a glance" data-reveal>
            <dl>
              <div>
                <dt className="mono">Focus</dt>
                <dd>{person.focus.join(' · ')}</dd>
              </div>
              <div>
                <dt className="mono">Background</dt>
                <dd>QA automation &rarr; AI engineering</dd>
              </div>
              <div>
                <dt className="mono">Approach</dt>
                <dd>
                  <ol className="about__approach">
                    {person.approach.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ol>
                </dd>
              </div>
              <div>
                <dt className="mono">Education</dt>
                <dd>
                  {education.degree}, {education.school} &mdash; {education.grade} ({education.dates})
                </dd>
              </div>
              <div>
                <dt className="mono">Now</dt>
                <dd>{person.status}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  )
}
