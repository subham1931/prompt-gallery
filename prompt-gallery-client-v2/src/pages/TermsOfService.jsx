import StaticPageLayout from '../components/StaticPageLayout'

export default function TermsOfService() {
  return (
    <StaticPageLayout
      title="Terms of Service"
      subtitle="Last updated: August 2026 • Orion Systems Platform"
      breadcrumb="Terms of Service"
    >
      <section className="space-y-2">
        <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">1. Platform License</h2>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          By accessing Orion Prompts, you are granted a non-exclusive license to utilize, copy, and deploy generative AI prompts for personal, commercial, and client production workflows.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">2. Acceptable Use</h2>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <li>Prompts are free for copy and commercial use.</li>
          <li>Mass scraping or automated reselling of raw database contents without authorization is prohibited.</li>
        </ul>
      </section>
    </StaticPageLayout>
  )
}
