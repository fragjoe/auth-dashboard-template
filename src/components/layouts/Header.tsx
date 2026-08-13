import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, ArrowLeft, DotsThreeVertical, PencilSimple, Copy, Trash } from '@phosphor-icons/react'
import { useProperty, useDeleteProperty } from '@/hooks/useProperties'
import { useRoom } from '@/hooks/useRooms'
import { useToast } from '@/components/ui/Toast'
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

  const path = location.pathname

  // Check if this is a property detail page (exclude /properties/new)
  const isPropertyDetail = () => {
    const isNewProperty = path === '/properties/new'
    return !isNewProperty && path.match(/^\/properties\/[^/]+$/) && !path.endsWith('/edit') && !path.includes('/rooms/')
  }

  // Check if this is a room detail page
  const isRoomDetail = () => {
    return path.match(/^\/properties\/[^/]+\/rooms\/[^/]+$/)
  }

  // Get property and room data
  const propertyId = isPropertyDetail() ? path.split('/').pop() : null
  const { data: property } = useProperty(propertyId || '')

  const roomPathMatch = path.match(/^\/properties\/([^/]+)\/rooms\/([^/]+)$/)
  const roomPropertyId = roomPathMatch ? roomPathMatch[1] : null
  const roomId = roomPathMatch ? roomPathMatch[2] : null
  const { data: room } = useRoom(roomPropertyId || '', roomId || '')

  // Determine page title based on route
  const getPageTitle = () => {
    if (path === '/properties/new') return 'Tambah Properti'
    if (path.match(/^\/properties\/[^/]+\/edit$/)) return 'Edit Properti'
    if (isRoomDetail() && room) {
      const roomName = room.room_type
        ? `${room.room_type} - Kamar ${room.room_number}`
        : `Kamar ${room.room_number}`
      return roomName
    }
    if (isRoomDetail()) return 'Detail Kamar'
    if (isPropertyDetail() && property) return property.name
    if (isPropertyDetail()) return 'Detail Properti'
    if (path === '/tenants/new') return 'Tambah Penyewa'

    const currentPage = navigation.find(item => path.startsWith(item.href))
    return currentPage?.title || currentPage?.name || 'Dashboard'
  }

  // Check if back button is needed
  const needsBackButton = () => {
    return (
      path === '/properties/new' ||
      path.match(/^\/properties\/[^/]+\/edit$/) ||
      isPropertyDetail() ||
      isRoomDetail() ||
      path === '/tenants/new'
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
  const showPropertyMenu = isPropertyDetail()

  // Check if on main pages (show bell)
  const isMainPage = () => {
    return (
      path === '/properties' ||
      path === '/tenants' ||
      path === '/settings'
    )
  }

  const handleEdit = () => {
    setShowMenu(false)
    if (propertyId) navigate(`/properties/${propertyId}/edit`)
  }

  const handleDuplicate = () => {
    // Fitur duplikat belum tersedia
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
        navigate('/properties', { replace: true })
      } catch (error) {
        toast('Gagal menghapus properti', 'error')
        setShowDeleteConfirm(false)
      }
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left: Back button (if needed) + Title */}
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft weight="bold" className="w-5 h-5 text-foreground" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-foreground truncate">{pageTitle}</h1>
          </div>

          {/* Right: Menu or Bell */}
          <div className="relative" ref={menuRef}>
            {showPropertyMenu ? (
              <>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <DotsThreeVertical weight="bold" className="w-5 h-5 text-foreground" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-lg border border-border py-1 z-50">
                    <button
                      onClick={handleEdit}
                      className="flex items-center w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <PencilSimple weight="bold" className="w-4 h-4 mr-3 text-muted-foreground" />
                      Edit Properti
                    </button>
                    <button
                      onClick={handleDuplicate}
                      disabled
                      className="flex items-center w-full px-4 py-2 text-left text-sm text-muted-foreground cursor-not-allowed opacity-50"
                    >
                      <Copy weight="bold" className="w-4 h-4 mr-3" />
                      Duplikat Properti
                      <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Segera</span>
                    </button>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={handleDelete}
                      className="flex items-center w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash weight="bold" className="w-4 h-4 mr-3" />
                      Hapus Properti
                    </button>
                  </div>
                )}
              </>
            ) : isMainPage() ? (
              <button className="p-2 -mr-2 rounded-lg hover:bg-muted relative">
                <Bell weight="bold" className="w-5 h-5 text-foreground" />
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
