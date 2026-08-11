import { type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Building2,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'
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

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Sidebar - Always visible on desktop (lg+) */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:bg-white lg:shadow-lg lg:z-30">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">PropManager</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 px-3">
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
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Layout */}
      <div className="lg:ml-64">
        {/* Mobile Header */}
        <Header />

        {/* Mobile Bottom Nav */}
        <BottomNav />

        {/* Main content */}
        <main className="min-h-screen pb-24 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export { Layout }
