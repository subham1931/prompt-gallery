import { Link } from 'react-router-dom'
import { Aperture, Globe, Mail, Share2, Rss } from 'lucide-react'

const quickLinks = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
]

const socialLinks = [
  { icon: Globe, label: 'Website', href: '#' },
  { icon: Mail, label: 'Email', href: '#' },
  { icon: Share2, label: 'Share', href: '#' },
  { icon: Rss, label: 'RSS', href: '#' },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-text)] text-accent">
                <Aperture size={16} />
              </div>
              <span className="font-display text-lg font-semibold text-[var(--color-text)]">
                PromptGallery
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--color-text-muted)]">
              Discover and copy AI photo-editing prompts for Gemini, ChatGPT, Midjourney, and more.
            </p>
            <div className="mt-4 flex gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-accent"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--color-border)] pt-8 text-center text-sm text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} PromptGallery. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
