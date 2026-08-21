import { useEffect } from 'react'

export default function SeoHead({
  title,
  metaTitle,
  description,
  metaDesc,
  canonicalUrl,
  robots = 'index, follow',
  ogTitle,
  ogDesc,
  image,
  type = 'website',
  publishedTime,
  author,
  faqs = [],
  schemaChecks = {},
  breadcrumbItems = [],
}) {
  useEffect(() => {
    // 1. Dynamic Page Title
    const finalTitle = (metaTitle || title || 'PromptGallery — AI Photo Editing Prompts').trim()
    document.title = finalTitle

    // 2. Helper to set/update meta tag
    const setMeta = (attrName, attrValue, contentValue) => {
      if (!contentValue) return
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attrName, attrValue)
        document.head.appendChild(el)
      }
      el.setAttribute('content', contentValue)
    }

    const finalDesc = (metaDesc || description || 'PromptGallery — Curated repository of battle-tested AI prompts engineered for Midjourney, ChatGPT, and Gemini.').trim()
    const finalOgTitle = (ogTitle || metaTitle || title || finalTitle).trim()
    const finalOgDesc = (ogDesc || metaDesc || description || finalDesc).trim()
    const finalCanonical = (canonicalUrl || window.location.href).trim()
    const finalRobots = (robots || 'index, follow').trim()

    // Primary Meta Description & Robots
    setMeta('name', 'description', finalDesc)
    setMeta('name', 'robots', finalRobots)

    // Open Graph Tags
    setMeta('property', 'og:title', finalOgTitle)
    setMeta('property', 'og:description', finalOgDesc)
    setMeta('property', 'og:url', finalCanonical)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', 'PromptGallery')
    if (image) setMeta('property', 'og:image', image)

    // Twitter Card Tags
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', finalOgTitle)
    setMeta('name', 'twitter:description', finalOgDesc)
    if (image) setMeta('name', 'twitter:image', image)

    // Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', finalCanonical)

    // 3. Structured Data (JSON-LD Schemas)
    const jsonLdSchemas = []

    // A. Primary Article / CreativeWork / WebSite Schema
    if (type === 'article' && schemaChecks.Article !== false) {
      jsonLdSchemas.push({
        '@context': 'https://schema.org',
        '@type': schemaChecks.BlogPosting ? 'BlogPosting' : 'Article',
        headline: finalTitle,
        description: finalDesc,
        image: image ? [image] : [],
        datePublished: publishedTime || new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: author || 'Prompt Gallery Staff',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Prompt Gallery',
          url: window.location.origin,
          logo: {
            '@type': 'ImageObject',
            url: window.location.origin + '/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': finalCanonical,
        },
      })
    } else if (type === 'website') {
      jsonLdSchemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Prompt Gallery',
        url: window.location.origin,
        description: finalDesc,
      })
    }

    // B. FAQPage Schema
    if (faqs && faqs.length > 0 && schemaChecks.FAQPage !== false) {
      jsonLdSchemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      })
    }

    // C. BreadcrumbList Schema
    if (breadcrumbItems && breadcrumbItems.length > 0 && schemaChecks.Breadcrumb !== false) {
      jsonLdSchemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.label,
          item: item.to ? window.location.origin + item.to : window.location.href,
        })),
      })
    }

    // Inject JSON-LD Script tag in <head>
    let scriptEl = document.getElementById('seo-json-ld')
    if (!scriptEl) {
      scriptEl = document.createElement('script')
      scriptEl.id = 'seo-json-ld'
      scriptEl.setAttribute('type', 'application/ld+json')
      document.head.appendChild(scriptEl)
    }
    scriptEl.textContent = JSON.stringify(
      jsonLdSchemas.length === 1 ? jsonLdSchemas[0] : jsonLdSchemas
    )
  }, [
    title,
    metaTitle,
    description,
    metaDesc,
    canonicalUrl,
    robots,
    ogTitle,
    ogDesc,
    image,
    type,
    publishedTime,
    author,
    faqs,
    schemaChecks,
    breadcrumbItems,
  ])

  return null
}
