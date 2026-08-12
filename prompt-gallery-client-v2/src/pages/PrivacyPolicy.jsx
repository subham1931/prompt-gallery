import StaticPageLayout from '../components/StaticPageLayout'

export default function PrivacyPolicy() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle="Last updated: August 2026 • Orion Systems Platform"
      breadcrumb="Privacy Policy"
    >
      <section className="space-y-2">
        <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">1. Overview</h2>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Orion Prompts respects your privacy. This policy explains what information we collect, how we process it, and the choices you have regarding your session data.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">2. Telemetry & Data Collection</h2>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <li>Account credentials (encrypted name, email, password hashes) for optional profile authentication.</li>
          <li>Prompt interaction telemetry (like counts, bookmarks, search keywords) for system optimization.</li>
          <li>Local storage variables for dark/light glass theme state.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">3. Data Security</h2>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          We implement end-to-end encryption protocols and do not sell or transfer user credentials to external third parties.
        </p>
      </section>
    </StaticPageLayout>
  )
}
