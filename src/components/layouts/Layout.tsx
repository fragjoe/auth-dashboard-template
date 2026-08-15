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
function getPageDepth(pathname: string): number {
  if (['/properties', '/tenants', '/calendar', '/laporan', '/'].includes(pathname)) return 0
  if (['/properties/new', '/tenants/new'].includes(pathname)) return 1
  if (pathname.match(/^\/properties\/[^/]+$/) && !pathname.endsWith('/edit')) return 1
  if (pathname === '/settings') return 1
  if (pathname.match(/^\/properties\/[^/]+\/edit$/)) return 2
  if (pathname.match(/^\/rooms\/[^/]+$/)) return 2
  return 0
}

// Regular slide variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
}

// Settings variants - enters from left
const settingsVariants = {
  enter: () => ({ x: '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: () => ({ x: '-100%', opacity: 0 }),
}

// Pages that should maintain their state during exit animation
const PAGES_WITH_DYNAMIC_CONTENT = [
  '/properties',
  '/tenants',
]

function hasDynamicContent(pathname: string): boolean {
  return PAGES_WITH_DYNAMIC_CONTENT.some(p => pathname.startsWith(p))
}

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [displayPath, setDisplayPath] = useState(location.pathname)
  const [displayChildren, setDisplayChildren] = useState(children)
  const prevPathRef = useRef(location.pathname)
  const isTransitioningRef = useRef(false)

  const currentDepth = getPageDepth(location.pathname)
  const prevDepth = getPageDepth(prevPathRef.current)
  const prevPath = prevPathRef.current
  const direction = currentDepth >= prevDepth ? 1 : -1

  const isNavigatingToSettings = prevPath === '/properties' && location.pathname === '/settings'
  const isNavigatingFromSettings = prevPath === '/settings' && location.pathname === '/properties'
  const isSettings = location.pathname === '/settings'
  const shouldPreserveState = hasDynamicContent(prevPath)

  // Determine variants
  let variants = slideVariants
  if (isSettings) {
    variants = settingsVariants
  } else if (isNavigatingToSettings) {
<<<<<<< HEAD
    variants = {
      enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
      }),
      center: { x: 0, opacity: 1 },
      exit: () => ({ x: '100%', opacity: 0 }),
    }
  } else if (isNavigatingFromSettings) {
    variants = {
      enter: () => ({ x: '100%', opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (direction: number) => ({
        x: direction > 0 ? '-100%' : '100%',
        opacity: 0,
      }),
    }
=======
    variants = { ...slideVariants, exit: { x: '100%', opacity: 0 } }
  } else if (isNavigatingFromSettings) {
    variants = { ...slideVariants, enter: { x: '100%', opacity: 0 } }
>>>>>>> 457ee4a (Update layout and property pages)
  }

  // Handle navigation
  useEffect(() => {
    if (location.pathname === displayPath) return

    // Mark as transitioning
    isTransitioningRef.current = true

    // If we're preserving state (going back to main pages), keep the old page visible
    if (shouldPreserveState) {
      // Just update the display after animation
      const timer = setTimeout(() => {
        setDisplayPath(location.pathname)
        setDisplayChildren(children)
        isTransitioningRef.current = false
      }, ANIMATION_DURATION * 1000 + 50)

      return () => clearTimeout(timer)
    } else {
      // Normal transition - immediate swap
      setDisplayPath(location.pathname)
      setDisplayChildren(children)
      const timer = setTimeout(() => {
        isTransitioningRef.current = false
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [location.pathname])

  // Sync children when not transitioning
  useEffect(() => {
    if (!isTransitioningRef.current) {
      setDisplayChildren(children)
    }
  }, [children])

  useEffect(() => {
    prevPathRef.current = location.pathname
  }, [location.pathname])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

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
                <div key={item.name} className="flex items-center px-3 py-2.5 mb-1 rounded-lg text-white/60 cursor-not-allowed">
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
                  isActive ? 'bg-white text-primary font-semibold shadow-md' : 'text-white hover:bg-primary-foreground/10'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-primary-foreground/20">
          <button onClick={handleSignOut} className="flex items-center w-full px-3 py-2.5 text-white/80 hover:bg-white/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="lg:ml-64 flex flex-col min-h-screen w-full">
        <Header />
        <main className="relative flex-1">
          <AnimatePresence
            mode={isNavigatingToSettings || isNavigatingFromSettings ? 'sync' : 'wait'}
            initial={false}
            custom={direction}
          >
            <motion.div
              key={displayPath}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', ease: [0.25, 0.1, 0.25, 1], duration: ANIMATION_DURATION }}
              className="absolute inset-0 pt-16 pb-[120px] lg:pt-16 lg:pb-6 overflow-hidden"
              style={{ backgroundColor: 'hsl(var(--background))' }}
            >
              <div className="h-full overflow-y-auto no-scrollbar">
                {displayChildren}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
