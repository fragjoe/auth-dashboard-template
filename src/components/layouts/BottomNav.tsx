import { Link, useLocation } from 'react-router-dom'
import { Building2, Calendar, User, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Properti', href: '/properties', icon: Building2 },
  { name: 'Kalender', href: '/calendar', icon: Calendar, disabled: true },
  { name: 'Penyewa', href: '/tenants', icon: User },
  { name: 'Laporan', href: '/laporan', icon: FileText, disabled: true },
]

// Routes where bottom nav should be hidden
const hideBottomNavRoutes = [
  '/properties/new',
  '/tenants/new',
  '/settings',
]

// Pattern matchers for dynamic routes
const hideBottomNavPatterns = [
  /^\/properties\/[^/]+$/,           // /properties/:id
  /^\/properties\/[^/]+\/edit$/,     // /properties/:id/edit
  /^\/rooms\/[^/]+$/,                // /rooms/:id
]

export function BottomNav() {
  const location = useLocation()

  // Check if current route should hide bottom nav
  const shouldHideBottomNav = () => {
    const path = location.pathname

    // Check exact match routes
    if (hideBottomNavRoutes.includes(path)) {
      return true
    }

    // Check pattern match routes
    for (const pattern of hideBottomNavPatterns) {
      if (pattern.test(path)) {
        return true
      }
    }

    return false
  }

  const isHidden = shouldHideBottomNav()

  return (
    <AnimatePresence mode="wait">
      {!isHidden && (
        <motion.nav
          key="bottom-nav"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 40,
          }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primary/20 safe-bottom pb-6 shadow-[0_-4px_20px_rgba(5,150,105,0.1)]"
        >
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
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
