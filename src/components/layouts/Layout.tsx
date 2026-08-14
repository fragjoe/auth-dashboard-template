import { type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Building2, Calendar, User, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/api/auth'
import { Header } from './Header'
import { BottomNav } from './BottomNav'

const navigation = [
  { name: 'Daftar Properti', href: '/properties', icon: Building2 },
  { name: 'Kalender', href: '/calendar', icon: Calendar, disabled: true },
  { name: 'Penyewa', href: '/tenants', icon: User },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
]

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:bg-primary lg:shadow-xl">
        <div className="h-16 flex items-center px-6 border-b border-primary-foreground/20">
          <Link to="/dashboard" className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">PropManager</span>
          </Link>
        </div>

        <nav className="flex-1 mt-6 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="flex items-center px-3 py-2.5 mb-1 rounded-lg text-white/60 cursor-not-allowed"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              )
            }
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2.5 mb-1 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-white text-primary font-semibold shadow-md'
                    : 'text-white hover:bg-primary-foreground/10'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-primary-foreground/20">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2.5 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="lg:ml-64 flex flex-col min-h-screen w-full">
        <Header />
        <main className="pt-16 flex-1 pb-[120px] lg:pt-16 lg:pb-6 w-full overflow-y-auto no-scrollbar">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
