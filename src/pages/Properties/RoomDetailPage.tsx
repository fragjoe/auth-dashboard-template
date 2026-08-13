import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Door, Users, CurrencyCircleDollar, FileText, CircleNotch } from '@phosphor-icons/react'
import { useRoom } from '@/hooks/useRooms'
import { useTenants } from '@/hooks/useTenants'
import { usePrices } from '@/hooks/usePrices'
import { useCreateTenant } from '@/hooks/useTenants'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { getRoomStatusBadge, formatCurrency } from '@/lib/utils'

type TabType = 'details' | 'price' | 'tenant' | 'history'

export function RoomDetailPage() {
  const { propertyId, roomId } = useParams<{ propertyId: string; roomId: string }>()
  const navigate = useNavigate()

  const { data: room } = useRoom(propertyId!, roomId!)
  const { data: tenants } = useTenants({ room_id: roomId })
  const { data: prices } = usePrices({ room_id: roomId })
  const createTenant = useCreateTenant()

  const [activeTab, setActiveTab] = useState<TabType>('details')
  const [showAddTenantModal, setShowAddTenantModal] = useState(false)
  const [newTenant, setNewTenant] = useState({
    name: '',
    phone: '',
    email: '',
  })

  const statusBadge = room ? getRoomStatusBadge(room.status) : null
  const activeTenant = tenants?.find(t => t.status === 'active')
  const defaultPrice = prices?.find(p => p.is_default)

  const handleAddTenant = async () => {
    if (!newTenant.name || !newTenant.phone || !propertyId || !roomId) return

    await createTenant.mutateAsync({
      name: newTenant.name,
      phone: newTenant.phone,
      email: newTenant.email || undefined,
      property_id: propertyId,
      room_id: roomId,
      start_date: new Date().toISOString(),
      start_time: '14:00',
      end_time: '12:00',
      status: 'active',
      rental_price_id: defaultPrice?.id,
    })

    setShowAddTenantModal(false)
    setNewTenant({ name: '', phone: '', email: '' })
  }

  if (!room) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-foreground">Kamar tidak ditemukan</h2>
        <Button className="mt-4" onClick={() => navigate(`/properties/${propertyId}`)}>
          Kembali
        </Button>
      </div>
    )
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'details', label: 'Detail' },
    { id: 'price', label: 'Harga' },
    { id: 'tenant', label: 'Penyewa' },
    { id: 'history', label: 'Riwayat' },
  ]

  const roomName = room.room_type
    ? `${room.room_type} - Kamar ${room.room_number}`
    : `Kamar ${room.room_number}`

  return (
    <div className="p-4 lg:p-6 max-w-4xl">
      {/* Room Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary-100 p-3 rounded-lg">
            <Door weight="bold" className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-foreground">{roomName}</h2>
              {statusBadge && (
                <Badge className={statusBadge.color}>
                  {statusBadge.label}
                </Badge>
              )}
            </div>
            {room.floor && (
              <p className="text-sm text-muted-foreground mt-1">Lantai {room.floor}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="bg-white border rounded-lg p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nomor Kamar</p>
                <p className="font-medium text-foreground">{room.room_number}</p>
              </div>
              {room.room_type && (
                <div>
                  <p className="text-sm text-muted-foreground">Tipe Kamar</p>
                  <p className="font-medium text-foreground">{room.room_type}</p>
                </div>
              )}
              {room.floor && (
                <div>
                  <p className="text-sm text-muted-foreground">Lantai</p>
                  <p className="font-medium text-foreground">{room.floor}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium text-foreground">{statusBadge?.label}</p>
              </div>
            </div>

            {room.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Deskripsi</p>
                <p className="text-foreground">{room.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'price' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Harga Sewa</h3>
            <Button size="sm" variant="outline">
              Tambah Harga
            </Button>
          </div>

          {defaultPrice ? (
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(defaultPrice.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    per {(defaultPrice.interval_type as string) === 'month' ? 'bulan' : 'minggu'}
                  </p>
                </div>
                <Badge variant="default">Default</Badge>
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-6 text-center">
              <CurrencyCircleDollar weight="bold" className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada harga sewa</p>
              <Button variant="outline" size="sm" className="mt-4">
                Tambah Harga
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tenant' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Penyewa</h3>
            <Button
              size="sm"
              onClick={() => setShowAddTenantModal(true)}
              disabled={!!activeTenant}
            >
              Tambah Penyewa
            </Button>
          </div>

          {activeTenant ? (
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <Users weight="bold" className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{activeTenant.name}</p>
                  <p className="text-sm text-muted-foreground">{activeTenant.phone}</p>
                  {activeTenant.email && (
                    <p className="text-sm text-muted-foreground">{activeTenant.email}</p>
                  )}
                </div>
                <Badge variant="default">Aktif</Badge>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 rounded-lg border border-dashed">
              <Users weight="bold" className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">Kamar kosong</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white border rounded-lg p-6 text-center">
          <FileText weight="bold" className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Belum ada riwayat</p>
        </div>
      )}

      {/* Add Tenant Modal */}
      <Modal
        isOpen={showAddTenantModal}
        onClose={() => setShowAddTenantModal(false)}
        title="Tambah Penyewa"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="tenant_name" className="text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <Input
              id="tenant_name"
              value={newTenant.name}
              onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
              placeholder="Masukkan nama penyewa"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="tenant_phone" className="text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>
            <Input
              id="tenant_phone"
              value={newTenant.phone}
              onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="tenant_email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="tenant_email"
              type="email"
              value={newTenant.email}
              onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
              placeholder="email@contoh.com"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAddTenantModal(false)}>
              Batal
            </Button>
            <Button onClick={handleAddTenant} disabled={createTenant.isPending}>
              {createTenant.isPending ? (
                <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {createTenant.isPending ? 'Memproses...' : 'Simpan'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
