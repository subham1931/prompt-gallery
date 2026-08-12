import StaticPageLayout from '../components/StaticPageLayout'
import { Sparkles, Cpu, Layers, CheckCircle } from 'lucide-react'

export default function About() {
  return (
    <StaticPageLayout
      title="About Prompt Gallery"
      subtitle="A next-generation liquid intelligence platform engineered for AI prompt curation, parameters optimization, and seamless deployment."
      breadcrumb="About"
    >
      <section className="rounded-3xl border border-white/80 dark:border-slate-800 bg-orange-50/50 dark:bg-orange-950/30 p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-extrabold text-xs uppercase tracking-widest">
          <Sparkles size={16} />
          <span>OUR CORE MISSION</span>
        </div>
        <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
          Real-Time Intelligence for Generative AI
        </h2>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Prompt Gallery helps creators, engineers, and AI artists discover studio-tested prompts for tools like Midjourney v6, OpenAI ChatGPT DALL-E 3, and Google Gemini. Every prompt in our system is benchmarked across lighting, style, and camera parameters so you achieve photorealistic results instantly.
        </p>
      </section>

      <section className="space-y-4 pt-4">
        <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
          Platform Architecture
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4 space-y-2">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-xs">
              <Cpu size={15} /> Multi-Model Support
            </div>
            <p className="text-xs text-slate-500">
              Prompts tailored with parameter flags (`--ar 16:9`, `--v 6.0`, lighting depth).
            </p>
          </div>

          <div className="rounded-2xl border border-white/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4 space-y-2">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-xs">
              <Layers size={15} /> Curated Libraries
            </div>
            <p className="text-xs text-slate-500">
              15+ aesthetic categories ranging from Cyberpunk to Architecture and Portraits.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3 pt-4">
        <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
          Engineered for Performance
        </h2>
        <ul className="space-y-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <CheckCircle size={15} className="text-orange-600 dark:text-orange-400" />
            <span>One-click copy with instant terminal feedback</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={15} className="text-orange-600 dark:text-orange-400" />
            <span>Responsive 3D perspective modules & masonry visual showcase</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={15} className="text-orange-600 dark:text-orange-400" />
            <span>Light white and Dark black glassmorphism themes with minimal orange glow</span>
          </li>
        </ul>
      </section>
    </StaticPageLayout>
  )
}
