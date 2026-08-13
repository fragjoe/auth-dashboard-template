import { type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Buildings, CalendarBlank, User, Gear, SignOut } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { signOut } from '@/api/auth'
import { Header } from './Header'
import { BottomNav } from './BottomNav'

const navigation = [
  { name: 'Daftar Properti', href: '/properties', icon: Buildings },
  { name: 'Kalender', href: '/calendar', icon: CalendarBlank, disabled: true },
  { name: 'Penyewa', href: '/tenants', icon: User },
  { name: 'Pengaturan', href: '/settings', icon: Gear },
]

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:bg-white lg:shadow-lg">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-3">
            <Buildings weight="bold" className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">PropManager</span>
          </Link>
        </div>

        <nav className="flex-1 mt-6 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="flex items-center px-3 py-2.5 mb-1 rounded-lg text-gray-400 cursor-not-allowed"
                >
                  <item.icon weight="regular" className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              )
            }
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
                <item.icon weight={isActive ? 'bold' : 'regular'} className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <SignOut weight="bold" className="w-5 h-5 mr-3" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="lg:ml-64 flex flex-col min-h-screen w-full">
        <div className="pt-16 lg:pt-0">
          <Header />
          <main className="flex-1 pb-[120px] lg:pb-6 w-full overflow-y-auto no-scrollbar">
            {children}
          </main>
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
