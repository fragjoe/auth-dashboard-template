import { type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Building2,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { signOut } from '@/api/auth'
import { Header } from './Header'
import { BottomNav } from './BottomNav'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Properti', href: '/properties', icon: Building2 },
  { name: 'Penyewa', href: '/tenants', icon: Users },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
]

function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out hidden lg:block',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">PropManager</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2.5 mb-1 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Sign out */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <Header />

      {/* Mobile Bottom Nav */}
      <BottomNav />

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-6">
        {children}
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export { Layout }
