import { Select } from './ui/Select'
import { ChevronDown } from 'lucide-react'
import { Card } from './ui/Card'
import { Field } from './ui/Field'
import { TextInput } from './ui/TextInput'
import { Pills } from './ui/Pills'
import { Toggle } from './ui/Toggle'
import { DateTimePicker } from './ui/DateTimePicker'
import { AI_MODELS, CATEGORIES } from '../utils/seo'

export function TitleUrlCard({
  title = '',
  setTitle,
  slug = '',
  setSlug,
  setSlugEdited,
  aiModel = 'ChatGPT',
  setAiModel,
  category = 'Cinematic',
  setCategory,
  tags = '',
  setTags,
  trending = false,
  setTrending,
  status = 'published',
  setStatus,
  scheduledAt = '',
  setScheduledAt,
  errors = {},
  categories = CATEGORIES,
}) {
  const categoryOptions = categories?.length ? categories : CATEGORIES
  const titleStr = title || ''
  const slugStr = slug || ''
  const tagsStr = tags || ''
  return (
    <Card title="Details" description="Title, URL, model, and gallery metadata.">
      <div className="flex flex-col gap-5">
      {setStatus && (
        <Field
          label="Status"
          hint={
            status === 'scheduled'
              ? 'This prompt will automatically publish at the scheduled date & time.'
              : undefined
          }
          error={errors.scheduledAt}
        >
          <div className="flex flex-col gap-3">
            <Pills
              value={status === 'draft' ? 'Draft' : status === 'scheduled' ? 'Scheduled' : 'Published'}
              onChange={(v) => {
                if (v === 'Draft') setStatus('draft')
                else if (v === 'Scheduled') setStatus('scheduled')
                else setStatus('published')
              }}
              options={['Published', 'Draft', 'Scheduled']}
            />

            {status === 'scheduled' && setScheduledAt && (
              <DateTimePicker
                value={scheduledAt}
                onChange={setScheduledAt}
                error={Boolean(errors.scheduledAt)}
              />
            )}
          </div>
        </Field>
      )}

      <Field
        label="Prompt title"
        required
        counter={`${titleStr.length}/70`}
        error={errors.title}
      >
        <TextInput
          value={titleStr}
          error={Boolean(errors.title)}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={70}
        />
      </Field>

      <Field
        label="URL slug"
        hint={!errors.slug ? 'Auto-generated from the title — edit to override.' : undefined}
        error={errors.slug}
      >
        <div className="flex gap-2">
          <div className="flex shrink-0 items-center whitespace-nowrap rounded-[10px] bg-surface-subtle px-3 text-[12.5px] text-mute-light">
            /prompts/
          </div>
          <TextInput
            value={slugStr}
            error={Boolean(errors.slug)}
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
        hint="Select one or multiple AI models compatible with this prompt."
      >
        <Pills value={aiModel} onChange={setAiModel} options={AI_MODELS} multiple={true} />
      </Field>

      <Field
        label="Category"
        hint={!errors.category ? 'Primary gallery category for this prompt.' : undefined}
        error={errors.category}
      >
        <Select
          value={category}
          onChange={setCategory}
          options={categoryOptions}
        />
      </Field>

      <Field label="Tags" hint="Comma-separated tags shown on the gallery card.">
        <TextInput
          value={tagsStr}
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
      </div>
    </Card>
  )
}
