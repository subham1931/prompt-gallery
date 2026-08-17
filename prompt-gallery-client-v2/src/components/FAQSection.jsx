import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react'
import { getFaqs } from '../api'

const DEFAULT_FAQS = [
  {
    _id: 'faq-1',
    question: 'What is Prompt Gallery and how do I use it?',
    answer:
      'Prompt Gallery is a curated repository of battle-tested AI prompts engineered specifically for Midjourney, ChatGPT, and Gemini. Simply click the "Copy" button on any prompt card, paste it directly into your AI generator, and press enter to produce high-quality AI images and text.',
  },
  {
    _id: 'faq-2',
    question: 'Are these prompts compatible with ChatGPT, Midjourney, and Gemini?',
    answer:
      'Yes! Every prompt in our collection is optimized for major AI models including Midjourney (v5 & v6), OpenAI ChatGPT (DALL-E 3), and Google Gemini Image generation. Each prompt is tagged with its primary target model.',
  },
  {
    _id: 'faq-3',
    question: 'Can I use generated images for commercial projects?',
    answer:
      'Absolutely. All prompts available on Prompt Gallery are free to use for personal, commercial, client, and commercial advertising projects without copyright restrictions.',
  },
  {
    _id: 'faq-4',
    question: 'How often is new content added to the gallery?',
    answer:
      'Our team and automated publishers add new studio-tested prompts daily across 15+ aesthetic categories including Cinematic, Portraits, Editorial Fashion, Landscapes, and Digital Art.',
  },
  {
    _id: 'faq-5',
    question: 'Do I need a paid subscription to access these prompts?',
    answer:
      'No subscription is required! You can browse, search, and copy any prompt in our library 100% free with 1-click copy functionality.',
  },
]

export default function FAQSection() {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS)
  const [openId, setOpenId] = useState('faq-1')

  useEffect(() => {
    getFaqs()
      .then((data) => {
        if (data && data.length) {
          setFaqs(data)
          setOpenId(data[0]._id || data[0].id)
        }
      })
      .catch(() => {})
  }, [])

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="relative py-16 lg:py-24 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-orange-600 dark:border-orange-900/50 dark:bg-orange-950/50 dark:text-orange-400 mb-4">
          <HelpCircle size={13} />
          <span>KNOWLEDGE BASE</span>
        </div>

        <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Frequently Asked Questions.
        </h2>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          Have questions about copying prompts or AI model compatibility? We’ve got answers.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        {faqs.map((faq, i) => {
          const faqId = faq._id || faq.id || `faq-${i}`
          const isOpen = openId === faqId

          return (
            <motion.div
              key={faqId}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card overflow-hidden rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? 'border-orange-500/50 dark:border-orange-500/40 shadow-xl'
                  : 'border-white/80 dark:border-slate-800'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(faqId)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left font-display text-base font-extrabold text-slate-900 dark:text-white"
              >
                <span className="flex items-center gap-3">
                  <Sparkles size={16} className={`shrink-0 ${isOpen ? 'text-orange-500 dark:text-orange-400' : 'text-slate-400'}`} />
                  {faq.question}
                </span>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isOpen
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <ChevronDown size={16} />
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
                    <div className="border-t border-slate-200/60 dark:border-slate-800/80 px-5 pt-3 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
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
