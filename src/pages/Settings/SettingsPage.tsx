import { User, Bell, Shield, Database, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-600 mt-1">Kelola akun dan preferensi Anda</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Profil</h2>
              <p className="text-sm text-gray-500">Informasi akun Anda</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={user?.email || ''}
              disabled
            />
            <Input
              label="Nama"
              type="text"
              value={(user?.user_metadata?.full_name as string) || ''}
              placeholder="Masukkan nama Anda"
            />
            <div className="flex justify-end">
              <Button>Simpan Perubahan</Button>
            </div>
          </CardBody>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Notifikasi</h2>
              <p className="text-sm text-gray-500">Pengaturan notifikasi</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Terima notifikasi via email</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600" />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Payment Reminders</p>
                  <p className="text-sm text-gray-500">Pengingat jadwal pembayaran</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600" />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Contract Alerts</p>
                  <p className="text-sm text-gray-500">Peringatan kontrak akan berakhir</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600" />
              </label>
            </div>
          </CardBody>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Keamanan</h2>
              <p className="text-sm text-gray-500">Pengaturan keamanan akun</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Password Lama"
              type="password"
              placeholder="Masukkan password lama"
            />
            <Input
              label="Password Baru"
              type="password"
              placeholder="Masukkan password baru"
            />
            <Input
              label="Konfirmasi Password"
              type="password"
              placeholder="Konfirmasi password baru"
            />
            <div className="flex justify-end">
              <Button>Update Password</Button>
            </div>
          </CardBody>
        </Card>

        {/* Database Info */}
        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Database</h2>
              <p className="text-sm text-gray-500">Informasi koneksi Supabase</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="text-green-600 font-medium">Terhubung</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">URL:</span>
                <span className="text-gray-900 font-mono text-xs">
                  {import.meta.env.VITE_SUPABASE_URL || 'Not configured'}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Logout Button */}
        <Card className="border-red-200">
          <CardBody>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Keluar / Logout</span>
            </button>
          </CardBody>
        </Card>

        {/* Version Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Property Manager v1.0.0</p>
          <p className="mt-1">Built with React, Vite, TypeScript, Tailwind, Supabase</p>
        </div>
      </div>
    </div>
  )
}
