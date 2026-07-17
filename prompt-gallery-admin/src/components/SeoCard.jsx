import { Check, Loader2, Wand2 } from 'lucide-react'
import { Card } from './ui/Card'
import { Field } from './ui/Field'
import { TextInput, TextArea } from './ui/TextInput'
import { Pills } from './ui/Pills'
import { buildSeoChecklist } from '../utils/seo'

export function SeoCard({
  seoScore,
  metaTitle,
  setMetaTitle,
  metaDesc,
  setMetaDesc,
  focusKeyword,
  setFocusKeyword,
  secondaryKeywords,
  setSecondaryKeywords,
  canonicalUrl,
  setCanonicalUrl,
  robots,
  setRobots,
  ogTitle,
  setOgTitle,
  ogDesc,
  setOgDesc,
  featuredAlt,
  aiModel,
  schemaChecks,
  generatingSeo,
  onGenerateSeo,
}) {
  const checklist = buildSeoChecklist({
    metaTitle,
    metaDesc,
    focusKeyword,
    featuredAlt,
    aiModel,
    schemaChecks,
  })
  const passed = checklist.filter((c) => c.ok).length

  return (
    <Card
      title="SEO"
      description={`${passed}/${checklist.length} checks · score ${seoScore}`}
      collapsible={false}
      right={
        <span
          className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
            seoScore >= 80
              ? 'bg-green-tint text-green'
              : seoScore >= 50
                ? 'bg-orange-tint text-orange-dark'
                : 'bg-[#FEECEC] text-red'
          }`}
        >
          {seoScore}
        </span>
      }
    >
      <div className="mb-4 flex flex-col gap-1.5">
        {checklist.map((c) => (
          <div
            key={c.label}
            className={`flex items-center gap-2 text-[12px] ${
              c.ok ? 'text-ink' : 'text-mute-light'
            }`}
          >
            <span
              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ${
                c.ok ? 'bg-green-tint text-green' : 'bg-[#F1F2F5] text-mute-light'
              }`}
            >
              <Check size={9} strokeWidth={3} />
            </span>
            {c.label}
          </div>
        ))}
      </div>

      <Field label="Meta title" counter={`${metaTitle.length}/60`}>
        <TextInput
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          maxLength={70}
        />
      </Field>

      <Field label="Meta description" counter={`${metaDesc.length}/160`}>
        <TextArea
          value={metaDesc}
          onChange={(e) => setMetaDesc(e.target.value)}
          rows={3}
          maxLength={170}
        />
      </Field>

      <Field label="Focus keyword">
        <TextInput value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} />
      </Field>

      <Field label="Secondary keywords" hint="Comma-separated">
        <TextInput
          value={secondaryKeywords}
          onChange={(e) => setSecondaryKeywords(e.target.value)}
        />
      </Field>

      <Field label="Canonical URL">
        <TextInput
          value={canonicalUrl}
          onChange={(e) => setCanonicalUrl(e.target.value)}
          placeholder="https://promptgallery.com/prompts/..."
        />
      </Field>

      <Field label="Robots">
        <Pills value={robots} onChange={setRobots} options={['Index', 'NoIndex']} />
      </Field>

      <Field label="Open Graph title">
        <TextInput value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} />
      </Field>

      <Field label="Open Graph description">
        <TextArea value={ogDesc} onChange={(e) => setOgDesc(e.target.value)} rows={2} />
      </Field>

      <button
        type="button"
        onClick={onGenerateSeo}
        disabled={generatingSeo}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-white py-2 text-[13px] font-medium text-ink transition-colors hover:bg-[#F8F9FB] disabled:cursor-wait disabled:opacity-70"
      >
        {generatingSeo ? (
          <Loader2 size={14} className="animate-spin-slow" />
        ) : (
          <Wand2 size={14} />
        )}
        {generatingSeo ? 'Generating…' : 'Generate SEO from details'}
      </button>
    </Card>
  )
}
