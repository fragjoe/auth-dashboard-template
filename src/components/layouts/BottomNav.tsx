import { Link, useLocation } from 'react-router-dom'
import { Home, Building2, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Properti', href: '/properties', icon: Building2 },
  { name: 'Penyewa', href: '/tenants', icon: Users },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs',
                isActive ? 'text-primary-600' : 'text-gray-500'
              )}
            >
              <item.icon className="w-6 h-6" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
