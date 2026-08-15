import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { User, Calendar, CreditCard, Loader2 } from 'lucide-react'
import { useProperties } from '@/hooks/useProperties'
import { useRooms } from '@/hooks/useRooms'
import { useCreateTenant } from '@/hooks/useTenants'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'
import type { TenantStatus } from '@/types/property'

export function NewTenantPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const propertyIdFromUrl = searchParams.get('property_id')
  const roomIdFromUrl = searchParams.get('room_id')

  const { data: properties } = useProperties()
  const createTenant = useCreateTenant()
  const { toast } = useToast()

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
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      toast('Mohon lengkapi form yang wajib diisi', 'error')
      return
    }

    // For per_room, room_id is required
    if (isPerRoom && !formData.room_id) {
      toast('Mohon pilih kamar', 'error')
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
        status: formData.status,
        notes: formData.notes || undefined,
      })

      setIsSubmitting(false)

      if (result.data) {
        toast('Penyewa berhasil ditambahkan!', 'success')
        navigate(`/properties/${formData.property_id}`)
      } else if (result.error) {
        toast('Gagal menyimpan: ' + result.error, 'error')
      }
    } catch (error) {
      setIsSubmitting(false)
      toast('Gagal menyimpan penyewa', 'error')
    }
  }

  // Available rooms (only available ones)
  const availableRooms = rooms?.filter((r) => r.status === 'available') || []

  return (
    <div className="p-4 lg:p-6 max-w-3xl w-full content-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => {
          navigate(-1)
        }} className="mb-4">
          Kembali
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Tambah Penyewa Baru</h1>
        <p className="text-muted-foreground mt-1">Lengkapi informasi penyewa</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white border rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-2xl">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold">Informasi Penyewa</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Nama Lengkap
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama lengkap penyewa"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Nomor Telepon
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="081234567890"
                type="tel"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                type="email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="id_card" className="text-sm font-medium text-foreground">
                No. KTP / ID Card
              </label>
              <Input
                id="id_card"
                name="id_card"
                value={formData.id_card}
                onChange={handleChange}
                placeholder="3201234567890001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="emergency_contact" className="text-sm font-medium text-foreground">
              Kontak Darurat
            </label>
            <Input
              id="emergency_contact"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              placeholder="Nama - No. Telepon"
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white border rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-2xl">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold">Lokasi</h2>
          </div>

          <div className="space-y-2">
            <label htmlFor="property_id" className="text-sm font-medium text-foreground">
              Properti
            </label>
            <Select value={formData.property_id} onValueChange={handlePropertyChange}>
              <SelectTrigger id="property_id">
                <SelectValue placeholder="Pilih properti" />
              </SelectTrigger>
              <SelectContent>
                {properties?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Show room dropdown only for per_room type */}
          {isPerRoom && (
            <div className="space-y-2">
              <label htmlFor="room_id" className="text-sm font-medium text-foreground">
                Kamar
              </label>
              <Select value={formData.room_id} onValueChange={(value) => setFormData((prev) => ({ ...prev, room_id: value }))}>
                <SelectTrigger id="room_id">
                  <SelectValue placeholder="Pilih kamar" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      Kamar {r.room_number}{r.room_type ? ` - ${r.room_type}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Show info for per_property */}
          {selectedProperty && !isPerRoom && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <p className="text-emerald-800 text-sm">
                Properti ini disewakan secara <strong>per properti</strong>.
                Satu properti untuk satu penyewa.
              </p>
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="bg-white border rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-2xl">
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
            <div className="space-y-2">
              <label htmlFor="start_date" className="text-sm font-medium text-foreground">
                Tanggal Masuk
              </label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="start_time" className="text-sm font-medium text-foreground">
                Jam Masuk
              </label>
              <Input
                id="start_time"
                name="start_time"
                type="time"
                value={formData.start_time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="end_date" className="text-sm font-medium text-foreground">
                Tanggal Keluar
              </label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="end_time" className="text-sm font-medium text-foreground">
                Jam Keluar
              </label>
              <Input
                id="end_time"
                name="end_time"
                type="time"
                value={formData.end_time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-foreground">
              Status
            </label>
            <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as TenantStatus }))}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waiting">Menunggu (Booking)</SelectItem>
                <SelectItem value="active">Aktif (Sedang Menginap)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Deposit */}
        <div className="bg-white border rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-2xl">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold">Pembayaran</h2>
          </div>

          <div className="space-y-2">
            <label htmlFor="deposit" className="text-sm font-medium text-foreground">
              Deposit (Rp)
            </label>
            <Input
              id="deposit"
              name="deposit"
              type="number"
              value={formData.deposit}
              onChange={handleChange}
              placeholder="0"
            />
            <p className="text-sm text-muted-foreground">Jumlah deposit. Kosongkan jika tidak ada.</p>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white border rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium text-foreground">
              Catatan
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Catatan tambahan tentang penyewa..."
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md bg-white text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => {
            navigate(-1)
          }}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isSubmitting ? 'Memproses...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </div>
  )
}
