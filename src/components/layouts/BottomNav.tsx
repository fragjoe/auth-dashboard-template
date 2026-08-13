import { Link, useLocation } from 'react-router-dom'
import { Buildings, CalendarBlank, User, Gear } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Properti', href: '/properties', icon: Buildings },
  { name: 'Kalender', href: '/calendar', icon: CalendarBlank, disabled: true },
  { name: 'Penyewa', href: '/tenants', icon: User },
  { name: 'Pengaturan', href: '/settings', icon: Gear },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="lg:hidden fixed bottom-1 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex h-24 items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href)
          if (item.disabled) {
            return (
              <div
                key={item.name}
                className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs text-gray-400"
              >
                <item.icon weight="regular" className="w-6 h-6" />
                <span>{item.name}</span>
              </div>
            )
          }
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs',
                isActive ? 'text-primary-600' : 'text-gray-500'
              )}
            >
              <item.icon weight={isActive ? 'fill' : 'regular'} className="w-6 h-6" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
