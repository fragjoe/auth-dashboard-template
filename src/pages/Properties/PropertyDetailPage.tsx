import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, MapPin, Phone, House, Users, CircleNotch } from '@phosphor-icons/react'
import { useProperty } from '@/hooks/useProperties'
import { useRooms, useCreateRooms } from '@/hooks/useRooms'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { DetailPageSkeleton } from '@/components/ui/Skeleton'
import {
  formatPropertyType,
  formatCurrency,
  formatInterval,
  getRoomStatusBadge,
} from '@/lib/utils'
import type { RoomStatus } from '@/types/property'

type TabType = 'details' | 'rooms' | 'prices' | 'expenses' | 'tenants'

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: property, isLoading } = useProperty(id!)
  const { data: rooms } = useRooms(id!)
  const createRooms = useCreateRooms()

  const [activeTab, setActiveTab] = useState<TabType>('details')
  const [showAddRoomModal, setShowAddRoomModal] = useState(false)
  const [newRoom, setNewRoom] = useState({
    room_number: '',
    room_type: '',
    description: '',
    floor: '',
    count: 1,
  })

  const isPerRoom = property?.rental_type === 'per_room'
  const isPerProperty = property?.rental_type === 'per_property'

  const handleAddRooms = async () => {
    if (!newRoom.room_number || !id) return

    const roomsToCreate = []
    const count = parseInt(newRoom.count.toString()) || 1
    const baseNumber = parseInt(newRoom.room_number) || 1

    for (let i = 0; i < count; i++) {
      roomsToCreate.push({
        room_number: count > 1 ? `${baseNumber + i}` : newRoom.room_number,
        room_type: newRoom.room_type || undefined,
        description: newRoom.description || undefined,
        floor: newRoom.floor ? parseInt(newRoom.floor) : undefined,
        status: 'available' as RoomStatus,
      })
    }

    await createRooms.mutateAsync({ propertyId: id, rooms: roomsToCreate })
    setShowAddRoomModal(false)
    setNewRoom({ room_number: '', room_type: '', description: '', floor: '', count: 1 })
  }

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-7xl">
        <DetailPageSkeleton />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-foreground">Properti tidak ditemukan</h2>
        <Button className="mt-4" onClick={() => navigate('/properties')}>
          Kembali ke Daftar
        </Button>
      </div>
    )
  }

  // Tabs based on rental type
  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'details', label: 'Detail' },
  ]

  // Only show rooms tab for "per_room" type
  if (isPerRoom) {
    tabs.push({ id: 'rooms', label: 'Kamar', count: rooms?.length || 0 })
  }

  tabs.push(
    { id: 'prices', label: 'Harga Sewa', count: property.rental_prices?.length || 0 },
    { id: 'expenses', label: 'Biaya', count: property.expenses?.length || 0 },
    { id: 'tenants', label: 'Penyewa' }
  )

  return (
    <div className="p-4 lg:p-6 max-w-7xl content-fade-in">
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
              {tab.count !== undefined && (
                <span className="ml-2 text-sm bg-muted px-2 py-0.5 rounded-full">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="bg-white border rounded-lg p-6 space-y-4">
          {property.description && (
            <div>
              <h3 className="font-medium text-foreground mb-1">Deskripsi</h3>
              <p className="text-muted-foreground">{property.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-foreground mb-1">Tipe Properti</h3>
              <p className="text-muted-foreground">{formatPropertyType(property.type)}</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Jenis Sewa</h3>
              <p className="text-muted-foreground">{isPerRoom ? 'Per Kamar' : 'Per Properti'}</p>
            </div>
          </div>

          {(property.address || property.city || property.province) && (
            <div className="flex items-start gap-3">
              <MapPin weight="bold" className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground mb-1">Lokasi</h3>
                <p className="text-muted-foreground">
                  {[property.address, property.district, property.city, property.province, property.postal_code]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </div>
          )}

          {property.phone && (
            <div className="flex items-center gap-3">
              <Phone weight="bold" className="w-5 h-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium text-foreground mb-1">Telepon</h3>
                <p className="text-muted-foreground">{property.phone}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rooms' && isPerRoom && (
        <div className="scale-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Daftar Kamar</h2>
            <Button onClick={() => setShowAddRoomModal(true)}>
              <Plus weight="bold" className="w-4 h-4 mr-2" />
              Tambah Kamar
            </Button>
          </div>

          {rooms && rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-fade-in">
              {rooms.map((room) => {
                const statusBadge = getRoomStatusBadge(room.status)
                return (
                  <div
                    key={room.id}
                    className="p-4 rounded-lg border bg-white hover:bg-muted/50 hover:border-primary cursor-pointer transition-all duration-200 card-hover"
                    onClick={() => navigate(`/properties/${id}/rooms/${room.id}`)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">Kamar {room.room_number}</h3>
                        {room.room_type && (
                          <p className="text-sm text-muted-foreground">{room.room_type}</p>
                        )}
                      </div>
                      <Badge className={statusBadge.color}>
                        {statusBadge.label}
                      </Badge>
                    </div>
                    {room.floor && (
                      <p className="text-sm text-muted-foreground">Lantai {room.floor}</p>
                    )}
                    {room.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{room.description}</p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-dashed content-fade-in">
              <House weight="bold" className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada kamar</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowAddRoomModal(true)}>
                Tambah Kamar Pertama
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'prices' && (
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Harga Sewa</h2>
            <Button variant="outline" size="sm">
              <Plus weight="bold" className="w-4 h-4 mr-2" />
              Tambah Harga
            </Button>
          </div>

          {property.rental_prices && property.rental_prices.length > 0 ? (
            <div className="space-y-3">
              {property.rental_prices.map((price) => (
                <div
                  key={price.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {formatCurrency(price.amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">{formatInterval(price.interval_type)}</p>
                  </div>
                  {price.is_default && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">Default</Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">Belum ada harga sewa</p>
          )}
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Biaya Utilitas</h2>
            <Button variant="outline" size="sm">
              <Plus weight="bold" className="w-4 h-4 mr-2" />
              Tambah Biaya
            </Button>
          </div>

          {property.expenses && property.expenses.length > 0 ? (
            <div className="space-y-3">
              {property.expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground capitalize">{expense.expense_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(expense.rate)} / {expense.unit?.replace('_', ' ')}
                    </p>
                  </div>
                  <Badge className={expense.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                    {expense.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">Belum ada biaya utilitas</p>
          )}
        </div>
      )}

      {activeTab === 'tenants' && (
        <div className="scale-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {isPerProperty ? 'Penyewa Properti' : 'Daftar Penyewa'}
            </h2>
            <Button onClick={() => navigate(`/tenants/new?property_id=${id}`)}>
              <Plus weight="bold" className="w-4 h-4 mr-2" />
              Tambah Penyewa
            </Button>
          </div>

          <div className="text-center py-12 rounded-lg border border-dashed content-fade-in">
            <Users weight="bold" className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {isPerProperty
                ? 'Belum ada penyewa untuk properti ini'
                : 'Pilih kamar untuk melihat penyewanya'}
            </p>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isPerRoom && (
        <Modal
          isOpen={showAddRoomModal}
          onClose={() => setShowAddRoomModal(false)}
          title="Tambah Kamar"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="room_number" className="text-sm font-medium text-gray-700">
                  Nomor Kamar
                </label>
                <Input
                  id="room_number"
                  value={newRoom.room_number}
                  onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                  placeholder="101"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="count" className="text-sm font-medium text-gray-700">
                  Jumlah
                </label>
                <Input
                  id="count"
                  type="number"
                  min={1}
                  value={newRoom.count}
                  onChange={(e) => setNewRoom({ ...newRoom, count: parseInt(e.target.value) || 1 })}
                />
                <p className="text-sm text-muted-foreground">Buat beberapa kamar sekaligus</p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="room_type" className="text-sm font-medium text-gray-700">
                Tipe/Nama Kamar
              </label>
              <Input
                id="room_type"
                value={newRoom.room_type}
                onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })}
                placeholder="AC Lantai 2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="floor" className="text-sm font-medium text-gray-700">
                Lantai
              </label>
              <Input
                id="floor"
                type="number"
                value={newRoom.floor}
                onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                id="description"
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                placeholder="Deskripsi tambahan..."
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddRoomModal(false)}>
                Batal
              </Button>
              <Button onClick={handleAddRooms} disabled={createRooms.isPending}>
                {createRooms.isPending ? (
                  <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {createRooms.isPending ? 'Memproses...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
