# Prompt Gallery Admin

CMS for creating and SEO-optimizing prompts for the public gallery.

## Run

```bash
npm install
npm run dev
```

Opens on [http://localhost:5174](http://localhost:5174).

## Routes

| Path | Page |
|------|------|
| `/` | Prompts dashboard |
| `/prompts/new` | Create / edit prompt (SEO editor) |

## Editor sections

Same sections as the PromptArtify CMS template:

1. **Prompt text** — copyable prompt body
2. **Title & URL** — title, slug, AI model, category, tags, trending
3. **Images** — upload, alt, title, filename
4. **Schema** — Article / FAQPage / Breadcrumb / BlogPosting
5. **SEO** — score, checklist, meta + OG fields, generate SEO
6. **SEO preview** — Google + Open Graph cards
