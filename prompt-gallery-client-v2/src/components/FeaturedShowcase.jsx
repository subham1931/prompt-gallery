import { useState } from 'react'
import { Sparkles, ArrowRight, Eye, Heart, Copy, Check } from 'lucide-react'

const FEATURED_MODULES = [
  {
    id: 1,
    badge: 'MODULE 01 • DETECT & GENERATE',
    title: 'Neon Cyberpunk Explorer',
    category: 'Cyberpunk',
    model: 'Midjourney v6.0',
    prompt: 'Hyper-detailed futuristic cyberpunk agent standing on a rain-slicked Tokyo rooftop, glowing neon signage reflections, holographic UI elements, anamorphic lens flare, 8k --ar 16:9',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    likes: 1420,
    copies: 3890,
  },
  {
    id: 2,
    badge: 'MODULE 02 • COMMAND CENTER',
    title: 'Cinematic Portrait Master',
    category: 'Portrait',
    model: 'DALL-E 3',
    prompt: 'Studio portrait of an elderly watchmaker with intricate gear reflections in glasses, Rembrandt lighting, ultra-realistic skin texture, 85mm f/1.4 lens depth of field',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    likes: 2150,
    copies: 5120,
  },
  {
    id: 3,
    badge: 'MODULE 03 • AUTOMATE & ACT',
    title: 'Biophilic Eco-Tower',
    category: 'Architecture',
    model: 'Stable Diffusion XL',
    prompt: 'Futuristic eco-tower skyscraper with hanging vertical gardens, golden hour light, glass facade, architectural rendering by Zaha Hadid, dramatic atmospheric fog',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    likes: 980,
    copies: 2410,
  },
]

export default function FeaturedShowcase({ onSelectPrompt }) {
  const [activeIndex, setActiveIndex] = useState(1)
  const [copiedId, setCopiedId] = useState(null)

  const handleCopy = (e, item) => {
    e.stopPropagation()
    navigator.clipboard.writeText(item.prompt)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-orange-600 dark:border-orange-900/50 dark:bg-orange-950/50 dark:text-orange-400 mb-4">
            <Sparkles size={13} />
            <span>3D PLATFORM MODULES</span>
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Interactive Prompt Stack.
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Hover or click to switch between active platform modules and inspect high-yield prompt configurations.
          </p>
        </div>

        {/* 3D Stack Container */}
        <div className="relative min-h-[480px] sm:min-h-[520px] flex items-center justify-center perspective-1000">
          <div className="relative w-full max-w-5xl flex items-center justify-center">
            {FEATURED_MODULES.map((item, index) => {
              const isActive = index === activeIndex
              const isLeft = index < activeIndex
              const isRight = index > activeIndex

              let transformClass = 'scale-100 opacity-100 z-30 translate-x-0 rotate-0 shadow-2xl'
              if (isLeft) {
                transformClass = '-translate-x-16 sm:-translate-x-36 scale-90 opacity-70 z-10 -rotate-y-12 shadow-lg hover:opacity-90'
              } else if (isRight) {
                transformClass = 'translate-x-16 sm:translate-x-36 scale-90 opacity-70 z-10 rotate-y-12 shadow-lg hover:opacity-90'
              }

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  className={`absolute w-full max-w-lg transition-all duration-500 ease-out cursor-pointer transform-style-3d ${transformClass}`}
                >
                  <div className="glass-card rounded-3xl overflow-hidden border border-white/80 dark:border-slate-800 p-6 space-y-4">
                    
                    {/* Header Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                        {item.badge}
                      </span>
                      <span className="rounded-full bg-slate-900/5 dark:bg-white/10 px-3 py-1 text-[11px] font-extrabold text-slate-700 dark:text-slate-200">
                        {item.model}
                      </span>
                    </div>

                    {/* Image Preview Container */}
                    <div className="relative h-52 sm:h-60 rounded-2xl overflow-hidden group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-white">
                            {item.category}
                          </span>
                          <h3 className="font-display text-lg font-bold mt-1.5">{item.title}</h3>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleCopy(e, item)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-orange-500 transition-colors shadow-lg"
                        >
                          {copiedId === item.id ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Prompt text snippet */}
                    <p className="text-xs font-mono text-slate-600 dark:text-slate-300 line-clamp-2 bg-slate-100/80 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800">
                      "{item.prompt}"
                    </p>

                    {/* Footer metrics */}
                    <div className="flex items-center justify-between pt-2 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Heart size={14} className="text-rose-500 fill-rose-500" /> {item.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} /> {item.copies} copies
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onSelectPrompt) onSelectPrompt(item)
                        }}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-orange-600 dark:text-orange-400 hover:underline"
                      >
                        <span>Details</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stack Dots Navigation */}
        <div className="mt-8 flex justify-center gap-2">
          {FEATURED_MODULES.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-8 bg-orange-500 dark:bg-orange-500'
                  : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
