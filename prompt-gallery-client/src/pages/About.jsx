import StaticPageLayout from '../components/StaticPageLayout'

export default function About() {
  return (
    <StaticPageLayout
      title="About PromptGallery"
      subtitle="A curated library of AI photo-editing prompts, built for creators who care about quality."
      breadcrumb="About"
    >
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Our mission</h2>
        <p className="mt-2">
          PromptGallery helps photographers, designers, and AI enthusiasts discover
          high-quality prompts for tools like Gemini, ChatGPT, and Midjourney. Every
          prompt in our library is organized by style and category so you can find
          the right starting point in seconds.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">What we offer</h2>
        <ul className="mt-3 list-inside list-disc space-y-2">
          <li>Curated prompts across portraits, fashion, cinematic, lifestyle, and more</li>
          <li>One-click copy — paste directly into your AI tool of choice</li>
          <li>Organized libraries by style, subject, and aesthetic</li>
          <li>Regularly updated collection with trending and popular picks</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Built for creators</h2>
        <p className="mt-2">
          Whether you are producing editorial portraits, lifestyle content, or cinematic
          scenes, PromptGallery gives you a starting point that is already refined —
          so you spend less time experimenting and more time creating.
        </p>
      </section>
    </StaticPageLayout>
  )
}
