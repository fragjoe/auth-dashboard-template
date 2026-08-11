import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, MapPin, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardBody } from '@/components/ui/Card'
import { RegionSelect } from '@/components/forms/RegionSelect'
import { useCreateProperty } from '@/hooks/useProperties'
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

export function NewPropertyPage() {
  const navigate = useNavigate()
  const createProperty = useCreateProperty()

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    country: 'Indonesia',
    status: true,
  })

  // Region state (from RegionSelect)
  const [_province, setProvince] = useState<string>('')
  const [_regency, setRegency] = useState<string>('')
  const [_district, setDistrict] = useState<string>('')
  const [_village, setVillage] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.type) {
        alert('Mohon lengkapi form')
        return
      }
    }
    if (step === 2) {
      if (!formData.rental_type) {
        alert('Mohon pilih jenis sewa')
        return
      }
    }
    setStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.type || !formData.rental_type) {
      alert('Mohon lengkapi semua form yang wajib diisi')
      return
    }

    setIsSubmitting(true)

    const result = await createProperty.mutateAsync({
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
      country: formData.country,
      status: formData.status,
    })

    setIsSubmitting(false)

    if (result.data) {
      navigate(`/properties/${result.data.id}`)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/properties')} className="mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Properti Baru</h1>
        <p className="text-gray-600 mt-1">Lengkapi informasi properti Anda</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: 'Detail' },
          { num: 2, label: 'Jenis Sewa' },
          { num: 3, label: 'Lokasi' },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s.num
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > s.num ? <Check className="w-5 h-5" /> : s.num}
            </div>
            <span className={`ml-3 font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-500'}`}>
              {s.label}
            </span>
            {idx < 2 && (
              <div className={`w-16 h-1 mx-4 rounded ${step > s.num ? 'bg-primary-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
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

            <Select
              label="Tipe Properti"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={PROPERTY_TYPES}
              placeholder="Pilih tipe properti"
              required
            />

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
          </CardBody>
        </Card>
      )}

      {/* Step 2: Rental Type */}
      {step === 2 && (
        <Card>
          <CardBody className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Building2 className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold">Jenis Sewa</h2>
            </div>

            <p className="text-gray-600">Pilih model penyewaan untuk properti ini:</p>

            <div className="space-y-4">
              <label
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.rental_type === 'per_room'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="rental_type"
                  value="per_room"
                  checked={formData.rental_type === 'per_room'}
                  onChange={handleChange}
                  className="mt-1 mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">Per Kamar</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Cocok untuk Kos, Apartemen, Homestay, Hotel. Setiap kamar bisa disewa
                    oleh penyewa berbeda.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.rental_type === 'per_property'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="rental_type"
                  value="per_property"
                  checked={formData.rental_type === 'per_property'}
                  onChange={handleChange}
                  className="mt-1 mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">Per Properti</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Cocok untuk Rumah, Kontrakan, Villa, Ruko. Seluruh properti disewa
                    oleh satu penyewa.
                  </p>
                </div>
              </label>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Step 3: Location */}
      {step === 3 && (
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
              placeholder="Contoh: Jl. Raya No. 123"
            />

            {/* Cascading Region Dropdowns */}
            <RegionSelect
              onProvinceChange={(nama) => {
                setProvince(nama || '')
              }}
              onRegencyChange={(nama) => {
                setRegency(nama || '')
              }}
              onDistrictChange={(nama) => {
                setDistrict(nama || '')
              }}
              onVillageChange={(nama) => {
                setVillage(nama || '')
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Kode Pos"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                placeholder="Contoh: 40132"
              />

              <Input
                label="Nomor Telepon"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Contoh: 081234567890"
                type="tel"
              />
            </div>
          </CardBody>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </Button>

        {step < 3 ? (
          <Button onClick={handleNext}>
            Lanjut
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            Simpan Properti
          </Button>
        )}
      </div>
    </div>
  )
}
