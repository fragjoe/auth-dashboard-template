import { useNavigate } from 'react-router-dom'
import { Plus, Building2, MapPin, Phone } from 'lucide-react'
import { useProperties } from '@/hooks/useProperties'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatPropertyType } from '@/lib/utils'

export function PropertiesPage() {
  const navigate = useNavigate()
  const { data: properties, isLoading } = useProperties()

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properti</h1>
          <p className="text-gray-600 mt-1">Kelola semua properti Anda</p>
        </div>
        <Button onClick={() => navigate('/properties/new')}>
          <Plus className="w-5 h-5 mr-2" />
          Properti Baru
        </Button>
      </div>

      {/* Properties Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardBody>
                <div className="animate-pulse space-y-4">
                  <div className="bg-gray-200 h-40 rounded-lg" />
                  <div className="space-y-2">
                    <div className="bg-gray-200 h-6 w-3/4 rounded" />
                    <div className="bg-gray-200 h-4 w-1/2 rounded" />
                    <div className="bg-gray-200 h-4 w-2/3 rounded" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/properties/${property.id}`)}
            >
              {/* Property Image */}
              <div className="h-40 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Building2 className="w-16 h-16 text-white/50" />
              </div>

              <CardBody>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{property.name}</h3>
                    <Badge variant="info" className="mt-1">
                      {formatPropertyType(property.type)}
                    </Badge>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      property.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {property.status ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  {property.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate">
                        {property.city}
                        {property.province && `, ${property.province}`}
                      </span>
                    </div>
                  )}
                  {property.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{property.phone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-primary-600 font-medium">
                    {property.rental_type === 'per_room' ? 'Sewa per kamar' : 'Sewa per properti'}
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada properti</h3>
              <p className="text-gray-500 mb-6">Mulai tambahkan properti pertama Anda</p>
              <Button onClick={() => navigate('/properties/new')}>
                <Plus className="w-5 h-5 mr-2" />
                Tambah Properti
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
