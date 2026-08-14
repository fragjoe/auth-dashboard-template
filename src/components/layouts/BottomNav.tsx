import { Link, useLocation } from 'react-router-dom'
import { Building2, Calendar, User, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Properti', href: '/properties', icon: Building2 },
  { name: 'Kalender', href: '/calendar', icon: Calendar, disabled: true },
  { name: 'Penyewa', href: '/tenants', icon: User, disabled: true },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primary/20 safe-bottom pb-6 shadow-[0_-4px_20px_rgba(5,150,105,0.1)]">
      <div className="flex h-20 items-start justify-around pt-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href)
          if (item.disabled) {
            return (
              <div
                key={item.name}
                className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs text-muted-foreground opacity-50"
              >
                <item.icon className="w-6 h-6" />
                <span>{item.name}</span>
              </div>
            )
          }
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-all duration-200',
                isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
              )}
            >
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-t-full" />
              )}
              <item.icon className={cn('w-6 h-6 transition-transform', isActive && 'scale-110')} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
