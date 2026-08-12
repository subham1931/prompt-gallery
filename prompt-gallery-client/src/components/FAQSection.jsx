import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react'

const FAQS = [
  {
    id: 'faq-1',
    question: 'What is Prompt Gallery and how do I use it?',
    answer:
      'Prompt Gallery is a curated repository of battle-tested AI prompts engineered specifically for Midjourney, ChatGPT, and Gemini. Simply click the "Copy" button on any prompt card, paste it directly into your AI generator, and press enter to produce high-quality AI images and text.',
  },
  {
    id: 'faq-2',
    question: 'Are these prompts compatible with ChatGPT, Midjourney, and Gemini?',
    answer:
      'Yes! Every prompt in our collection is optimized for major AI models including Midjourney (v5 & v6), OpenAI ChatGPT (DALL-E 3), and Google Gemini Image generation. Each prompt is tagged with its primary target model.',
  },
  {
    id: 'faq-3',
    question: 'Can I use generated images for commercial projects?',
    answer:
      'Absolutely. All prompts available on Prompt Gallery are free to use for personal, commercial, client, and commercial advertising projects without copyright restrictions.',
  },
  {
    id: 'faq-4',
    question: 'How often is new content added to the gallery?',
    answer:
      'Our team and automated publishers add new studio-tested prompts daily across 15+ aesthetic categories including Cinematic, Portraits, Editorial Fashion, Landscapes, and Digital Art.',
  },
  {
    id: 'faq-5',
    question: 'Do I need a paid subscription to access these prompts?',
    answer:
      'No subscription is required! You can browse, search, and copy any prompt in our library 100% free with 1-click copy functionality.',
  },
]

export default function FAQSection() {
  const [openId, setOpenId] = useState('faq-1')

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent"
        >
          <HelpCircle size={14} />
          Frequently Asked Questions
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl lg:text-4xl"
        >
          Everything you need to know about <span className="text-accent">Prompt Gallery</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-text-muted)] sm:text-base"
        >
          Have questions about copying prompts or AI model compatibility? We’ve got answers.
        </motion.p>
      </div>

      {/* Accordion Container */}
      <div className="mt-10 flex flex-col gap-3.5 sm:mt-12">
        {FAQS.map((faq, i) => {
          const isOpen = openId === faq.id

          return (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                isOpen
                  ? 'border-accent/40 bg-[var(--color-surface)] shadow-md shadow-accent/5'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)]/60 hover:border-[var(--color-border)]/80 hover:bg-[var(--color-surface)]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left text-sm font-bold text-[var(--color-text)] transition-colors sm:text-base"
              >
                <span className="flex items-center gap-3">
                  <Sparkles size={16} className={`shrink-0 ${isOpen ? 'text-accent' : 'text-[var(--color-text-muted)]'}`} />
                  {faq.question}
                </span>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isOpen
                      ? 'border-accent/30 bg-accent/10 text-accent'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]'
                  }`}
                >
                  <ChevronDown size={15} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <div className="border-t border-[var(--color-border)]/60 px-5 pt-3 pb-5 text-xs font-normal leading-relaxed text-[var(--color-text-muted)] sm:text-sm sm:leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
