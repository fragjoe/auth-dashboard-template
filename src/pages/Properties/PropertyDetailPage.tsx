import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Home,
  Users,
  Calendar,
  MapPin,
  Phone,
  Building2,
} from 'lucide-react'
import { useProperty } from '@/hooks/useProperties'
import { useRooms } from '@/hooks/useRooms'
import { useDeleteProperty } from '@/hooks/useProperties'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import {
  formatPropertyType,
  formatCurrency,
  formatInterval,
  getRoomStatusBadge,
} from '@/lib/utils'
import { useCreateRooms } from '@/hooks/useRooms'
import type { RoomStatus } from '@/types/property'

type TabType = 'details' | 'rooms' | 'prices' | 'expenses' | 'tenants'

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: property, isLoading } = useProperty(id!)
  const { data: rooms } = useRooms(id!)
  const deleteProperty = useDeleteProperty()
  const createRooms = useCreateRooms()

  const [activeTab, setActiveTab] = useState<TabType>('details')
  const [showAddRoomModal, setShowAddRoomModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
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

  const handleDelete = async () => {
    if (!id) return
    await deleteProperty.mutateAsync(id)
    navigate('/properties')
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Properti tidak ditemukan</h2>
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/properties')} className="mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Building2 className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    property.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {property.status ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="info">{formatPropertyType(property.type)}</Badge>
                <span className="text-gray-500">
                  {isPerRoom ? 'Sewa per kamar' : 'Sewa per properti'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/properties/${id}/edit`)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>
      </div>

      {/* Property Stats - only show rooms stats for per_room type */}
      <div className={`grid grid-cols-1 gap-4 mb-6 ${isPerRoom ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {isPerRoom && (
          <>
            <Card>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Home className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Kamar</p>
                    <p className="text-xl font-bold">{rooms?.length || 0}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kamar Terisi</p>
                    <p className="text-xl font-bold">
                      {rooms?.filter((r) => r.status === 'occupied').length || 0}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kamar Tersedia</p>
                    <p className="text-xl font-bold">
                      {rooms?.filter((r) => r.status === 'available').length || 0}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Penyewa</p>
                <p className="text-xl font-bold">-</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 text-sm bg-gray-100 px-2 py-0.5 rounded-full">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <Card>
          <CardBody>
            <div className="space-y-4">
              {property.description && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Deskripsi</h3>
                  <p className="text-gray-600">{property.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Tipe Properti</h3>
                  <p className="text-gray-600">{formatPropertyType(property.type)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Jenis Sewa</h3>
                  <p className="text-gray-600">{isPerRoom ? 'Per Kamar' : 'Per Properti'}</p>
                </div>
              </div>

              {(property.address || property.city || property.province) && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Lokasi</h3>
                    <p className="text-gray-600">
                      {[property.address, property.district, property.city, property.province, property.postal_code]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {property.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Telepon</h3>
                    <p className="text-gray-600">{property.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'rooms' && isPerRoom && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Daftar Kamar</h2>
            <Button onClick={() => setShowAddRoomModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kamar
            </Button>
          </div>

          {rooms && rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => {
                const statusBadge = getRoomStatusBadge(room.status)
                return (
                  <Card key={room.id}>
                    <CardBody>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Kamar {room.room_number}</h3>
                          {room.room_type && (
                            <p className="text-sm text-gray-500">{room.room_type}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      {room.floor && (
                        <p className="text-sm text-gray-500">Lantai {room.floor}</p>
                      )}
                      {room.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{room.description}</p>
                      )}
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardBody className="text-center py-8">
                <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Belum ada kamar</p>
                <Button variant="outline" className="mt-4" onClick={() => setShowAddRoomModal(true)}>
                  Tambah Kamar Pertama
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'prices' && (
        <Card>
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Harga Sewa</h2>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
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
                      <p className="font-medium text-gray-900">
                        {formatCurrency(price.amount)}
                      </p>
                      <p className="text-sm text-gray-500">{formatInterval(price.interval_type)}</p>
                    </div>
                    {price.is_default && (
                      <Badge variant="success">Default</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Belum ada harga sewa</p>
            )}
          </CardBody>
        </Card>
      )}

      {activeTab === 'expenses' && (
        <Card>
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Biaya Utilitas</h2>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
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
                      <p className="font-medium text-gray-900 capitalize">{expense.expense_type}</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(expense.rate)} / {expense.unit?.replace('_', ' ')}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        expense.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {expense.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Belum ada biaya utilitas</p>
            )}
          </CardBody>
        </Card>
      )}

      {activeTab === 'tenants' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {isPerProperty ? 'Penyewa Properti' : 'Daftar Penyewa'}
            </h2>
            <Button onClick={() => navigate(`/tenants/new?property_id=${id}`)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Penyewa
            </Button>
          </div>

          <Card>
            <CardBody className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {isPerProperty
                  ? 'Belum ada penyewa untuk properti ini'
                  : 'Pilih kamar untuk melihat penyewanya'}
              </p>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Add Room Modal - only for per_room type */}
      {isPerRoom && (
        <Modal
          isOpen={showAddRoomModal}
          onClose={() => setShowAddRoomModal(false)}
          title="Tambah Kamar"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nomor Kamar"
                value={newRoom.room_number}
                onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                placeholder="101"
                required
              />
              <Input
                label="Jumlah"
                type="number"
                min={1}
                value={newRoom.count}
                onChange={(e) => setNewRoom({ ...newRoom, count: parseInt(e.target.value) || 1 })}
                helperText="Buat beberapa kamar sekaligus"
              />
            </div>

            <Input
              label="Tipe/Nama Kamar"
              value={newRoom.room_type}
              onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })}
              placeholder="AC Lantai 2"
            />

            <Input
              label="Lantai"
              type="number"
              value={newRoom.floor}
              onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
              placeholder="1"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                placeholder="Deskripsi tambahan..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddRoomModal(false)}>
                Batal
              </Button>
              <Button onClick={handleAddRooms} isLoading={createRooms.isPending}>
                Simpan
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Properti"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus properti <strong>{property.name}</strong>? Tindakan ini
          akan menghapus semua kamar dan data terkait.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={deleteProperty.isPending}>
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  )
}
