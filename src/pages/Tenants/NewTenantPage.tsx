import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save, User, Calendar, CreditCard } from 'lucide-react'
import { useProperties } from '@/hooks/useProperties'
import { useRooms } from '@/hooks/useRooms'
import { useCreateTenant } from '@/hooks/useTenants'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardBody } from '@/components/ui/Card'
import type { TenantStatus } from '@/types/property'

export function NewTenantPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const propertyIdFromUrl = searchParams.get('property_id')
  const roomIdFromUrl = searchParams.get('room_id')

  const { data: properties } = useProperties()
  const createTenant = useCreateTenant()

  // Get selected property
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(propertyIdFromUrl || '')
  const { data: rooms } = useRooms(selectedPropertyId)

  const selectedProperty = properties?.find((p) => p.id === selectedPropertyId)
  const isPerRoom = selectedProperty?.rental_type === 'per_room'

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    id_card: '',
    emergency_contact: '',
    property_id: propertyIdFromUrl || '',
    room_id: roomIdFromUrl || '',
    start_date: '',
    start_time: '14:00',
    end_date: '',
    end_time: '12:00',
    deposit: '',
    rental_price_id: '',
    status: 'active' as TenantStatus,
    notes: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update property_id when URL param changes
  useEffect(() => {
    if (propertyIdFromUrl) {
      setSelectedPropertyId(propertyIdFromUrl)
      setFormData((prev) => ({ ...prev, property_id: propertyIdFromUrl }))
    }
  }, [propertyIdFromUrl])

  // Update room_id when URL param changes
  useEffect(() => {
    if (roomIdFromUrl) {
      setFormData((prev) => ({ ...prev, room_id: roomIdFromUrl }))
    }
  }, [roomIdFromUrl])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  // Handle property selection
  const handlePropertyChange = (propertyId: string) => {
    setSelectedPropertyId(propertyId)
    setFormData((prev) => ({
      ...prev,
      property_id: propertyId,
      room_id: '', // Reset room when property changes
    }))
  }

  // Quick duration selection
  const setDuration = (months: number) => {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + months)

    const formatDate = (date: Date) => date.toISOString().split('T')[0]

    setFormData((prev) => ({
      ...prev,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.property_id || !formData.start_date) {
      alert('Mohon lengkapi form yang wajib diisi')
      return
    }

    // For per_room, room_id is required
    if (isPerRoom && !formData.room_id) {
      alert('Mohon pilih kamar')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createTenant.mutateAsync({
        name: formData.name,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        id_card: formData.id_card || undefined,
        emergency_contact: formData.emergency_contact || undefined,
        property_id: formData.property_id || undefined,
        room_id: isPerRoom ? formData.room_id : undefined,
        start_date: new Date(`${formData.start_date}T${formData.start_time}`).toISOString(),
        end_date: formData.end_date ? new Date(`${formData.end_date}T${formData.end_time}`).toISOString() : undefined,
        start_time: formData.start_time,
        end_time: formData.end_time,
        deposit: formData.deposit ? parseFloat(formData.deposit) : undefined,
        rental_price_id: formData.rental_price_id || undefined,
        status: formData.status,
        notes: formData.notes || undefined,
      })

      setIsSubmitting(false)

      if (result.data) {
        navigate(`/properties/${formData.property_id}`)
      }
    } catch (error) {
      setIsSubmitting(false)
      alert('Gagal menyimpan penyewa')
    }
  }

  // Available rooms (only available ones)
  const availableRooms = rooms?.filter((r) => r.status === 'available') || []

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Penyewa Baru</h1>
        <p className="text-gray-600 mt-1">Lengkapi informasi penyewa</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <Card>
          <CardBody className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-100 p-2 rounded-lg">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold">Informasi Penyewa</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama lengkap penyewa"
                required
              />

              <Input
                label="Nomor Telepon"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="081234567890"
                type="tel"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                type="email"
              />

              <Input
                label="No. KTP / ID Card"
                name="id_card"
                value={formData.id_card}
                onChange={handleChange}
                placeholder="3201234567890001"
              />
            </div>

            <Input
              label="Kontak Darurat"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              placeholder="Nama - No. Telepon"
            />
          </CardBody>
        </Card>

        {/* Location */}
        <Card>
          <CardBody className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold">Lokasi</h2>
            </div>

            <Select
              label="Properti"
              name="property_id"
              value={formData.property_id}
              onChange={(e) => handlePropertyChange(e.target.value)}
              options={properties?.map((p) => ({ value: p.id, label: p.name })) || []}
              placeholder="Pilih properti"
              required
            />

            {/* Show room dropdown only for per_room type */}
            {isPerRoom && (
              <Select
                label="Kamar"
                name="room_id"
                value={formData.room_id}
                onChange={handleChange}
                options={availableRooms.map((r) => ({
                  value: r.id,
                  label: `Kamar ${r.room_number}${r.room_type ? ` - ${r.room_type}` : ''}`,
                }))}
                placeholder="Pilih kamar"
                required
              />
            )}

            {/* Show info for per_property */}
            {selectedProperty && !isPerRoom && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Properti ini disewakan secara <strong>per properti</strong>.
                  Satu properti untuk satu penyewa.
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Duration */}
        <Card>
          <CardBody className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold">Durasi Sewa</h2>
            </div>

            {/* Quick Select */}
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setDuration(1)}>
                1 Bulan
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setDuration(3)}>
                3 Bulan
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setDuration(6)}>
                6 Bulan
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setDuration(12)}>
                1 Tahun
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Tanggal Masuk"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Jam Masuk"
                  name="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Input
                  label="Tanggal Keluar"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                />
                <Input
                  label="Jam Keluar"
                  name="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
            </div>

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'waiting', label: 'Menunggu (Booking)' },
                { value: 'active', label: 'Aktif (Sedang Menginap)' },
              ]}
            />
          </CardBody>
        </Card>

        {/* Deposit */}
        <Card>
          <CardBody className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold">Pembayaran</h2>
            </div>

            <Input
              label="Deposit (Rp)"
              name="deposit"
              type="number"
              value={formData.deposit}
              onChange={handleChange}
              placeholder="0"
              helperText="Jumlah deposit. Kosongkan jika tidak ada."
            />
          </CardBody>
        </Card>

        {/* Notes */}
        <Card>
          <CardBody className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Catatan tambahan tentang penyewa..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </CardBody>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            Simpan Penyewa
          </Button>
        </div>
      </form>
    </div>
  )
}
