import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-[var(--color-text-muted)]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={item.label} className="flex items-center gap-1">
            {index > 0 && <ChevronRight size={14} className="shrink-0" />}
            {isLast ? (
              <span className="font-medium text-[var(--color-text)]">{item.label}</span>
            ) : item.to ? (
              <Link to={item.to} className="transition-colors hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
