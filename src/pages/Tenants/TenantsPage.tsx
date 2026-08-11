import { Users, Plus, Phone, Mail, Calendar } from 'lucide-react'
import { useTenants } from '@/hooks/useTenants'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { formatDate, getTenantStatusBadge } from '@/lib/utils'

export function TenantsPage() {
  const { data: tenants, isLoading } = useTenants()

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Penyewa</h1>
          <p className="text-gray-600 mt-1">Kelola semua penyewa Anda</p>
        </div>
        <Button disabled>
          <Plus className="w-5 h-5 mr-2" />
          Tambah Penyewa
        </Button>
      </div>

      {/* Tenants List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardBody>
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-200 h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <div className="bg-gray-200 h-4 w-32 rounded" />
                      <div className="bg-gray-200 h-3 w-24 rounded mt-2" />
                    </div>
                  </div>
                  <div className="bg-gray-200 h-3 w-full rounded" />
                  <div className="bg-gray-200 h-3 w-2/3 rounded" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : tenants && tenants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => {
            const statusBadge = getTenantStatusBadge(tenant.status)
            return (
              <Card key={tenant.id}>
                <CardBody>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-100 p-3 rounded-full">
                        <Users className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
                        <p className="text-sm text-gray-500">
                          ID: {tenant.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    {tenant.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{tenant.phone}</span>
                      </div>
                    )}
                    {tenant.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{tenant.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {formatDate(tenant.start_date)} - {tenant.end_date ? formatDate(tenant.end_date) : '-'}
                      </span>
                    </div>
                  </div>

                  {tenant.deposit && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">Deposit</p>
                      <p className="font-semibold text-gray-900">
                        Rp {tenant.deposit.toLocaleString('id-ID')}
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada penyewa</h3>
              <p className="text-gray-500">
                Tambahkan penyewa dari halaman detail properti
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
