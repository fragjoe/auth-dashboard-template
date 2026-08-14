import { useState } from 'react'
import { User, Database, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { signOut } from '@/api/auth'
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

export function SettingsPage() {
  const { user } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Mask URL for security
  const maskUrl = (url: string) => {
    if (!url) return 'Not configured'
    if (url.length <= 20) return url
    const start = url.substring(0, 8)
    const end = url.substring(url.length - 6)
    return `${start}...${end}`
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <div className="p-4 lg:p-6 max-w-3xl content-fade-in">
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary-100 p-2 rounded-2xl">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Profil</h2>
              <p className="text-sm text-muted-foreground">Informasi akun Anda</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Nama
              </label>
              <Input
                id="name"
                type="text"
                value={(user?.user_metadata?.full_name as string) || ''}
                placeholder="Masukkan nama Anda"
                readOnly
              />
            </div>
            <div className="flex justify-end">
              <Button>Simpan</Button>
            </div>
          </div>
        </div>

        {/* Database Info */}
        <div className="bg-white border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 p-2 rounded-2xl">
              <Database className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Database</h2>
              <p className="text-sm text-muted-foreground">Informasi koneksi Supabase</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-emerald-600 font-medium">Terhubung</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">URL:</span>
              <span className="text-foreground font-mono text-xs select-none" title={import.meta.env.VITE_SUPABASE_URL || ''}>
                {maskUrl(import.meta.env.VITE_SUPABASE_URL || '')}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Keluar
        </Button>

        {/* Version Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Property Manager v1.0.0</p>
          <p className="mt-1">Built with React, Vite, TypeScript, Tailwind, Supabase</p>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar dari Aplikasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar? Anda perlu login kembali untuk mengakses aplikasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLogoutConfirm(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleSignOut}
            >
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
