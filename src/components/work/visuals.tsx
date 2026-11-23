import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion, ScrollTrigger } from '../../lib/motion'
import { images } from '../../data/content'

/* ------------------------------------------------------------------ */
/* 01 — the support agent's message path, drawn as you scroll          */
/* ------------------------------------------------------------------ */
const flowNodes = [
  { id: 'c', x: 20, y: 40, w: 150, label: 'Customer', sub: 'WhatsApp message' },
  { id: 'ig', x: 20, y: 130, w: 150, label: 'Input guardrails', sub: 'length · injection flag' },
  { id: 'ld', x: 20, y: 220, w: 150, label: 'Language detection', sub: 'en · hi · hinglish' },
  { id: 'loop', x: 230, y: 175, w: 170, label: 'Agent loop', sub: 'max 5 steps', accent: true },
  { id: 'llm', x: 230, y: 40, w: 170, label: 'LLM', sub: 'OpenAI-compatible' },
  { id: 'og', x: 230, y: 320, w: 170, label: 'Output guardrails', sub: 'price + status grounding' },
  { id: 'reply', x: 20, y: 400, w: 150, label: 'Reply', sub: 'or repair → fallback' },
  { id: 'ops', x: 230, y: 430, w: 170, label: 'Agent Ops Console', sub: 'human hand-off', blue: true },
]
const tools = ['track_order', 'search_products', 'search_policies', 'escalate_to_human']

