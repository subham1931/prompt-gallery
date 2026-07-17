import { Card } from './ui/Card'
import { Field } from './ui/Field'
import { TextInput } from './ui/TextInput'
import { Pills } from './ui/Pills'
import { Toggle } from './ui/Toggle'
import { AI_MODELS, CATEGORIES } from '../utils/seo'

export function TitleUrlCard({
  title,
  setTitle,
  slug,
  setSlug,
  setSlugEdited,
  aiModel,
  setAiModel,
  category,
  setCategory,
  tags,
  setTags,
  trending,
  setTrending,
}) {
  return (
    <Card title="Details" description="Title, URL, model, and gallery metadata.">
      <Field label="Prompt title" required counter={`${title.length}/70`}>
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} maxLength={70} />
      </Field>

      <Field label="URL slug" hint="Auto-generated from the title — edit to override.">
        <div className="flex gap-2">
          <div className="flex shrink-0 items-center whitespace-nowrap rounded-[10px] bg-[#F1F2F5] px-3 text-[12.5px] text-mute-light">
            /prompts/
          </div>
          <TextInput
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugEdited(true)
            }}
            className="flex-1"
          />
        </div>
      </Field>

      <Field
        label="AI model"
        hint="Rank one model per page — pages that mix models rarely rank for either search."
      >
        <Pills value={aiModel} onChange={setAiModel} options={AI_MODELS} />
      </Field>

      <Field label="Category" hint="Primary gallery category for this prompt.">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full cursor-pointer rounded-[10px] border border-border bg-[#FCFCFD] px-[13px] py-2.5 text-[13.5px] text-ink outline-none transition-[border-color,box-shadow] focus:border-orange focus:bg-white focus:shadow-[0_0_0_3px_var(--color-orange-tint)]"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Tags" hint="Comma-separated tags shown on the gallery card.">
        <TextInput
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Portraits, Cinematic, Realistic"
        />
      </Field>

      <Toggle
        checked={trending}
        onChange={setTrending}
        label="Mark as trending"
        sub='Adds "Trending" to the title/meta and signals freshness to Google'
      />
    </Card>
  )
}
