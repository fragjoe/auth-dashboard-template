import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, ArrowLeft, MoreVertical, Pencil, Copy, Trash2 } from 'lucide-react'
import { useDeleteProperty } from '@/hooks/useProperties'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/AlertDialog'

const navigation = [
  { name: 'Daftar Properti', href: '/properties', title: 'Daftar Properti' },
  { name: 'Penyewa', href: '/tenants' },
  { name: 'Pengaturan', href: '/settings' },
]

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const deleteProperty = useDeleteProperty()
  const { toast } = useToast()
  const { user, isLoading } = useAuth()

  const path = location.pathname

  // Check if this is a property detail page
  const isPropertyDetail = () => {
    const id = path.split('/').pop()
    // Don't show as property detail if: new page, edit page, or currently deleting
    return path.match(/^\/properties\/[^/]+$/) && !path.endsWith('/edit') && id !== 'new' && !deleteProperty.isPending
  }

  // Check if this is a room detail page (flat URL /rooms/[id])
  const isRoomDetail = () => {
    return path.match(/^\/rooms\/[^/]+$/)
  }

  // Check if this is a property detail page (exclude "new" route and during delete)
  const shouldShowPropertyMenu = () => {
    const id = path.split('/').pop()
    return path.match(/^\/properties\/[^/]+$/) && !path.endsWith('/edit') && id !== 'new' && !deleteProperty.isPending
  }

  // Determine page title based on route
  const getPageTitle = () => {
    if (path === '/properties/new') return 'Tambah Properti'
    if (path.match(/^\/properties\/[^/]+\/edit$/)) return 'Edit Properti'
    if (isRoomDetail()) return 'Detail Kamar'
    if (shouldShowPropertyMenu()) return 'Detail Properti'
    if (path === '/tenants/new') return 'Tambah Penyewa'

    const currentPage = navigation.find(item => path.startsWith(item.href))
    return currentPage?.title || currentPage?.name || 'Dashboard'
  }

  // Check if this is a main page (show Hi greeting with avatar)
  const isMainPage = () => {
    return (
      path === '/properties' ||
      path === '/tenants' ||
      path === '/calendar' ||
      path === '/'
    )
  }

  // Get first name from user metadata
  const getFirstName = () => {
    if (!user) return 'User'
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'User'
    return fullName.split(' ')[0]
  }

  // Get avatar URL from user metadata
  const getAvatarUrl = () => {
    if (!user) return ''
    return user.user_metadata?.avatar_url || user.user_metadata?.picture || ''
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user) return 'U'
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'U'
    return fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Check if back button is needed
  const needsBackButton = () => {
    return (
      path === '/properties/new' ||
      path.match(/^\/properties\/[^/]+\/edit$/) ||
      isPropertyDetail() ||
      isRoomDetail() ||
      path === '/tenants/new' ||
      path === '/settings'
    )
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const pageTitle = getPageTitle()
  const showBack = needsBackButton()
  const showPropertyMenu = shouldShowPropertyMenu()
  const showGreeting = isMainPage()
  const firstName = getFirstName()
  const avatarUrl = getAvatarUrl()
  const initials = getInitials()

  // Get property ID from path for edit/delete actions
  const propertyId = shouldShowPropertyMenu() ? path.split('/').pop() : null

  const handleEdit = () => {
    setShowMenu(false)
    if (propertyId) {
      navigate(`/properties/${propertyId}/edit`)
    }
  }

  const handleDelete = () => {
    setShowMenu(false)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (propertyId) {
      try {
        await deleteProperty.mutateAsync(propertyId)
        toast('Properti berhasil dihapus', 'success')
        setShowDeleteConfirm(false)
        setShowMenu(false)
        navigate('/properties', { replace: true })
      } catch (error) {
        toast('Gagal menghapus properti', 'error')
        setShowDeleteConfirm(false)
      }
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-primary border-b border-white/10">
        <div className="lg:pl-64 flex items-center justify-between h-16 px-4">
          {/* Left: Back button (if needed) + Title */}
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={() => {
                  navigate(-1)
                }}
                className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            {showGreeting ? (
              isLoading ? (
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded" />
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate('/settings')
                  }}
                  className="flex items-center gap-3 hover:bg-white/10 rounded-lg p-1 -ml-1 transition-colors"
                >
                  <Avatar size="sm" className="ring-2 ring-white/50">
                    <AvatarImage src={avatarUrl} alt={firstName} />
                    <AvatarFallback className="bg-white/20 text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <h1 className="text-lg font-semibold text-white">Hi, {firstName}</h1>
                </button>
              )
            ) : (
              <h1 className="text-lg font-semibold text-white truncate">{pageTitle}</h1>
            )}
          </div>

          {/* Right: Menu or Bell */}
          <div className="relative" ref={menuRef}>
            {showPropertyMenu ? (
              <>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-white" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-border py-1 z-50">
                    <button
                      onClick={handleEdit}
                      className="flex items-center w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Pencil className="w-4 h-4 mr-3 text-muted-foreground" />
                      Edit
                    </button>
                    <button
                      disabled
                      className="flex items-center w-full px-4 py-2 text-left text-sm text-muted-foreground cursor-not-allowed opacity-50"
                    >
                      <Copy className="w-4 h-4 mr-3" />
                      Duplikasi
                      <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Segera</span>
                    </button>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={handleDelete}
                      className="flex items-center w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Hapus
                    </button>
                  </div>
                )}
              </>
            ) : (path === '/properties' || path === '/tenants') ? (
              <button className="p-2 -mr-2 rounded-lg hover:bg-white/10 relative">
                <Bell className="w-5 h-5 text-white fill-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Properti</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus properti ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteProperty.isPending}
            >
              {deleteProperty.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
