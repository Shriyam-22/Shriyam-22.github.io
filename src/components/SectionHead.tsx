import type { ReactNode } from 'react'

export function SectionHead({ num, title, id, aside }: { num: string; title: string; id: string; aside?: ReactNode }) {
  return (
    <header className="section-head" data-reveal-head>
      <span className="section-head__num">{num}</span>
      <h2 id={id} className="section-head__title display">
        <span className="reveal-line">
          <span>{title}</span>
        </span>
      </h2>
      {aside ? <p className="section-head__aside">{aside}</p> : <span />}
      <div className="rule" />
    </header>
  )
}
