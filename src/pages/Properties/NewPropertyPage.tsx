import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Buildings, MapPin, Check, CircleNotch, WarningCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Combobox } from '@/components/ui/Combobox'
import { RegionSelect } from '@/components/forms/RegionSelect'
import { useCreateProperty } from '@/hooks/useProperties'
import { useToast } from '@/components/ui/Toast'
import type { PropertyType, RentalType } from '@/types/property'

interface FormErrors {
  name?: string
  type?: string
  rental_type?: string
  address?: string
  province?: string
  city?: string
  district?: string
  village?: string
}

const propertyTypes = [
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
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

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
    country: 'Indonesia',
    status: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => ({ ...prev, [name]: true }))
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as PropertyType }))
    setTouched((prev) => ({ ...prev, type: true }))
    if (errors.type) {
      setErrors((prev) => ({ ...prev, type: undefined }))
    }
  }

  const validateStep1 = () => {
    const newErrors: FormErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Nama properti wajib diisi'
    }
    if (!formData.type) {
      newErrors.type = 'Tipe properti wajib dipilih'
    }
    setErrors(newErrors)
    setTouched((prev) => ({ ...prev, name: true, type: true }))
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: FormErrors = {}
    if (!formData.rental_type) {
      newErrors.rental_type = 'Jenis sewa wajib dipilih'
    }
    setErrors(newErrors)
    setTouched((prev) => ({ ...prev, rental_type: true }))
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: FormErrors = {}
    if (!formData.address.trim()) {
      newErrors.address = 'Alamat wajib diisi'
    }
    if (!formData.province) {
      newErrors.province = 'Provinsi wajib dipilih'
    }
    if (!formData.city) {
      newErrors.city = 'Kabupaten/Kota wajib dipilih'
    }
    if (!formData.district) {
      newErrors.district = 'Kecamatan wajib dipilih'
    }
    if (!formData.village) {
      newErrors.village = 'Kelurahan wajib dipilih'
    }
    setErrors(newErrors)
    setTouched((prev) => ({ ...prev, address: true, province: true, city: true, district: true, village: true }))
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2)
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3)
      }
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleRegionChange = {
    province: (value: string) => {
      setFormData((prev) => ({ ...prev, province: value }))
      setTouched((prev) => ({ ...prev, province: true }))
      if (errors.province) setErrors((prev) => ({ ...prev, province: undefined }))
    },
    city: (value: string) => {
      setFormData((prev) => ({ ...prev, city: value }))
      setTouched((prev) => ({ ...prev, city: true }))
      if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }))
    },
    district: (value: string) => {
      setFormData((prev) => ({ ...prev, district: value }))
      setTouched((prev) => ({ ...prev, district: true }))
      if (errors.district) setErrors((prev) => ({ ...prev, district: undefined }))
    },
    village: (value: string) => {
      setFormData((prev) => ({ ...prev, village: value }))
      setTouched((prev) => ({ ...prev, village: true }))
      if (errors.village) setErrors((prev) => ({ ...prev, village: undefined }))
    },
  }

  const handleSubmit = async () => {
    // Final validation
    const step1Valid = validateStep1()
    const step2Valid = validateStep2()
    const step3Valid = validateStep3()
    if (!step1Valid || !step2Valid || !step3Valid) {
      if (step === 1) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (step === 2) {
        setStep(2)
      } else if (step === 3) {
        setStep(3)
      }
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createProperty.mutateAsync({
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
        country: formData.country,
        status: formData.status,
      })

      setIsSubmitting(false)

      if (result.data) {
        toast('Properti berhasil dibuat!', 'success')
        navigate(`/properties/${result.data.id}`, { replace: true })
      } else if (result.error) {
        toast('Gagal membuat properti: ' + result.error, 'error')
      }
    } catch (error) {
      setIsSubmitting(false)
      toast('Gagal membuat properti. Silakan coba lagi.', 'error')
    }
  }

  const showStepError = (stepNum: number) => {
    if (step !== stepNum) return null
    if (stepNum === 1 && Object.keys(errors).length > 0) {
      return (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
          <WarningCircle weight="fill" className="w-5 h-5 flex-shrink-0" />
          <span>Mohon lengkapi field yang wajib diisi:</span>
        </div>
      )
    }
    if (stepNum === 2 && errors.rental_type) {
      return (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
          <WarningCircle weight="fill" className="w-5 h-5 flex-shrink-0" />
          <span>{errors.rental_type}</span>
        </div>
      )
    }
    if (stepNum === 3 && Object.keys(errors).length > 0) {
      return (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
          <WarningCircle weight="fill" className="w-5 h-5 flex-shrink-0" />
          <span>Mohon lengkapi field lokasi yang wajib diisi</span>
        </div>
      )
    }
    return null
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl w-full content-fade-in">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[
          { num: 1, label: 'Detail', required: true },
          { num: 2, label: 'Jenis', required: true },
          { num: 3, label: 'Lokasi' },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center">
            {/* Circle & Label */}
            <div className="flex flex-col items-center justify-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  step >= s.num
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s.num ? <Check weight="bold" className="w-4 h-4" /> : s.num}
              </div>
              <span className={`mt-1 text-xs font-medium whitespace-nowrap ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.label}
                {s.required}
              </span>
            </div>
            {/* Connecting Line */}
            {idx < 2 && (
              <div
                className={`w-10 h-0.5 mx-1 rounded transition-all duration-300 -mt-4 ${
                  step > idx + 1 ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="bg-white border rounded-lg p-6 space-y-6">
          {showStepError(1)}

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Buildings weight="bold" className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Informasi Properti</h2>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nama Properti <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Kos Putri Melati"
              className={errors.name && touched.name ? 'border-red-500 focus:ring-red-500' : ''}
            />
            {errors.name && touched.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tipe Properti <span className="text-red-500">*</span>
            </label>
            <Combobox
              options={propertyTypes}
              value={formData.type}
              onValueChange={handleTypeChange}
              placeholder="Pilih tipe properti"
              error={errors.type && touched.type ? errors.type : undefined}
            />
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
        </div>
      )}

      {/* Step 2: Rental Type */}
      {step === 2 && (
        <div className="bg-white border rounded-lg p-6 space-y-6">
          {showStepError(2)}

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Buildings weight="bold" className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Jenis Sewa</h2>
            </div>
          </div>

          <p className="text-muted-foreground">Pilih model penyewaan untuk properti ini: <span className="text-red-500">*</span></p>

          <div className="space-y-4">
            <label
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.rental_type === 'per_room'
                  ? 'border-primary bg-primary/5'
                  : errors.rental_type
                  ? 'border-red-500'
                  : 'border-input hover:border-muted-foreground/50'
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
                <h3 className="font-semibold text-foreground">Per Kamar</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Cocok untuk Kos, Apartemen, Homestay, Hotel. Setiap kamar bisa disewa
                  oleh penyewa berbeda.
                </p>
              </div>
            </label>

            <label
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.rental_type === 'per_property'
                  ? 'border-primary bg-primary/5'
                  : errors.rental_type
                  ? 'border-red-500'
                  : 'border-input hover:border-muted-foreground/50'
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
                <h3 className="font-semibold text-foreground">Per Properti</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Cocok untuk Rumah, Kontrakan, Villa, Ruko. Seluruh properti disewa
                  oleh satu penyewa.
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {step === 3 && (
        <div className="bg-white border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <MapPin weight="bold" className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold">Lokasi & Kontak</h2>
          </div>

          {/* Image Upload - Dummy */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Foto Properti
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Klik untuk upload foto</p>
              <p className="text-xs text-muted-foreground">PNG, JPG hingga 5MB</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-700">
              Alamat <span className="text-red-500">*</span>
            </label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Contoh: Jl. Raya No. 123"
              className={errors.address && touched.address ? 'border-red-500' : ''}
            />
            {errors.address && touched.address && (
              <p className="text-xs text-red-500">{errors.address}</p>
            )}
          </div>

          {/* Region Select - Searchable */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Wilayah Indonesia <span className="text-red-500">*</span>
            </label>
            <RegionSelect
              onProvinceChange={handleRegionChange.province}
              onRegencyChange={handleRegionChange.city}
              onDistrictChange={handleRegionChange.district}
              onVillageChange={handleRegionChange.village}
              error={{
                province: touched.province ? errors.province : undefined,
                regency: touched.city ? errors.city : undefined,
                district: touched.district ? errors.district : undefined,
                village: touched.village ? errors.village : undefined,
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="postal_code" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Kode Pos <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Opsional</span>
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
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Nomor Telepon <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Opsional</span>
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
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
        >
          Kembali
        </Button>

        {step < 3 ? (
          <Button onClick={handleNext}>
            Lanjut
            <ArrowRight weight="bold" className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isSubmitting ? 'Memproses...' : 'Simpan Properti'}
          </Button>
        )}
      </div>
    </div>
  )
}