export function AgentFlow() {
  const root = useRef<SVGSVGElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'bottom 55%', scrub: 0.6 },
      })
      tl.from('.flow__node', { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.4 })
        .fromTo('.flow__edge', { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.07, duration: 0.5, ease: 'none' }, 0.1)
        .from('.flow__tool', { autoAlpha: 0, x: -12, stagger: 0.08, duration: 0.3 }, 0.5)
    },
    { scope: root },
  )
  const n = Object.fromEntries(flowNodes.map((f) => [f.id, f]))
  const mid = (id: string, side: 'l' | 'r' | 't' | 'b') => {
    const f = n[id]
    const h = 54
    return side === 'l'
      ? [f.x, f.y + h / 2]
      : side === 'r'
        ? [f.x + f.w, f.y + h / 2]
        : side === 't'
          ? [f.x + f.w / 2, f.y]
          : [f.x + f.w / 2, f.y + h]
  }
  const edge = (a: number[], b: number[], bend = 0) => {
    const mx = (a[0] + b[0]) / 2 + bend
    const my = (a[1] + b[1]) / 2
    return `M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`
  }
  const edges = [
    edge(mid('c', 'b'), mid('ig', 't')),
    edge(mid('ig', 'b'), mid('ld', 't')),
    edge(mid('ld', 'r'), mid('loop', 'l'), 10),
    edge(mid('loop', 't'), mid('llm', 'b'), -26),
    edge(mid('llm', 'b'), mid('loop', 't'), 26),
    edge(mid('loop', 'b'), mid('og', 't')),
    edge(mid('og', 'l'), mid('reply', 'r'), -10),
    edge(mid('og', 'b'), mid('ops', 't')),
  ]
  return (
    <svg ref={root} className="flow" viewBox="0 0 600 500" role="img" aria-labelledby="flow-title flow-desc">
      <title id="flow-title">How a message moves through the D2C Support Agent</title>
      <desc id="flow-desc">
        A customer message passes input guardrails and language detection, then an agent loop calls the LLM and four tools. Output
        guardrails check the reply; failures are repaired once then fall back safely; escalations go to the Agent Ops Console.
      </desc>
      <defs>
        <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </marker>
      </defs>
      {edges.map((d, i) => (
        <path key={i} className="flow__edge" d={d} pathLength={1} strokeDasharray="1" markerEnd="url(#arrow)" />
      ))}
      <path className="flow__edge" d="M400 202 C 440 202, 440 110, 452 110" pathLength={1} strokeDasharray="1" />
      {flowNodes.map((f) => (
        <g key={f.id} transform={`translate(${f.x} ${f.y})`}>
          <g className={`flow__node ${f.accent ? 'is-accent' : ''} ${f.blue ? 'is-blue' : ''}`}>
            <rect width={f.w} height={54} rx={f.accent ? 27 : 2} />
            <text x={12} y={23} className="flow__label">
              {f.label}
            </text>
            <text x={12} y={41} className="flow__sub">
              {f.sub}
            </text>
          </g>
        </g>
      ))}
      <g transform="translate(452 60)">
        <text className="flow__sub" y={0}>
          TOOLS
        </text>
        {tools.map((t, i) => (
          <g key={t} transform={`translate(0 ${18 + i * 30})`}>
            <g className="flow__tool">
              <line x1={0} x2={10} y1={0} y2={0} />
              <text x={16} y={4} className="flow__tool-text">
                {t}()
              </text>
            </g>
          </g>
        ))}
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 02 — the forecasting result, set as type and two honest bars         */
/* ------------------------------------------------------------------ */
export function ForecastFigure() {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.fc__bar-fill', {
        scaleX: 0,
        duration: 1.4,
        stagger: 0.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.fc__bars', start: 'top 80%' },
      })
      gsap.from('.fc__strike', {
        scaleX: 0,
        duration: 0.9,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: '.fc__copy', start: 'top 75%' },
      })
    },
    { scope: root },
  )
  return (
    <div ref={root} className="fc">
      <div className="fc__copy">
        <span className="mono fc__tag">Data forensics</span>
        <p className="display fc__big">
          <span className="fc__struck">
            30 months
            <span className="fc__strike" aria-hidden="true" />
          </span>
          <span className="fc__small">were a copy of 2007&ndash;2010.</span>
        </p>
        <p className="fc__note">Left in, the copied block inflated estimated volatility by about 70%.</p>
      </div>
      <figure className="fc__bars">
        <figcaption className="mono">Holdout MAPE, 12 unseen months &mdash; lower is better</figcaption>
        <div className="fc__row">
          <span className="mono">ARIMA (selected)</span>
          <span className="fc__bar">
            <span className="fc__bar-fill fc__bar-fill--win" style={{ width: `${(8.7 / 18) * 100}%` }} />
          </span>
          <span className="display fc__val">8.7%</span>
        </div>
        <div className="fc__row">
          <span className="mono">LightGBM</span>
          <span className="fc__bar">
            <span className="fc__bar-fill" style={{ width: `${(16 / 18) * 100}%` }} />
          </span>
          <span className="display fc__val">~16%</span>
        </div>
        <p className="mono fc__foot">
          10 model families &middot; 71 tuned SARIMA configs &middot; every holdout month inside the 95% interval
        </p>
      </figure>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 03 — real-estate app, revealed through a mask with parallax          */
/* ------------------------------------------------------------------ */
export function RealEstateVisual() {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.re__main',
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: root.current, start: 'top 75%' } },
      )
      gsap.fromTo(
        '.re__second',
        { yPercent: 30 },
        { yPercent: -20, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.from('.re__callout', {
        autoAlpha: 0,
        x: -16,
        stagger: 0.15,
        duration: 0.8,
        scrollTrigger: { trigger: root.current, start: 'top 55%' },
      })
    },
    { scope: root },
  )
  return (
    <div ref={root} className="re">
      <figure className="re__main">
        <img
          src={images.rePredict}
          alt="The advisor's predict page: a property form and a Good Investment verdict with a 5-year price forecast"
          loading="lazy"
          decoding="async"
          width={1400}
          height={1000}
        />
      </figure>
      <figure className="re__second">
        <img
          src={images.reInsights}
          alt="Market insights page with state and city price heatmaps"
          loading="lazy"
          decoding="async"
          width={1400}
          height={1000}
        />
      </figure>
      <p className="re__callout re__callout--a mono">
        <span>A</span> Verdict + confidence score
      </p>
      <p className="re__callout re__callout--b mono">
        <span>B</span> 5-year price forecast
      </p>
      <p className="re__callout re__callout--c mono">
        <span>C</span> Market heatmaps
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 04 — the travel agent's tool chain, as a pinned horizontal sequence  */
/* ------------------------------------------------------------------ */
const travelSteps = [
  { k: 'Request', v: 'The traveller asks for a 3–7 day trip in India' },
  { k: 'Flights', v: 'Search and rank: cheapest, fastest, best value' },
  { k: 'Hotels', v: 'Best-value stay for the dates and budget' },
  { k: 'Places', v: 'Attractions for a day-by-day plan' },
  { k: 'Weather', v: 'Live forecast from Open-Meteo' },
  { k: 'Budget', v: 'Estimated total cost' },
  { k: 'Itinerary', v: 'Validated JSON + a readable plan, with “why we chose this”' },
]

export function TravelSequence() {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const track = root.current?.querySelector<HTMLElement>('.tr__track')
      if (!track || prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 861px)', () => {
        const distance = () => track.scrollWidth - (root.current?.clientWidth ?? 0)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'center center',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        tl.to(track, { x: () => -distance(), ease: 'none' }).to('.tr__progress span', { scaleX: 1, ease: 'none' }, 0)
      })
      return () => mm.revert()
    },
    { scope: root },
  )
  return (
    <div ref={root} className="tr">
      <p className="tr__cap mono">
        <span>The agent&rsquo;s tool chain</span>
        <span className="tr__progress" aria-hidden="true">
          <span />
        </span>
        <span aria-hidden="true">&rarr;</span>
      </p>
      <ol className="tr__track">
        {travelSteps.map((s, i) => (
          <li key={s.k} className="tr__step">
            <span className="mono tr__i">{String(i + 1).padStart(2, '0')}</span>
            <span className="display tr__k">{s.k}</span>
            <span className="tr__v">{s.v}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 05 — Cricbuzz: one big numeral and the fallback path                 */
/* ------------------------------------------------------------------ */
export function CricketVisual() {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const counter = { v: 0 }
      const el = root.current?.querySelector('.ck__num-val')
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 75%',
        once: true,
        onEnter: () =>
          gsap.to(counter, {
            v: 25,
            duration: 1.6,
            ease: 'power3.out',
            onUpdate: () => {
              if (el) el.textContent = String(Math.round(counter.v))
            },
          }),
      })
    },
    { scope: root },
  )
  return (
    <div ref={root} className="ck">
      <p className="ck__num display">
        <span className="sr-only">25</span>
        <span className="ck__num-val outline" aria-hidden="true">
          25
        </span>
      </p>
      <p className="mono ck__cap">analytical SQL queries &mdash; 8 beginner &middot; 8 intermediate &middot; 9 advanced</p>
      <p className="ck__path mono">
        <span>Cricbuzz API</span>
        <span className="ck__arrow" aria-hidden="true">
          &rarr;
        </span>
        <span className="ck__bad">HTTP 429 / offline</span>
        <span className="ck__arrow" aria-hidden="true">
          &rarr;
        </span>
        <span className="ck__good">fall back to SQL</span>
      </p>
    </div>
  )
}
