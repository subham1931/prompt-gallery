import StaticPageLayout from '../components/StaticPageLayout'

export default function TermsOfService() {
  return (
    <StaticPageLayout
      title="Terms of Service"
      subtitle="Last updated: November 2025"
      breadcrumb="Terms of Service"
    >
      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Agreement</h2>
        <p className="mt-2">
          By accessing or using PromptGallery, you agree to these Terms of Service. If
          you do not agree, please do not use the platform.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Use of the service</h2>
        <ul className="mt-3 list-inside list-disc space-y-2">
          <li>PromptGallery provides AI photo-editing prompts for personal and commercial creative use</li>
          <li>You may copy and use prompts in compatible AI tools at your own discretion</li>
          <li>You may not scrape, redistribute, or resell the prompt library without permission</li>
          <li>You may not use the service for unlawful, harmful, or abusive purposes</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Content & prompts</h2>
        <p className="mt-2">
          Prompts are provided as-is for creative inspiration. PromptGallery does not
          guarantee specific results from any AI tool. You are responsible for reviewing
          AI-generated output and ensuring it complies with applicable laws and platform
          policies.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Submissions</h2>
        <p className="mt-2">
          If you submit a prompt for inclusion in the library, you grant PromptGallery a
          non-exclusive license to display, distribute, and modify the submission for
          platform purposes. You represent that you have the right to submit the content.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Disclaimer</h2>
        <p className="mt-2">
          PromptGallery is provided "as is" without warranties of any kind. We are not
          liable for any damages arising from your use of the service or AI-generated
          content produced using our prompts.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Changes</h2>
        <p className="mt-2">
          We may update these terms from time to time. Continued use of PromptGallery
          after changes constitutes acceptance of the revised terms.
        </p>
      </section>
    </StaticPageLayout>
  )
}
