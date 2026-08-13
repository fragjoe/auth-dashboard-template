import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Buildings, MapPin, FloppyDisk, CircleNotch } from '@phosphor-icons/react'
import { useProperty, useUpdateProperty } from '@/hooks/useProperties'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { RegionSelect } from '@/components/forms/RegionSelect'
import { useToast } from '@/components/ui/Toast'
import type { PropertyType, RentalType } from '@/types/property'

const propertyTypeLabels: Record<PropertyType, string> = {
  kos: 'Kos',
  apartemen: 'Apartemen',
  homestay: 'Homestay',
  hotel: 'Hotel',
  rumah: 'Rumah',
  kontrakan: 'Kontrakan',
  ruko: 'Ruko',
  villa: 'Villa',
  parkiran: 'Parkiran',
  penginapan: 'Penginapan',
}

export function EditPropertyPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: property, isLoading } = useProperty(id!)
  const updateProperty = useUpdateProperty()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    type: '' as PropertyType | '',
    description: '',
    rental_type: '' as RentalType | '',
    address: '',
    province: '',
    city: '',
    district: '',
    village: '',
    postal_code: '',
    phone: '',
    status: true,
  })

  // Store original data for change detection
  const [originalData, setOriginalData] = useState<typeof formData | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Track when property data is loaded (for RegionSelect key)
  const [propertyLoaded, setPropertyLoaded] = useState(false)

  // Populate form when property data is loaded
  useEffect(() => {
    if (property) {
      const data = {
        name: property.name || '',
        type: property.type || '',
        description: property.description || '',
        rental_type: property.rental_type || '',
        address: property.address || '',
        province: property.province || '',
        city: property.city || '',
        district: property.district || '',
        village: property.village || '',
        postal_code: property.postal_code || '',
        phone: property.phone || '',
        status: property.status ?? true,
      }
      setFormData(data)
      setOriginalData(data)
      setPropertyLoaded(true)
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
      toast('Mohon lengkapi semua form yang wajib diisi', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      // Check if there are actual changes
      const hasChanges = originalData && JSON.stringify(formData) !== JSON.stringify(originalData)

      if (hasChanges) {
        await updateProperty.mutateAsync({
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
            village: formData.village || undefined,
            postal_code: formData.postal_code || undefined,
            phone: formData.phone || undefined,
            status: formData.status,
          },
        })
        toast('Properti berhasil diperbarui!', 'success')
      } else {
        toast('Tidak ada perubahan yang disimpan', 'info')
      }

      // Navigate back naturally (to previous page in history)
      navigate(-1)
    } catch (error) {
      console.error('Failed to update property:', error)
      toast('Gagal menyimpan perubahan. Silakan coba lagi.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-foreground">Properti tidak ditemukan</h2>
        <Button className="mt-4" onClick={() => navigate('/properties')}>
          Kembali ke Daftar
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Buildings weight="bold" className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold">Informasi Properti</h2>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nama Properti
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Kos Putri Melati"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium text-gray-700">
                Tipe Properti
              </label>
              <Select
                key={`type-select-${propertyLoaded}`}
                value={formData.type || undefined}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as PropertyType }))}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Pilih tipe properti" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(propertyTypeLabels) as PropertyType[]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {propertyTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="rental_type" className="text-sm font-medium text-gray-700">
                Jenis Sewa
              </label>
              <Select
                key={`rental-select-${propertyLoaded}`}
                value={formData.rental_type || undefined}
                disabled
              >
                <SelectTrigger id="rental_type">
                  <SelectValue placeholder="Pilih jenis sewa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per_room">Per Kamar</SelectItem>
                  <SelectItem value="per_property">Per Properti</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Jenis sewa tidak dapat diubah setelah properti dibuat
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Deskripsi tambahan tentang properti..."
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="w-5 h-5 text-primary rounded border-input focus:ring-primary"
            />
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Properti Aktif
            </label>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <MapPin weight="bold" className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold">Lokasi & Kontak</h2>
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-700">
              Alamat
            </label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Contoh: Jl. Raya No. 123"
            />
          </div>

          {/* Region Select */}
          <RegionSelect
            key={`region-${propertyLoaded ? 'loaded' : 'loading'}`}
            province={formData.province}
            regency={formData.city}
            district={formData.district}
            village={formData.village}
            onProvinceChange={(value) => setFormData((prev) => ({ ...prev, province: value }))}
            onRegencyChange={(value) => setFormData((prev) => ({ ...prev, city: value }))}
            onDistrictChange={(value) => setFormData((prev) => ({ ...prev, district: value }))}
            onVillageChange={(value) => setFormData((prev) => ({ ...prev, village: value }))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="postal_code" className="text-sm font-medium text-gray-700">
                Kode Pos
              </label>
              <Input
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                placeholder="Contoh: 40132"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Nomor Telepon
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Contoh: 081234567890"
                type="tel"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FloppyDisk weight="bold" className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Memproses...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  )
}
