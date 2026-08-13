import { Users, Phone, EnvelopeSimple, Calendar } from '@phosphor-icons/react'
import { useTenants } from '@/hooks/useTenants'
import { Button } from '@/components/ui/Button'
import { formatDate, getTenantStatusBadge } from '@/lib/utils'

export function TenantsPage() {
  const { data: tenants, isLoading } = useTenants()

  return (
    <div className="p-4 lg:p-6 max-w-7xl content-fade-in">
      {/* Add Tenant Button */}
      <div className="flex justify-end mb-6">
        <Button disabled>
          Tambah Penyewa
        </Button>
      </div>

      {/* Tenants List - Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 rounded-lg border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-muted h-10 w-10 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="bg-muted h-4 w-24 rounded animate-pulse" />
                    <div className="bg-muted h-3 w-16 rounded mt-2 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-muted h-3 w-full rounded animate-pulse" />
                <div className="bg-muted h-3 w-2/3 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : tenants && tenants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-fade-in">
          {tenants.map((tenant) => {
            const statusBadge = getTenantStatusBadge(tenant.status)
            return (
              <div
                key={tenant.id}
                className="p-4 rounded-lg border bg-white hover:bg-muted/50 hover:border-primary cursor-pointer transition-all duration-200 card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <Users weight="bold" className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{tenant.name}</h3>
                      <p className="text-xs text-muted-foreground">
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
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone weight="bold" className="w-4 h-4" />
                      <span>{tenant.phone}</span>
                    </div>
                  )}
                  {tenant.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <EnvelopeSimple weight="bold" className="w-4 h-4" />
                      <span className="truncate">{tenant.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar weight="bold" className="w-4 h-4" />
                    <span>
                      {formatDate(tenant.start_date)} - {tenant.end_date ? formatDate(tenant.end_date) : '-'}
                    </span>
                  </div>
                </div>

                {tenant.deposit && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">Deposit</p>
                    <p className="font-semibold text-foreground">
                      Rp {tenant.deposit.toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 rounded-lg border border-dashed content-fade-in">
          <Users weight="bold" className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Belum ada penyewa</h3>
          <p className="text-muted-foreground">
            Tambahkan penyewa dari halaman detail properti
          </p>
        </div>
      )}
    </div>
  )
}
