# Shriyam — Portfolio

A cinematic, editorial portfolio for Shriyam, AI engineer. Built with React, TypeScript and Vite, with GSAP + ScrollTrigger and Framer Motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve dist/ locally
npm run typecheck  # tsc
npm run lint       # oxlint
npm run format     # prettier
```

`vite.config.ts` uses `base: './'`, so `dist/` works on GitHub Pages, Netlify, Vercel or any sub-folder as it is.

## Where the content lives

All text, numbers and links come from one file: **`src/data/content.ts`**. Every fact in it is taken from the CV, the GitHub profile README or a project repository's README. Edit that file to change anything the site says.

| What | Where in `content.ts` |
|---|---|
| Name, role, thesis, intro, approach | `person` |
| Email, LinkedIn, GitHub, "Start a Project" email subject | `contact` |
| Skills (grouped by the job each tool does) | `skills` |
| Internships | `experience` |
| Education, achievements | `education`, `achievements` |
| The five case studies | `caseStudies` |
| Smaller projects, CV-only projects | `shortWork`, `earlierWork` |

Images are in `src/assets/` (portrait, and screenshots taken from the project repos).

## How it's put together

| Section | File | Motion |
|---|---|---|
| Navigation | `components/Nav.tsx` | Framer Motion: active underline (`layoutId`), mobile menu |
| Hero | `components/Hero.tsx` | GSAP opening timeline (rules, captions, clip-path portrait, letter stagger); ScrollTrigger parallax |
| Dark room | `components/DarkRoom.tsx` | Uses the reusable `Flashlight` |
| Flashlight | `components/Flashlight.tsx` | Pointer → ref → `requestAnimationFrame` → CSS custom properties. No React re-renders while the beam moves |
| About, Experience, Skills | `components/*.tsx` | Shared GSAP entrance in `lib/useSectionReveal.ts` |
| Case studies | `components/work/` | GSAP: diagram drawn on scroll, mask reveals, pinned horizontal sequence, counters. Framer Motion: link buttons |
| Hire me | `components/collab/` | GSAP: entrance, string drawing, hand tugs, string sway (ticker, only while on screen). Framer Motion: pill hover/tilt/sweep and the pill→dialog morph |

### Reusing the flashlight

```tsx
<Flashlight
  cover={<Scene lit={false} />}   // the dark layer
  radius={250}                     // beam radius in px
  core={0.34}                      // share of the radius that is fully lit
  glow={0.55}                      // ambient spill (off on low-power devices)
  follow={0.16}                    // easing toward the pointer, 1 = snap
  rest={{ x: 30, y: 42 }}          // resting position, % of the stage
>
  <Scene lit />                    // the layer the beam reveals
</Flashlight>
```

Touch: tap to move the beam, drag sideways to sweep it. A "Turn the lights on" button reveals everything (also the keyboard path).

## Accessibility and performance

- `prefers-reduced-motion`: GSAP timelines are skipped, content is shown in place, the flashlight snaps instead of easing, the travel sequence becomes a list, grain stops.
- Low-power devices (≤4 cores, ≤4 GB memory or data-saver): the beam glow and animated grain are switched off.
- The contact dialog moves focus to its close button, keeps Tab inside, closes on Escape or the × button, and returns focus to the pill.
- Skip link, semantic landmarks, visible focus rings, alt text on every content image.
- Fonts are self-hosted (`@fontsource`); below-the-fold images are lazy-loaded.
- All GSAP work runs inside `useGSAP` scopes, so timelines and ScrollTriggers are reverted on unmount. The string ticker runs only while the section is on screen.
