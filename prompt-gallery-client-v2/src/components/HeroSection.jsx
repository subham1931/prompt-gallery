import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Layers, Heart, Eye, Copy, Check } from 'lucide-react'

const FEATURED_MODULES = [
  {
    id: 1,
    badge: 'MODULE 01 • DETECT & GENERATE',
    title: 'Neon Cyberpunk Explorer',
    category: 'Cyberpunk',
    slug: 'cyberpunk-explorer',
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
    slug: 'cinematic-portrait-master',
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
    slug: 'biophilic-eco-tower',
    model: 'Stable Diffusion XL',
    prompt: 'Futuristic eco-tower skyscraper with hanging vertical gardens, golden hour light, glass facade, architectural rendering by Zaha Hadid, dramatic atmospheric fog',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    likes: 980,
    copies: 2410,
  },
]

export default function HeroSection() {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(1)
  const [copiedId, setCopiedId] = useState(null)

  const handleCopy = (e, item) => {
    e.stopPropagation()
    navigator.clipboard.writeText(item.prompt)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section className="relative overflow-hidden pt-4 sm:pt-6 md:pt-8 pb-12 md:pb-20">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Headlines & Call-to-Actions */}
          <div className="flex flex-col items-start lg:col-span-6 text-left">
            {/* Main Headline */}
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl lg:leading-[1.08]">
              Next-Gen <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                Prompt Systems.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-6 max-w-2xl text-sm font-normal leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              Engineered for creators, developers, and AI artists. Search, curate, and deploy high-performance generative prompts with unified real-time parameter controls.
            </p>

            {/* CTAs */}
            <div className="mt-6 sm:mt-8 flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#gallery-grid"
                className="inline-flex justify-center items-center gap-2 rounded-full bg-slate-900 px-6 sm:px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-600 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Prompts</span>
                <ArrowRight size={15} />
              </a>

              <Link
                to="/libraries"
                className="glass-card inline-flex justify-center items-center gap-2 rounded-full px-6 sm:px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white hover:bg-white/60 dark:hover:bg-slate-800/80 transition-all"
              >
                <Layers size={15} className="text-orange-500" />
                <span>View Libraries</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Interactive Prompt Stack */}
          <div className="lg:col-span-6 pt-4 lg:pt-0">
            <div className="relative min-h-[380px] sm:min-h-[480px] flex flex-col items-center justify-center perspective-1000">
              
              {/* Stack Cards Fan */}
              <div className="relative w-full flex items-center justify-center min-h-[350px] sm:min-h-[420px]">
                {FEATURED_MODULES.map((item, index) => {
                  const isActive = index === activeIndex
                  const isLeft = index < activeIndex
                  const isRight = index > activeIndex

                  let transformClass = 'scale-100 opacity-100 z-30 translate-x-0 rotate-0 shadow-2xl'
                  if (isLeft) {
                    transformClass = '-translate-x-3 sm:-translate-x-20 scale-90 opacity-60 z-10 -rotate-y-12 shadow-lg hover:opacity-80'
                  } else if (isRight) {
                    transformClass = 'translate-x-3 sm:translate-x-20 scale-90 opacity-60 z-10 rotate-y-12 shadow-lg hover:opacity-80'
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveIndex(index)}
                      className={`absolute w-full max-w-[310px] xs:max-w-xs sm:max-w-md transition-all duration-500 ease-out cursor-pointer transform-style-3d ${transformClass}`}
                    >
                      <div className="glass-card rounded-3xl overflow-hidden border border-white/80 dark:border-slate-800 p-3.5 sm:p-5 space-y-3 sm:space-y-3.5 shadow-2xl">
                        
                        {/* Header Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400 truncate max-w-[190px]">
                            {item.badge}
                          </span>
                          <span className="rounded-full bg-slate-900/5 dark:bg-white/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold text-slate-700 dark:text-slate-200 shrink-0">
                            {item.model}
                          </span>
                        </div>

                        {/* Image Preview Container */}
                        <div className="relative h-36 sm:h-48 rounded-2xl overflow-hidden group">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                          
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-white">
                                {item.category}
                              </span>
                              <h3 className="font-display text-sm sm:text-base font-extrabold mt-1 truncate max-w-[200px]">{item.title}</h3>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleCopy(e, item)}
                              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-orange-500 transition-colors shadow-lg shrink-0"
                            >
                              {copiedId === item.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>

                        {/* Prompt text snippet */}
                        <p className="text-[10px] sm:text-[11px] font-mono text-slate-600 dark:text-slate-300 line-clamp-2 bg-slate-100/80 dark:bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800">
                          "{item.prompt}"
                        </p>

                        {/* Footer metrics */}
                        <div className="flex items-center justify-between pt-0.5 text-xs font-bold text-slate-500">
                          <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px]">
                            <span className="flex items-center gap-1">
                              <Heart size={12} className="text-rose-500 fill-rose-500" /> {item.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={12} /> {item.copies} copies
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/prompt/${item.slug}`)
                            }}
                            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-extrabold text-orange-600 dark:text-orange-400 hover:underline"
                          >
                            <span>Details</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>

                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Stack Dots Navigation */}
              <div className="mt-3 sm:mt-4 flex justify-center gap-2">
                {FEATURED_MODULES.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? 'w-7 bg-orange-500 dark:bg-orange-500'
                        : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
