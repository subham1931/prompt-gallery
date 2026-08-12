import { Link } from 'react-router-dom'
import { Sparkles, Globe, Mail, Share2, Rss, ShieldCheck } from 'lucide-react'

const quickLinks = [
  { label: 'Explore Prompts', to: '/' },
  { label: 'Libraries Index', to: '/libraries' },
  { label: 'Platform Info', to: '/about' },
  { label: 'Contact Support', to: '/contact' },
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
    <footer className="relative border-t border-slate-200/60 dark:border-slate-800/80 pt-16 pb-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Footer Navigation Columns */}
        <div className="grid gap-10 md:grid-cols-12">
          
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md">
                <Sparkles size={18} className="text-orange-500 dark:text-orange-500" />
              </div>
              <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                prompt<span className="text-orange-500 dark:text-orange-400">-gallery</span>
              </span>
            </Link>
            
            <p className="max-w-md text-sm font-normal leading-relaxed text-slate-600 dark:text-slate-400">
              Engineered studio prompts for Midjourney v6, ChatGPT DALL-E 3, and Google Gemini Image generation. Optimized for high-resolution visual synthesis.
            </p>

            <div className="flex gap-2 pt-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-6 grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white">
                Platform
              </h4>
              <ul className="mt-4 space-y-2.5">
                {quickLinks.slice(0, 3).map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-xs font-semibold text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white">
                Legal & Support
              </h4>
              <ul className="mt-4 space-y-2.5">
                {quickLinks.slice(3).map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-xs font-semibold text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-slate-200/60 dark:border-slate-800/80 pt-8 text-center text-xs font-medium text-slate-400">
          © {new Date().getFullYear()} PROMPT GALLERY. All rights reserved. Liquid Intelligence Platform.
        </div>

      </div>
    </footer>
  )
}
