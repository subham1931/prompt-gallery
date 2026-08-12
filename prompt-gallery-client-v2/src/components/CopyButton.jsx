import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function CopyButton({ text, className = '' }) {
  const { requireAuth } = useAuth()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    requireAuth(async () => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch {
        setCopied(false)
      }
    })
  }

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.1 }}
      className={`inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover active:bg-accent-hover ${className}`}
    >
      {copied ? (
        <>
          <Check size={16} />
          Copied!
        </>
      ) : (
        <>
          <Copy size={16} />
          Copy
        </>
      )}
    </motion.button>
  )
}
