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
    province: (value: string) => setFormData((prev) => ({ ...prev, province: value })),
    city: (value: string) => setFormData((prev) => ({ ...prev, city: value })),
    district: (value: string) => setFormData((prev) => ({ ...prev, district: value })),
    village: (value: string) => setFormData((prev) => ({ ...prev, village: value })),
  }

  const handleSubmit = async () => {
    // Final validation
    const step1Valid = validateStep1()
    const step2Valid = validateStep2()
    if (!step1Valid || !step2Valid) {
      if (step === 1) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (step === 2) {
        setStep(2)
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
    return null
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl w-full">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        {[
          { num: 1, label: 'Detail', required: true },
          { num: 2, label: 'Jenis Sewa', required: true },
          { num: 3, label: 'Lokasi' },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center flex-shrink-0">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                step >= s.num
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > s.num ? <Check weight="bold" className="w-4 h-4 sm:w-5 sm:h-5" /> : s.num}
            </div>
            <span className={`ml-2 sm:ml-3 font-medium text-xs sm:text-base flex items-center gap-1 ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s.label}
              {s.required && <span className="text-red-500">*</span>}
            </span>
            {idx < 2 && (
              <div className={`w-8 sm:w-12 h-1 mx-2 sm:mx-4 rounded flex-shrink-0 ${step > s.num ? 'bg-primary' : 'bg-muted'}`} />
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
              <p className="text-xs text-muted-foreground">Field bertanda <span className="text-red-500">*</span> wajib diisi</p>
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
              required
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
              <p className="text-xs text-muted-foreground">Field bertanda <span className="text-red-500">*</span> wajib dipilih</p>
            </div>
          </div>

          <p className="text-muted-foreground">Pilih model penyewaan untuk properti ini:</p>

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
                <h3 className="font-semibold text-foreground">Per Kamar <span className="text-red-500">*</span></h3>
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
                <h3 className="font-semibold text-foreground">Per Properti <span className="text-red-500">*</span></h3>
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

          {/* Region Select - Searchable */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Wilayah Indonesia
            </label>
            <RegionSelect
              onProvinceChange={handleRegionChange.province}
              onRegencyChange={handleRegionChange.city}
              onDistrictChange={handleRegionChange.district}
              onVillageChange={handleRegionChange.village}
            />
          </div>

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
