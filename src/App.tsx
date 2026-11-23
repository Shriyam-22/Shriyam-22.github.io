import { useEffect, useState } from 'react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { DarkRoom } from './components/DarkRoom'
import { About } from './components/About'
import { Work } from './components/work/Work'
import { Experience } from './components/Experience'
import { Skills } from './components/Skills'
import { Collaborate } from './components/collab/Collaborate'
import { Footer } from './components/Footer'
import { ScrollTrigger, isLowPowerDevice, useReducedMotion } from './lib/motion'
import './App.css'

export default function App() {
  const reduced = useReducedMotion()
  const [lowPower] = useState(isLowPowerDevice)

  // Fonts and lazy images change layout height; re-measure scroll positions once they land.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <DarkRoom />
        <About />
        <Work />
        <Experience />
        <Skills />
        <Collaborate />
      </main>
      <Footer />
      <div className={`grain ${!reduced && !lowPower ? 'grain--animated' : ''}`} aria-hidden="true" />
    </>
  )
}
