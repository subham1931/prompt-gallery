import { Plus, Trash2, HelpCircle, ChevronUp, ChevronDown } from 'lucide-react'
import { Card } from './ui/Card'
import { Field } from './ui/Field'
import { TextInput, TextArea } from './ui/TextInput'

export function FaqBuilderCard({ faqs = [], onChange }) {
  const handleAddFaq = () => {
    onChange([...faqs, { question: '', answer: '' }])
  }

  const handleUpdateFaq = (index, field, value) => {
    const updated = faqs.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    onChange(updated)
  }

  const handleRemoveFaq = (index) => {
    onChange(faqs.filter((_, i) => i !== index))
  }

  const handleMove = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= faqs.length) return
    const updated = [...faqs]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    onChange(updated)
  }

  return (
    <Card
      title="Frequently Asked Questions (FAQs)"
      description="Add Q&A pairs for FAQPage JSON-LD schema & client accordion displays."
    >
      <div className="flex flex-col gap-4">
        {faqs.length === 0 ? (
          <div className="rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 p-6 text-center text-xs text-zinc-400">
            <HelpCircle size={24} className="mx-auto mb-2 text-zinc-500" />
            <p className="font-medium text-zinc-300">No FAQ questions added yet.</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              Click "+ Add FAQ Item" below to create questions & answers for search engines and visitors.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group relative flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 transition-colors hover:border-zinc-700"
              >
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                    FAQ #{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={index === faqs.length - 1}
                      onClick={() => handleMove(index, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(index)}
                      className="ml-1 flex h-6 w-6 items-center justify-center rounded-md border border-red-900/40 bg-red-950/40 text-red-400 hover:bg-red-900/50 transition-colors cursor-pointer"
                      title="Delete FAQ Item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <Field label="Question">
                  <TextInput
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                    placeholder="e.g. How do I use this prompt in ChatGPT?"
                  />
                </Field>

                <Field label="Answer">
                  <TextArea
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                    rows={3}
                    placeholder="Provide a helpful, detailed answer..."
                  />
                </Field>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddFaq}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-zinc-800 bg-zinc-950 py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-50 cursor-pointer"
        >
          <Plus size={14} className="text-orange" />
          <span>Add FAQ Item</span>
        </button>
      </div>
    </Card>
  )
}
