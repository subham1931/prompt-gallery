import { AdminHeader } from '../components/AdminHeader'
import { CategoriesSection } from '../components/CategoriesSection'
import { Toast } from '../components/ui/Toast'
import { useToast } from '../hooks/useToast'

export default function Categories() {
  const { toasts, pushToast } = useToast()

  return (
    <div className="min-h-screen bg-bg text-ink">
      <AdminHeader />

      <div className="mx-auto max-w-[1180px] px-4 pt-6 pb-28 sm:px-6 md:pb-20 md:pl-20">
        <CategoriesSection onToast={pushToast} />
      </div>

      <Toast toasts={toasts} />
    </div>
  )
}
