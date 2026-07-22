import { AdminHeader } from '../components/AdminHeader'
import { CategoriesSection } from '../components/CategoriesSection'
import { Toast } from '../components/ui/Toast'
import { useToast } from '../hooks/useToast'

export default function Categories() {
  const { toasts, pushToast } = useToast()

  return (
    <div className="min-h-screen bg-bg text-ink">
      <AdminHeader />

      <div className="mx-auto max-w-[1180px] px-4 pt-5 pb-28 sm:px-6 sm:pt-[26px] md:pb-20 md:pl-20">
        <div className="mb-5">
          <h1 className="m-0 text-xl font-bold tracking-[-0.02em]">Categories</h1>
          <p className="mt-1 mb-0 text-[13px] text-mute">
            Manage gallery categories used when creating prompts.
          </p>
        </div>

        <CategoriesSection onToast={pushToast} />
      </div>

      <Toast toasts={toasts} />
    </div>
  )
}
