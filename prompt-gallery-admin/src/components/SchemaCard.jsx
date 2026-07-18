import { Code2 } from 'lucide-react'
import { Card } from './ui/Card'
import { Checkbox } from './ui/Checkbox'
import { SCHEMAS } from '../utils/seo'

export function SchemaCard({ schemaChecks, onToggle, onGenerate }) {
  const enabled = SCHEMAS.filter((s) => schemaChecks[s]).length

  return (
    <Card
      title="Schema"
      description={`${enabled} of ${SCHEMAS.length} enabled`}
      defaultOpen={false}
    >
      <div className="mb-4 flex flex-col gap-2.5">
        {SCHEMAS.map((s) => (
          <Checkbox
            key={s}
            checked={schemaChecks[s]}
            onChange={() => onToggle(s)}
            label={s}
          />
        ))}
      </div>

      {schemaChecks.Article && schemaChecks.BlogPosting && (
        <p className="mb-4 text-xs leading-normal text-red">
          Avoid Article and BlogPosting together — pick one.
        </p>
      )}

      <button
        type="button"
        onClick={onGenerate}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-surface py-2 text-[13px] font-medium text-ink transition-colors hover:bg-surface-muted"
      >
        <Code2 size={14} /> Generate JSON-LD
      </button>
    </Card>
  )
}
