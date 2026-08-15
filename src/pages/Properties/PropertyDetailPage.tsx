import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Phone, Home, Users, Plus, DoorOpen } from 'lucide-react'
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

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: property, isLoading } = useProperty(id!)
  const { data: rooms } = useRooms(id!)
  const createRooms = useCreateRooms()

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

  // Format city: shorten "Kabupaten" to "Kab."
  const formatCity = (city: string) => {
    if (!city) return ''
    if (city.startsWith('Kabupaten')) {
      return city.replace('Kabupaten', 'Kab.')
    }
    return city
  }

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
      <div className="p-4 lg:p-6 max-w-3xl">
        <DetailPageSkeleton />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-foreground">Properti tidak ditemukan</h2>
        <Button className="mt-4" onClick={() => {
          navigate('/properties')
        }}>
          Kembali ke Daftar
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-3xl space-y-4 content-fade-in">
      {/* Info Properti - Compact */}
      <div className="bg-white border rounded-2xl p-4">
        <div className="space-y-3">
          {property.name && (
            <h2 className="text-lg font-semibold text-foreground">{property.name}</h2>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatPropertyType(property.type)}</span>
            <span>•</span>
            <span>{isPerRoom ? 'Per Kamar' : 'Per Properti'}</span>
          </div>

          {(property.address || property.city) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>
                {[property.village, formatCity(property.city || '')].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {property.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{property.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Per Properti: Penyewa (paling atas) */}
      {isPerProperty && (
        <div className="bg-white border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Penyewa</h3>
            </div>
            <Button size="sm" onClick={() => {
              navigate(`/tenants/new?property_id=${id}`)
            }}>
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>
          <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-2xl">
            Belum ada penyewa
          </div>
        </div>
      )}

      {/* Per Kamar: Kamar */}
      {isPerRoom && (
        <div className="bg-white border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Kamar</h3>
              <Badge className="bg-emerald-100 text-emerald-700">{rooms?.length || 0}</Badge>
            </div>
            <Button size="sm" onClick={() => setShowAddRoomModal(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>

          {rooms && rooms.length > 0 ? (
            <div className="space-y-2">
              {rooms.map((room) => {
                const statusBadge = getRoomStatusBadge(room.status)
                return (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-3 rounded-2xl border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => {
                      navigate(`/rooms/${room.id}`)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <DoorOpen className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Kamar {room.room_number}</span>
                        {room.room_type && (
                          <p className="text-xs text-muted-foreground">{room.room_type}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={statusBadge.color}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-2xl">
              Belum ada kamar
            </div>
          )}
        </div>
      )}

      {/* Harga Sewa */}
      <div className="bg-white border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-primary font-semibold">Rp</span>
            <h3 className="font-semibold">Harga Sewa</h3>
          </div>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {property.rental_prices && property.rental_prices.length > 0 ? (
          <div className="space-y-2">
            {property.rental_prices.map((price) => (
              <div key={price.id} className="flex items-center justify-between p-3 rounded-2xl border">
                <div>
                  <p className="font-medium">{formatCurrency(price.amount)}</p>
                  <p className="text-xs text-muted-foreground">{formatInterval(price.interval_type)}</p>
                </div>
                {price.is_default && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">Default</Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-2xl">
            Belum ada harga sewa
          </div>
        )}
      </div>

      {/* Biaya */}
      <div className="bg-white border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-semibold">kWh</span>
            <h3 className="font-semibold">Biaya Utilitas</h3>
          </div>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {property.expenses && property.expenses.length > 0 ? (
          <div className="space-y-2">
            {property.expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 rounded-2xl border">
                <div>
                  <p className="font-medium capitalize">{expense.expense_type}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(expense.rate)} / {expense.unit?.replace('_', ' ')}
                  </p>
                </div>
                <Badge className={expense.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}>
                  {expense.is_active ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-2xl">
            Belum ada biaya utilitas
          </div>
        )}
      </div>

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
                <label className="text-sm font-medium">Nomor Kamar</label>
                <Input
                  value={newRoom.room_number}
                  onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                  placeholder="101"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Jumlah</label>
                <Input
                  type="number"
                  min={1}
                  value={newRoom.count}
                  onChange={(e) => setNewRoom({ ...newRoom, count: parseInt(e.target.value) || 1 })}
                />
                <p className="text-xs text-muted-foreground">Buat beberapa sekaligus</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipe/Nama</label>
              <Input
                value={newRoom.room_type}
                onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })}
                placeholder="AC Lantai 2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Lantai</label>
              <Input
                type="number"
                value={newRoom.floor}
                onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                placeholder="1"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddRoomModal(false)}>
                Batal
              </Button>
              <Button onClick={handleAddRooms} disabled={createRooms.isPending}>
                {createRooms.isPending ? 'Memproses...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
