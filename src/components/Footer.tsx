import { contact, person } from '../data/content'

export function Footer() {
  return (
    <footer className="footer">
      <p className="display footer__name" aria-hidden="true">
        {person.name}
      </p>
      <div className="footer__row mono">
        <span>&copy; 2026 {person.fullName}</span>
        <nav aria-label="Elsewhere" className="footer__links">
          <a href={`mailto:${contact.email}`}>Email</a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={contact.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
        <a href="#top">Back to top &uarr;</a>
      </div>
    </footer>
  )
}
