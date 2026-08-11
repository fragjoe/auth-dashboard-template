import { useLocation } from 'react-router-dom'
import { Bell } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Properti', href: '/properties' },
  { name: 'Penyewa', href: '/tenants' },
  { name: 'Pengaturan', href: '/settings' },
]

export function Header() {
  const location = useLocation()

  // Get current page title
  const currentPage = navigation.find(item => location.pathname.startsWith(item.href))
  const pageTitle = currentPage?.name || 'Dashboard'

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 lg:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left: Title */}
        <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>

        {/* Right: Bell Icon - Placeholder */}
        <button className="p-2 -mr-2 rounded-lg hover:bg-gray-100 relative">
          <Bell className="w-5 h-5 text-gray-600" />
          {/* Placeholder badge */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-gray-400 rounded-full" />
        </button>
      </div>
    </header>
  )
}
