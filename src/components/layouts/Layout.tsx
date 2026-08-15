import { type ReactNode, useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Building2, Calendar, User, FileText, LogOut } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { signOut } from '@/api/auth'
import { Header } from './Header'
import { BottomNav } from './BottomNav'

const navigation = [
  { name: 'Daftar Properti', href: '/properties', icon: Building2 },
  { name: 'Kalender', href: '/calendar', icon: Calendar, disabled: true },
  { name: 'Penyewa', href: '/tenants', icon: User },
  { name: 'Laporan', href: '/laporan', icon: FileText, disabled: true },
]

// Animation constants
const ANIMATION_DURATION = 0.3

// Define page depth based on URL patterns
// Higher depth = more "nested" the page is
function getPageDepth(pathname: string): number {
  // Root/main pages = depth 0
  if (['/properties', '/tenants', '/calendar', '/laporan', '/'].includes(pathname)) {
    return 0
  }

  // "New" pages = depth 1 (same level as root but forward motion)
  if (['/properties/new', '/tenants/new'].includes(pathname)) {
    return 1
  }

  // First-level detail pages = depth 1
  if (pathname.match(/^\/properties\/[^/]+$/) && !pathname.endsWith('/edit')) {
    return 1
  }
  if (pathname === '/settings') {
    return 1
  }

  // Second-level detail pages (edit, nested) = depth 2
  if (pathname.match(/^\/properties\/[^/]+\/edit$/)) {
    return 2
  }
  if (pathname.match(/^\/rooms\/[^/]+$/)) {
    return 2
  }

  return 0
}

// Slide variants - enters from right, exits to left (iOS native feel)
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
}

// Settings drawer variants - enters from LEFT (where avatar is), exits to left
const settingsVariants = {
  enter: {
    x: '-100%',
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: '-100%',
    opacity: 0,
  },
}

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const prevPathRef = useRef(location.pathname)

  // Calculate depth for current path
  const currentDepth = getPageDepth(location.pathname)
  const prevDepth = getPageDepth(prevPathRef.current)

  // Determine animation direction
  const direction = currentDepth >= prevDepth ? 1 : -1

  // Check if this is settings page (special drawer behavior)
  const isSettings = location.pathname === '/settings'

  // Update prev ref after render
  useEffect(() => {
    prevPathRef.current = location.pathname
  }, [location.pathname])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  const variants = isSettings ? settingsVariants : slideVariants

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:bg-primary lg:shadow-xl">
        <div className="h-16 flex items-center px-6 border-b border-primary-foreground/20">
          <Link to="/properties" className="flex items-center gap-3">
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
        <main className="relative flex-1">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={location.pathname}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: 'tween',
                ease: [0.25, 0.1, 0.25, 1],
                duration: ANIMATION_DURATION,
              }}
              className="absolute inset-0 pt-16 pb-[120px] lg:pt-16 lg:pb-6 overflow-hidden bg-background"
            >
              <div className="h-full overflow-y-auto no-scrollbar">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
