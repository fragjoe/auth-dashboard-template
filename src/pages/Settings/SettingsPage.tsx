import { User, Bell, Shield, Database, SignOut } from '@phosphor-icons/react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { signOut } from '@/api/auth'

export function SettingsPage() {
  const { user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <div className="p-4 lg:p-6 max-w-3xl">
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary-100 p-2 rounded-lg">
              <User weight="bold" className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Profil</h2>
              <p className="text-sm text-muted-foreground">Informasi akun Anda</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
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
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nama
              </label>
              <Input
                id="name"
                type="text"
                value={(user?.user_metadata?.full_name as string) || ''}
                placeholder="Masukkan nama Anda"
              />
            </div>
            <div className="flex justify-end">
              <Button>Simpan Perubahan</Button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Bell weight="bold" className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Notifikasi</h2>
              <p className="text-sm text-muted-foreground">Pengaturan notifikasi</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Terima notifikasi via email</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-primary" />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Payment Reminders</p>
                <p className="text-sm text-muted-foreground">Pengingat jadwal pembayaran</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-primary" />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Contract Alerts</p>
                <p className="text-sm text-muted-foreground">Peringatan kontrak akan berakhir</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-primary" />
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-2 rounded-lg">
              <Shield weight="bold" className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Keamanan</h2>
              <p className="text-sm text-muted-foreground">Pengaturan keamanan akun</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="old_password" className="text-sm font-medium text-gray-700">
                Password Lama
              </label>
              <Input
                id="old_password"
                type="password"
                placeholder="Masukkan password lama"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="new_password" className="text-sm font-medium text-gray-700">
                Password Baru
              </label>
              <Input
                id="new_password"
                type="password"
                placeholder="Masukkan password baru"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">
                Konfirmasi Password
              </label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="Konfirmasi password baru"
              />
            </div>
            <div className="flex justify-end">
              <Button>Update Password</Button>
            </div>
          </div>
        </div>

        {/* Database Info */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Database weight="bold" className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Database</h2>
              <p className="text-sm text-muted-foreground">Informasi koneksi Supabase</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-green-600 font-medium">Terhubung</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">URL:</span>
              <span className="text-foreground font-mono text-xs">
                {import.meta.env.VITE_SUPABASE_URL || 'Not configured'}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white border border-red-200 rounded-lg p-6">
          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="w-full"
          >
            <SignOut weight="bold" className="w-5 h-5 mr-2" />
            Keluar / Logout
          </Button>
        </div>

        {/* Version Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Property Manager v1.0.0</p>
          <p className="mt-1">Built with React, Vite, TypeScript, Tailwind, Supabase</p>
        </div>
      </div>
    </div>
  )
}
