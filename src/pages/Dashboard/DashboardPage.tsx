import { useNavigate } from 'react-router-dom'
import { Building2, Users, Calendar, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { useProperties } from '@/hooks/useProperties'
import { useTenants } from '@/hooks/useTenants'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { formatTenantStatus } from '@/lib/utils'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: properties, isLoading: propertiesLoading } = useProperties()
  const { data: tenants, isLoading: tenantsLoading } = useTenants()

  const activeTenants = tenants?.filter((t) => t.status === 'active') || []
  const waitingTenants = tenants?.filter((t) => t.status === 'waiting') || []

  const stats = [
    {
      title: 'Total Properti',
      value: properties?.length || 0,
      icon: Building2,
      color: 'bg-blue-500',
      path: '/properties',
    },
    {
      title: 'Total Penyewa',
      value: tenants?.length || 0,
      icon: Users,
      color: 'bg-green-500',
      path: '/tenants',
    },
    {
      title: 'Penyewa Aktif',
      value: activeTenants.length,
      icon: Calendar,
      color: 'bg-purple-500',
      path: '/tenants',
    },
    {
      title: 'Menunggu',
      value: waitingTenants.length,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      path: '/tenants',
    },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang di Property Manager</p>
        </div>
        <Button onClick={() => navigate('/properties/new')}>
          <Plus className="w-5 h-5 mr-2" />
          Properti Baru
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(stat.path)}
          >
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Properties List */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Properti Terbaru</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/properties')}>
              Lihat Semua
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <CardBody>
            {propertiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4">
                    <div className="bg-gray-200 h-12 w-12 rounded-lg" />
                    <div className="flex-1">
                      <div className="bg-gray-200 h-4 w-32 rounded" />
                      <div className="bg-gray-200 h-3 w-24 rounded mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties && properties.length > 0 ? (
              <div className="space-y-4">
                {properties.slice(0, 5).map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/properties/${property.id}`)}
                  >
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <Building2 className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{property.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{property.type}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        property.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {property.status ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Belum ada properti</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/properties/new')}
                >
                  Tambah Properti
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Tenants List */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Penyewa Terbaru</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tenants')}>
              Lihat Semua
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <CardBody>
            {tenantsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4">
                    <div className="bg-gray-200 h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <div className="bg-gray-200 h-4 w-32 rounded" />
                      <div className="bg-gray-200 h-3 w-24 rounded mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tenants && tenants.length > 0 ? (
              <div className="space-y-4">
                {tenants.slice(0, 5).map((tenant) => (
                  <div
                    key={tenant.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="bg-primary-100 p-3 rounded-full">
                      <Users className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{tenant.name}</p>
                      <p className="text-sm text-gray-500">{tenant.phone || '-'}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        tenant.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : tenant.status === 'waiting'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {formatTenantStatus(tenant.status)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Belum ada penyewa</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
