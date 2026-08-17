import { Faq } from '../models/Faq.js'

const DEFAULT_FAQS = [
  {
    question: 'What is Prompt Gallery and how do I use it?',
    answer:
      'Prompt Gallery is a curated repository of battle-tested AI prompts engineered specifically for Midjourney, ChatGPT, and Gemini. Simply click the "Copy" button on any prompt card, paste it directly into your AI generator, and press enter to produce high-quality AI images and text.',
    category: 'General',
    order: 1,
    status: 'published',
  },
  {
    question: 'Are these prompts compatible with ChatGPT, Midjourney, and Gemini?',
    answer:
      'Yes! Every prompt in our collection is optimized for major AI models including Midjourney (v5 & v6), OpenAI ChatGPT (DALL-E 3), and Google Gemini Image generation. Each prompt is tagged with its primary target model.',
    category: 'Compatibility',
    order: 2,
    status: 'published',
  },
  {
    question: 'Can I use generated images for commercial projects?',
    answer:
      'Absolutely. All prompts available on Prompt Gallery are free to use for personal, commercial, client, and commercial advertising projects without copyright restrictions.',
    category: 'Licensing',
    order: 3,
    status: 'published',
  },
  {
    question: 'How often is new content added to the gallery?',
    answer:
      'Our team and automated publishers add new studio-tested prompts daily across 15+ aesthetic categories including Cinematic, Portraits, Editorial Fashion, Landscapes, and Digital Art.',
    category: 'Updates',
    order: 4,
    status: 'published',
  },
  {
    question: 'Do I need a paid subscription to access these prompts?',
    answer:
      'No subscription is required! You can browse, search, and copy any prompt in our library 100% free with 1-click copy functionality.',
    category: 'Pricing',
    order: 5,
    status: 'published',
  },
]

export async function seedFaqsIfEmpty() {
  const count = await Faq.countDocuments()
  if (count === 0) {
    await Faq.insertMany(DEFAULT_FAQS)
    console.log('Seeded 5 default FAQs into database!')
  }
}
