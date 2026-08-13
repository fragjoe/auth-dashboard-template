import { useNavigate } from 'react-router-dom'
import { PlusCircle, Door, House, Plus } from '@phosphor-icons/react'
import { useProperties } from '@/hooks/useProperties'
import { useRooms } from '@/hooks/useRooms'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { Property, Room } from '@/types/property'

// Single Property Item
function PropertyItem({ property }: { property: Property }) {
  const navigate = useNavigate()

  const location = [
    property.district,
    property.city,
  ].filter(Boolean).join(', ')

  const getStatusBadge = (rentalType: string) => {
    if (rentalType === 'per_room') {
      return { label: 'Per Kamar', color: 'bg-blue-100 text-blue-700' }
    }
    return { label: 'Kosong', color: 'bg-red-100 text-red-700' }
  }

  const statusBadge = getStatusBadge(property.rental_type)

  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg border bg-white hover:border-primary cursor-pointer transition-colors"
      onClick={() => navigate(`/properties/${property.id}`)}
    >
      <div className="flex items-center gap-3 flex-1">
        <House weight="bold" className="w-5 h-5 text-muted-foreground" />
        <div>
          <span className="text-foreground">{property.name}</span>
          {location && (
            <p className="text-sm text-muted-foreground mt-1">
              {location}
            </p>
          )}
        </div>
      </div>
      <Badge className={statusBadge.color}>
        {statusBadge.label}
      </Badge>
    </div>
  )
}

// Room Item
function RoomItem({ room, propertyId }: { room: Room; propertyId: string }) {
  const navigate = useNavigate()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return { label: 'Kosong', color: 'bg-red-100 text-red-700' }
      case 'occupied':
        return { label: 'Terisi', color: 'bg-blue-100 text-blue-700' }
      case 'maintenance':
        return { label: 'Perbaikan', color: 'bg-yellow-100 text-yellow-700' }
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700' }
    }
  }

  const roomName = room.room_type
    ? `${room.room_type} - ${room.room_number}`
    : `${room.room_number}`

  const statusBadge = getStatusBadge(room.status)

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg border bg-white hover:border-primary cursor-pointer transition-colors"
      onClick={() => navigate(`/properties/${propertyId}/rooms/${room.id}`)}
    >
      <Door weight="bold" className="w-4 h-4 text-muted-foreground" />
      <div className="flex-1">
        <span className="text-foreground">{roomName}</span>
      </div>
      <Badge className={statusBadge.color}>
        {statusBadge.label}
      </Badge>
    </div>
  )
}

// Per Kamar Property with Rooms
function PerKamarPropertyItem({ property }: { property: Property }) {
  const { data: rooms } = useRooms(property.id)
  const navigate = useNavigate()

  const roomCount = rooms?.length || 0

  return (
    <div className="space-y-3">
      {/* Property Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-foreground">
            {property.name}
          </h3>
          <Badge className="bg-blue-100 text-gray-600">
            {roomCount}
          </Badge>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/properties/${property.id}`)
          }}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <PlusCircle weight="fill" className="w-5 h-5" />
        </button>
      </div>

      {/* Rooms List */}
      {rooms && rooms.length > 0 ? (
        <div className="space-y-2">
          {rooms.map((room) => (
            <RoomItem key={room.id} room={room} propertyId={property.id} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground pl-4">Belum ada kamar</p>
      )}
    </div>
  )
}

export function PropertiesPage() {
  const navigate = useNavigate()
  const { data: properties, isLoading } = useProperties()

  const perRoom = properties?.filter(p => p.rental_type === 'per_room') || []
  const perProperty = properties?.filter(p => p.rental_type === 'per_property') || []
  const allProperties = [...perProperty, ...perRoom]

  return (
    <div className="p-4 lg:p-6 space-y-8 max-w-7xl">
      {/* All Properties Section */}
      <section>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">
              Properti
            </h2>
            <Badge className="bg-blue-100 text-gray-700">
              {allProperties.length}
            </Badge>
          </div>
          <button
            onClick={() => navigate('/properties/new')}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <PlusCircle weight="fill" className="w-5 h-5" />
          </button>
        </div>

        {/* Properties List */}
        <div className="space-y-3">
          {allProperties.map((property) => (
            <PropertyItem key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Per Kamar Section */}
      {perRoom.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-6">
            {perRoom.map((property) => (
              <PerKamarPropertyItem key={property.id} property={property} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!isLoading && properties?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Belum ada properti</p>
          <Button onClick={() => navigate('/properties/new')}>
            <Plus weight="bold" className="w-5 h-5 mr-2" />
            Tambah Properti
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-muted rounded-lg" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
