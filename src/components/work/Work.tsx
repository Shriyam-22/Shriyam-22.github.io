import { useRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHead } from '../SectionHead'
import { useSectionReveal } from '../../lib/useSectionReveal'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/motion'
import { caseStudies, shortWork, earlierWork, type CaseStudy } from '../../data/content'
import { AgentFlow, ForecastFigure, RealEstateVisual, TravelSequence, CricketVisual } from './visuals'
import './Work.css'

function ProjectLinks({ cs }: { cs: Pick<CaseStudy, 'repo' | 'live' | 'title'> }) {
  return (
    <div className="cs__links">
      {cs.live && (
        <motion.a
          className="text-link text-link--solid"
          href={cs.live}
          target="_blank"
          rel="noreferrer"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
          aria-label={`${cs.title}: live app (opens in a new tab)`}
        >
          Live app <span aria-hidden="true">&#8599;</span>
        </motion.a>
      )}
      {cs.repo && (
        <motion.a
          className="text-link"
          href={cs.repo}
          target="_blank"
          rel="noreferrer"
          whileHover={{ y: -3, borderColor: 'rgba(239,233,220,0.7)' }}
          whileTap={{ scale: 0.96 }}
          aria-label={`${cs.title}: source on GitHub (opens in a new tab)`}
        >
          Source <span aria-hidden="true">&#8599;</span>
        </motion.a>
      )}
    </div>
  )
}

function Visual({ kind }: { kind: CaseStudy['visual'] }) {
  switch (kind) {
    case 'agent-flow':
      return <AgentFlow />
    case 'forecast':
      return <ForecastFigure />
    case 'real-estate':
      return <RealEstateVisual />
    case 'travel':
      return <TravelSequence />
    case 'cricket':
      return <CricketVisual />
  }
}

function Case({ cs }: { cs: CaseStudy }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 78%' } })
      tl.from('.cs__index', { yPercent: 100, autoAlpha: 0, duration: 1.2, ease: 'expo.out' })
        .from('.cs__title .reveal-line > span', { yPercent: 110, duration: 1.1, ease: 'expo.out' }, 0.05)
        .from('.cs__rule', { scaleX: 0, duration: 1.2, ease: 'power3.inOut' }, 0)
        .from('.cs__meta, .cs__col > *', { autoAlpha: 0, y: 24, stagger: 0.06, duration: 0.8, ease: 'power3.out' }, 0.3)
    },
    { scope: ref },
  )

  return (
    <article ref={ref} className={`cs cs--${cs.visual}`} aria-labelledby={`cs-${cs.id}`}>
      <div className="cs__head">
        <span className="cs__index display outline" aria-hidden="true">
          {cs.index}
        </span>
        <div className="cs__titles">
          <p className="cs__meta mono">
            Case {cs.index} &mdash; {cs.kicker}
          </p>
          <h3 id={`cs-${cs.id}`} className="cs__title display">
            <span className="reveal-line">
              <span>{cs.title}</span>
            </span>
          </h3>
        </div>
        <div className="cs__rule rule" />
      </div>

      <div className="cs__body">
        <div className="cs__text">
          <div className="cs__col">
            <div className="cs__block">
              <h4 className="mono cs__label">Problem</h4>
              <p className="cs__problem">{cs.problem}</p>
            </div>
            <div className="cs__block">
              <h4 className="mono cs__label">Solution</h4>
              <p>{cs.solution}</p>
            </div>
          </div>
          <div className="cs__col">
            <div className="cs__block">
              <h4 className="mono cs__label">What I built</h4>
              <ul className="cs__list">
                {cs.contribution.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            {cs.figures && (
              <dl className="cs__figs">
                {cs.figures.map((f) => (
                  <div key={f.label}>
                    <dt className="mono">{f.label}</dt>
                    <dd className="display">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="cs__stack mono">
              <span className="sr-only">Technologies: </span>
              {cs.stack.join('  /  ')}
            </p>
            <ProjectLinks cs={cs} />
          </div>
        </div>
        <div className="cs__visual">
          <Visual kind={cs.visual} />
        </div>
      </div>
    </article>
  )
}

export function Work() {
  const root = useRef<HTMLElement>(null)
  useSectionReveal(root)

  return (
    <section id="work" ref={root} className="section work" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHead num="02" title="Selected work" id="work-title" aside="Five case studies, each starting from a real user's problem." />
      </div>

      {caseStudies.map((cs) => (
        <Case key={cs.id} cs={cs} />
      ))}

      <div className="wrap work__more">
        <h3 className="mono work__more-title" data-reveal>
          Also built
        </h3>
        <div className="work__short">
          {shortWork.map((w, i) => (
            <article key={w.title} className={`short short--${i}`} data-reveal>
              <figure className="short__img">
                <img src={w.image} alt={w.imageAlt} loading="lazy" decoding="async" />
              </figure>
              <div className="short__text">
                <h4 className="display short__title">{w.title}</h4>
                <p className="mono short__stack">{w.stack}</p>
                <p>{w.line}</p>
                <ProjectLinks cs={{ title: w.title, repo: w.repo }} />
              </div>
            </article>
          ))}
        </div>

        <h3 className="mono work__more-title" data-reveal>
          Earlier work, from the CV <span className="work__note">(no public repository)</span>
        </h3>
        <ol className="earlier" data-reveal>
          {earlierWork.map((w, i) => (
            <li key={w.title}>
              <span className="mono earlier__i">E{i + 1}</span>
              <span className="earlier__title">{w.title}</span>
              <span className="earlier__line">{w.line}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
