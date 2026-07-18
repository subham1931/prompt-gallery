import { Card } from './ui/Card'

export function PromptTextCard({ value, onChange, error }) {
  return (
    <Card title="Prompt" description="Copied when a user clicks Copy prompt.">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={7}
        placeholder="Paste or write the full prompt…"
        aria-invalid={Boolean(error) || undefined}
        className={`w-full resize-y rounded-lg border bg-surface-muted px-3.5 py-3 font-mono text-[13px] leading-[1.65] text-ink outline-none transition-[border-color,box-shadow] focus:bg-surface ${
          error
            ? 'border-red shadow-[0_0_0_3px_rgba(211,59,59,0.12)] focus:border-red'
            : 'border-border focus:border-orange focus:shadow-[0_0_0_3px_var(--color-orange-tint)]'
        }`}
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        {error ? (
          <p className="m-0 text-[11px] font-medium text-red">{error}</p>
        ) : (
          <span />
        )}
        <div className="text-[11px] text-mute-light">{value.length} characters</div>
      </div>
    </Card>
  )
}
