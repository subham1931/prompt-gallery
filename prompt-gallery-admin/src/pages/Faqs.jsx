import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Search, HelpCircle, Save, X, Loader2 } from 'lucide-react'
import { AdminHeader } from '../components/AdminHeader'
import { listFaqs, createFaq, updateFaq, deleteFaq } from '../api/client'
import { useToast } from '../hooks/useToast'
import { ConfirmModal } from '../components/ui/ConfirmModal'

export default function Faqs() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('General')
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const { pushToast } = useToast()

  const loadFaqs = () => {
    setLoading(true)
    listFaqs({ search })
      .then(({ data }) => setFaqs(data || []))
      .catch((err) => pushToast(err.message || 'Failed to load FAQs', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadFaqs()
  }, [search])

  const openCreateModal = () => {
    setEditingFaq(null)
    setQuestion('')
    setAnswer('')
    setCategory('General')
    setModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingFaq(item)
    setQuestion(item.question || '')
    setAnswer(item.answer || '')
    setCategory(item.category || 'General')
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!question.trim() || !answer.trim()) {
      pushToast('Question and Answer are required', 'error')
      return
    }

    setSaving(true)
    try {
      if (editingFaq) {
        await updateFaq(editingFaq._id || editingFaq.id, { question, answer, category })
        pushToast('FAQ updated successfully')
      } else {
        await createFaq({ question, answer, category })
        pushToast('FAQ created successfully')
      }
      setModalOpen(false)
      loadFaqs()
    } catch (err) {
      pushToast(err.message || 'Failed to save FAQ', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteFaq(deleteTarget._id || deleteTarget.id)
      pushToast('FAQ deleted successfully')
      setFaqs((prev) => prev.filter((f) => (f._id || f.id) !== (deleteTarget._id || deleteTarget.id)))
      setDeleteTarget(null)
    } catch (err) {
      pushToast(err.message || 'Failed to delete FAQ', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <AdminHeader />

      <div className="mx-auto max-w-[1180px] px-4 pt-5 pb-28 sm:px-6 sm:pt-6 md:pb-20 md:pl-20">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">FAQ Management</h1>
            <p className="mt-1 text-xs text-zinc-400">
              Create, edit, and organize frequently asked questions for Prompt Gallery
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-orange px-4 text-xs font-semibold uppercase tracking-wider text-white hover:bg-orange-dark transition-colors cursor-pointer border-none"
          >
            <Plus size={16} />
            <span>Add New FAQ</span>
          </button>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
          <Search size={18} className="text-zinc-400 shrink-0 ml-1" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs by question or answer keywords..."
            className="w-full bg-transparent text-xs font-medium text-zinc-100 outline-none placeholder:text-zinc-500"
          />
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-zinc-400">Loading FAQ list...</div>
        ) : faqs.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-12 text-center">
            <HelpCircle size={36} className="mx-auto mb-3 text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-100">No FAQs found</h3>
            <p className="mt-1 text-xs text-zinc-400">Click "Add New FAQ" to create your first question & answer.</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-orange px-4 py-2 text-xs font-semibold text-white border-none cursor-pointer"
            >
              <Plus size={14} /> Add FAQ Item
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <div
                key={faq._id || faq.id}
                className="group relative flex flex-col justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700 sm:flex-row sm:items-start"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                      {faq.category || 'General'}
                    </span>
                    <h3 className="text-sm font-semibold text-zinc-100">{faq.question}</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-300">{faq.answer}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => openEditModal(faq)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                    title="Edit FAQ"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(faq)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-red-900/40 bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors cursor-pointer"
                    title="Delete FAQ"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-semibold text-zinc-50">
                  {editingFaq ? 'Edit FAQ Item' : 'Create New FAQ Item'}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-md p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors border-none cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="General, Prompts, Account, Pricing..."
                    className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Question <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter frequent question..."
                    className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Answer <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={4}
                    placeholder="Enter detailed clear answer..."
                    className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 p-3 text-xs text-zinc-100 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors border-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-md bg-orange px-5 py-2 text-xs font-semibold text-white hover:bg-orange-dark transition-colors border-none cursor-pointer disabled:opacity-60"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>{editingFaq ? 'Save Changes' : 'Create FAQ'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete FAQ Item"
          description={'Are you sure you want to delete this FAQ question? This action cannot be undone.'}
          confirmLabel={deleting ? 'Deleting...' : 'Delete FAQ'}
          isDestructive
        />
      </div>
    </div>
  )
}
