import StaticPageLayout from '../components/StaticPageLayout'

export default function PrivacyPolicy() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle="Last updated: November 2025"
      breadcrumb="Privacy Policy"
    >
      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Overview</h2>
        <p className="mt-2">
          PromptGallery respects your privacy. This policy explains what information we
          collect, how we use it, and the choices you have regarding your data.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Information we collect</h2>
        <ul className="mt-3 list-inside list-disc space-y-2">
          <li>Usage data such as pages visited, search queries, and interaction patterns</li>
          <li>Device and browser information for analytics and performance</li>
          <li>Information you voluntarily provide via contact or submission forms</li>
          <li>Theme preference stored locally in your browser</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">How we use your data</h2>
        <p className="mt-2">
          We use collected information to improve the PromptGallery experience, maintain
          platform security, respond to inquiries, and analyze usage trends. We do not
          sell your personal information to third parties.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Cookies & local storage</h2>
        <p className="mt-2">
          We use local storage to remember your theme preference (light or dark mode).
          No authentication cookies are used at this time as PromptGallery does not
          require user accounts.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Your rights</h2>
        <p className="mt-2">
          You may request access to, correction of, or deletion of your personal data
          by contacting us at hello@promptgallery.com. We will respond within a
          reasonable timeframe.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Contact</h2>
        <p className="mt-2">
          For privacy-related questions, reach us at hello@promptgallery.com.
        </p>
      </section>
    </StaticPageLayout>
  )
}
