import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Building2, MapPin } from 'lucide-react'
import { useProperty, useUpdateProperty } from '@/hooks/useProperties'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardBody } from '@/components/ui/Card'
import type { PropertyType, RentalType } from '@/types/property'

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'kos', label: 'Kos' },
  { value: 'apartemen', label: 'Apartemen' },
  { value: 'homestay', label: 'Homestay' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'rumah', label: 'Rumah' },
  { value: 'kontrakan', label: 'Kontrakan' },
  { value: 'ruko', label: 'Ruko' },
  { value: 'villa', label: 'Villa' },
  { value: 'parkiran', label: 'Parkiran' },
  { value: 'penginapan', label: 'Penginapan' },
]

const PROVINCES = [
  'Bali', 'Banten', 'Bengkulu', 'DI Yogyakarta', 'DKI Jakarta', 'Gorontalo',
  'Jambi', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Kalimantan Barat',
  'Kalimantan Selatan', 'Kalimantan Tengah', 'Kalimantan Timur', 'Kalimantan Utara',
  'Kepulauan Bangka Belitung', 'Kepulauan Riau', 'Lampung', 'Maluku', 'Maluku Utara',
  'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Papua', 'Papua Barat', 'Riau',
  'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tengah', 'Sulawesi Tenggara',
  'Sulawesi Utara', 'Sumatera Barat', 'Sumatera Selatan', 'Sumatera Utara',
]

export function EditPropertyPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: property, isLoading } = useProperty(id!)
  const updateProperty = useUpdateProperty()

  const [formData, setFormData] = useState({
    name: '',
    type: '' as PropertyType | '',
    description: '',
    rental_type: '' as RentalType | '',
    address: '',
    province: '',
    city: '',
    district: '',
    postal_code: '',
    phone: '',
    status: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form when property data is loaded
  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name || '',
        type: property.type || '',
        description: property.description || '',
        rental_type: property.rental_type || '',
        address: property.address || '',
        province: property.province || '',
        city: property.city || '',
        district: property.district || '',
        postal_code: property.postal_code || '',
        phone: property.phone || '',
        status: property.status ?? true,
      })
    }
  }, [property])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !formData.name || !formData.type || !formData.rental_type) {
      alert('Mohon lengkapi semua form yang wajib diisi')
      return
    }

    setIsSubmitting(true)

    const result = await updateProperty.mutateAsync({
      id,
      updates: {
        name: formData.name,
        type: formData.type as PropertyType,
        rental_type: formData.rental_type as RentalType,
        description: formData.description || undefined,
        address: formData.address || undefined,
        province: formData.province || undefined,
        city: formData.city || undefined,
        district: formData.district || undefined,
        postal_code: formData.postal_code || undefined,
        phone: formData.phone || undefined,
        status: formData.status,
      },
    })

    setIsSubmitting(false)

    if (result.data) {
      navigate(`/properties/${id}`)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
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

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(`/properties/${id}`)} className="mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Properti</h1>
        <p className="text-gray-600 mt-1">Perbarui informasi properti Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardBody className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Building2 className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold">Informasi Properti</h2>
            </div>

            <Input
              label="Nama Properti"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Kos Putri Melati"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipe Properti"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={PROPERTY_TYPES}
                placeholder="Pilih tipe properti"
                required
              />

              <Select
                label="Jenis Sewa"
                name="rental_type"
                value={formData.rental_type}
                onChange={handleChange}
                options={[
                  { value: 'per_room', label: 'Per Kamar' },
                  { value: 'per_property', label: 'Per Properti' },
                ]}
                placeholder="Pilih jenis sewa"
                required
              />
            </div>

            {/* Warning if changing rental type */}
            {formData.rental_type && formData.rental_type !== property.rental_type && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Perhatian:</strong> Mengubah jenis sewa dapat mempengaruhi data yang sudah ada.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Deskripsi tambahan tentang properti..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="status"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <label htmlFor="status" className="text-sm font-medium text-gray-700">
                Properti Aktif
              </label>
            </div>
          </CardBody>
        </Card>

        {/* Location */}
        <Card>
          <CardBody className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-100 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold">Lokasi & Kontak</h2>
            </div>

            <Input
              label="Alamat"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Jl. Raya No. 123"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Provinsi"
                name="province"
                value={formData.province}
                onChange={handleChange}
                options={PROVINCES.map((p) => ({ value: p, label: p }))}
                placeholder="Pilih provinsi"
              />

              <Input
                label="Kota/Kabupaten"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Contoh: Bandung"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Kecamatan"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Contoh: Coblong"
              />

              <Input
                label="Kode Pos"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                placeholder="Contoh: 40132"
              />
            </div>

            <Input
              label="Nomor Telepon"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Contoh: 081234567890"
              type="tel"
            />
          </CardBody>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/properties/${id}`)}
          >
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  )
}
