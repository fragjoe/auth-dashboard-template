import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, LogOut, Menu, X } from 'lucide-react'
import { signOut } from '@/api/auth'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Properti', href: '/properties' },
  { name: 'Penyewa', href: '/tenants' },
  { name: 'Pengaturan', href: '/settings' },
]

export function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  // Get current page title
  const currentPage = navigation.find(item => location.pathname.startsWith(item.href))
  const pageTitle = currentPage?.name || 'Dashboard'

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 lg:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left: Menu Button + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
        </div>

        {/* Right: Bell Icon - Placeholder */}
        <button className="p-2 -mr-2 rounded-lg hover:bg-gray-100 relative">
          <Bell className="w-5 h-5 text-gray-600" />
          {/* Placeholder badge */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-gray-400 rounded-full" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
              <span className="text-xl font-bold text-gray-900">PropManager</span>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center px-3 py-2.5 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Bottom: Sign Out */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
