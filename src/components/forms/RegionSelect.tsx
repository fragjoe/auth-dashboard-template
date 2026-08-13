import { useState, useEffect } from 'react'
import { Combobox } from '@/components/ui/Combobox'
import { getProvinces, getRegenciesByProvince, getDistrictsByRegency, getVillagesByDistrict } from '@/api/regions'
import type { Wilayah } from '@/api/regions'

interface RegionSelectProps {
  showVillage?: boolean
  province?: string
  regency?: string
  district?: string
  village?: string
  onProvinceChange?: (value: string) => void
  onRegencyChange?: (value: string) => void
  onDistrictChange?: (value: string) => void
  onVillageChange?: (value: string) => void
  error?: {
    province?: string
    regency?: string
    district?: string
    village?: string
  }
}

export function RegionSelect({
  showVillage = true,
  province = '',
  regency = '',
  district = '',
  village = '',
  onProvinceChange,
  onRegencyChange,
  onDistrictChange,
  onVillageChange,
  error,
}: RegionSelectProps) {
  const [provinces, setProvinces] = useState<Wilayah[]>([])
  const [regencies, setRegencies] = useState<Wilayah[]>([])
  const [districts, setDistricts] = useState<Wilayah[]>([])
  const [villages, setVillages] = useState<Wilayah[]>([])

  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedRegency, setSelectedRegency] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedVillage, setSelectedVillage] = useState('')

  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingRegencies, setLoadingRegencies] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingVillages, setLoadingVillages] = useState(false)

  const [isInitialized, setIsInitialized] = useState(false)

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      const data = await getProvinces()
      setProvinces(data)
      setLoadingProvinces(false)
    }
    loadProvinces()
  }, [])

  // Initialize values from props when provinces are loaded
  useEffect(() => {
    if (loadingProvinces || isInitialized) return

    if (provinces.length > 0) {
      setSelectedProvince(province)
      setSelectedRegency(regency)
      setSelectedDistrict(district)
      setSelectedVillage(village)
      setIsInitialized(true)
    }
  }, [loadingProvinces, provinces.length, isInitialized, province, regency, district, village])

  // Load dependent data cascade when initialized with values
  useEffect(() => {
    if (!isInitialized || loadingProvinces) return

    const loadCascade = async () => {
      // Step 1: Load regencies if province is set
      if (province) {
        const provinceData = provinces.find(p => p.nama === province)
        if (provinceData) {
          const regData = await getRegenciesByProvince(provinceData.kode)
          setRegencies(regData)

          // Step 2: Load districts if regency is set
          if (regency) {
            const regencyData = regData.find(r => r.nama === regency)
            if (regencyData) {
              const distData = await getDistrictsByRegency(regencyData.kode)
              setDistricts(distData)

              // Step 3: Load villages if district is set
              if (district) {
                const districtData = distData.find(d => d.nama === district)
                if (districtData) {
                  const vilData = await getVillagesByDistrict(districtData.kode)
                  setVillages(vilData)
                }
              }
            }
          }
        }
      }
    }

    loadCascade()
  }, [isInitialized, loadingProvinces, province, provinces])

  // Handle province change
  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    setSelectedRegency('')
    setSelectedDistrict('')
    setSelectedVillage('')
    setRegencies([])
    setDistricts([])
    setVillages([])
    onProvinceChange?.(value)
    onRegencyChange?.('')
    onDistrictChange?.('')
    onVillageChange?.('')

    // Load regencies for new province
    if (value) {
      const provinceData = provinces.find(p => p.nama === value)
      if (provinceData) {
        setLoadingRegencies(true)
        getRegenciesByProvince(provinceData.kode).then(data => {
          setRegencies(data)
          setLoadingRegencies(false)
        })
      }
    }
  }

  // Handle regency change
  const handleRegencyChange = (value: string) => {
    setSelectedRegency(value)
    setSelectedDistrict('')
    setSelectedVillage('')
    setDistricts([])
    setVillages([])
    onRegencyChange?.(value)
    onDistrictChange?.('')
    onVillageChange?.('')

    // Load districts for new regency
    if (value) {
      const regencyData = regencies.find(r => r.nama === value)
      if (regencyData) {
        setLoadingDistricts(true)
        getDistrictsByRegency(regencyData.kode).then(data => {
          setDistricts(data)
          setLoadingDistricts(false)
        })
      }
    }
  }

  // Handle district change
  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
    setSelectedVillage('')
    setVillages([])
    onDistrictChange?.(value)
    onVillageChange?.('')

    // Load villages for new district
    if (value && showVillage) {
      const districtData = districts.find(d => d.nama === value)
      if (districtData) {
        setLoadingVillages(true)
        getVillagesByDistrict(districtData.kode).then(data => {
          setVillages(data)
          setLoadingVillages(false)
        })
      }
    }
  }

  // Handle village change
  const handleVillageChange = (value: string) => {
    setSelectedVillage(value)
    onVillageChange?.(value)
  }

  const provinceOptions = provinces.map(p => ({ value: p.nama, label: p.nama }))
  const regencyOptions = regencies.map(r => ({ value: r.nama, label: r.nama }))
  const districtOptions = districts.map(d => ({ value: d.nama, label: d.nama }))
  const villageOptions = villages.map(v => ({ value: v.nama, label: v.nama }))

  return (
    <div className="space-y-4">
      {/* Provinsi */}
      <Combobox
        options={provinceOptions}
        value={selectedProvince}
        onValueChange={handleProvinceChange}
        placeholder="Pilih Provinsi"
        disabled={loadingProvinces}
        error={error?.province}
      />

      {/* Kota/Kabupaten */}
      <Combobox
        options={regencyOptions}
        value={selectedRegency}
        onValueChange={handleRegencyChange}
        placeholder={selectedProvince ? "Pilih Kota/Kabupaten" : "Pilih Provinsi terlebih dahulu"}
        disabled={!selectedProvince || loadingRegencies}
        error={error?.regency}
      />

      {/* Kecamatan */}
      <Combobox
        options={districtOptions}
        value={selectedDistrict}
        onValueChange={handleDistrictChange}
        placeholder={selectedRegency ? "Pilih Kecamatan" : "Pilih Kota/Kab terlebih dahulu"}
        disabled={!selectedRegency || loadingDistricts}
        error={error?.district}
      />

      {/* Kelurahan/Desa */}
      {showVillage && (
        <Combobox
          options={villageOptions}
          value={selectedVillage}
          onValueChange={handleVillageChange}
          placeholder={selectedDistrict ? "Pilih Kelurahan/Desa" : "Pilih Kecamatan terlebih dahulu"}
          disabled={!selectedDistrict || loadingVillages}
          error={error?.village}
        />
      )}
    </div>
  )
}
