import { Link, useLocation } from 'react-router-dom'
import { Home, Building2, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Properti',
    href: '/properties',
    icon: Building2,
  },
  {
    name: 'Penyewa',
    href: '/tenants',
    icon: Users,
  },
  {
    name: 'Pengaturan',
    href: '/settings',
    icon: Settings,
  },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full",
                isActive
                  ? "text-primary-600"
                  : "text-gray-500"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
