import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DoorOpen, Users, ArrowLeft, Loader2 } from 'lucide-react'
import { useRoomById } from '@/hooks/useRooms'
import { useTenants } from '@/hooks/useTenants'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { getRoomStatusBadge } from '@/lib/utils'

export function RoomDetailPage() {
  const { id: roomId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: room, isLoading: isLoadingRoom } = useRoomById(roomId || '')
  const { data: tenants } = useTenants({ room_id: roomId })

  const [showAddTenantModal, setShowAddTenantModal] = useState(false)
  const [newTenant, setNewTenant] = useState({
    name: '',
    phone: '',
    email: '',
  })

  const statusBadge = room ? getRoomStatusBadge(room.status) : null
  const activeTenant = tenants?.find(t => t.status === 'active')

  const roomName = room?.room_type
    ? `${room.room_type} - ${room.room_number}`
    : room?.room_number
      ? `Kamar ${room.room_number}`
      : 'Kamar'

  if (isLoadingRoom) {
    return (
      <div className="p-4 lg:p-6 max-w-3xl space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="p-4 lg:p-6 text-center">
        <h2 className="text-xl font-semibold text-foreground">Kamar tidak ditemukan</h2>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-3xl space-y-4 content-fade-in">
      {/* Header dengan Back button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-2xl hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 p-2 rounded-2xl">
            <DoorOpen className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{roomName}</h2>
            {statusBadge && (
              <Badge className={statusBadge.color}>{statusBadge.label}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Info Kamar */}
      <div className="bg-white border rounded-2xl p-4">
        <h3 className="font-semibold mb-3">Info Kamar</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Nomor</p>
            <p className="font-medium">{room.room_number}</p>
          </div>
          {room.floor && (
            <div>
              <p className="text-muted-foreground">Lantai</p>
              <p className="font-medium">{room.floor}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium">{statusBadge?.label}</p>
          </div>
        </div>
        {room.description && (
          <p className="mt-3 text-sm text-muted-foreground">{room.description}</p>
        )}
      </div>

      {/* Penyewa */}
      <div className="bg-white border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Penyewa</h3>
          </div>
          <Button
            size="sm"
            disabled={!!activeTenant}
            onClick={() => setShowAddTenantModal(true)}
          >
            <Loader2 className="w-4 h-4 mr-1" />
            Tambah
          </Button>
        </div>

        {activeTenant ? (
          <div className="flex items-center gap-3 p-3 rounded-2xl border">
            <div className="bg-primary-100 p-2 rounded-full">
              <Users className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{activeTenant.name}</p>
              <p className="text-xs text-muted-foreground">{activeTenant.phone}</p>
            </div>
            <Badge>Aktif</Badge>
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-2xl">
            Kamar kosong
          </div>
        )}
      </div>

      {/* Harga */}
      <div className="bg-white border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">Rp</span>
            <h3 className="font-semibold">Harga Sewa</h3>
          </div>
          <Button variant="ghost" size="sm">
            <Loader2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-2xl">
          Belum ada harga sewa
        </div>
      </div>

      {/* Biaya */}
      <div className="bg-white border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">kWh</span>
            <h3 className="font-semibold">Biaya Utilitas</h3>
          </div>
          <Button variant="ghost" size="sm">
            <Loader2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-2xl">
          Belum ada biaya utilitas
        </div>
      </div>

      {/* Add Tenant Modal (placeholder) */}
      <Modal
        isOpen={showAddTenantModal}
        onClose={() => setShowAddTenantModal(false)}
        title="Tambah Penyewa"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Lengkap</label>
            <Input
              value={newTenant.name}
              onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
              placeholder="Masukkan nama penyewa"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nomor Telepon</label>
            <Input
              value={newTenant.phone}
              onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddTenantModal(false)}>
              Batal
            </Button>
            <Button>
              Simpan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
