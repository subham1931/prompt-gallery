import { Card } from './ui/Card'

export function PromptTextCard({ value, onChange }) {
  return (
    <Card title="Prompt" description="Copied when a user clicks Copy prompt.">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={7}
        placeholder="Paste or write the full prompt…"
        className="w-full resize-y rounded-lg border border-border bg-[#FCFCFD] px-3.5 py-3 font-mono text-[13px] leading-[1.65] text-ink outline-none transition-[border-color,box-shadow] focus:border-orange focus:bg-white focus:shadow-[0_0_0_3px_var(--color-orange-tint)]"
      />
      <div className="mt-2 text-right text-[11px] text-mute-light">{value.length} characters</div>
    </Card>
  )
}
