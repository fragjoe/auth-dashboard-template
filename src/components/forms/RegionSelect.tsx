import { useState, useEffect } from 'react'
import { Select } from '@/components/ui/Select'
import { getProvinces, getRegenciesByProvince, getDistrictsByRegency, getVillagesByDistrict } from '@/api/regions'
import type { Province, Regency, District, Village } from '@/api/regions'

interface RegionSelectProps {
  provinceId?: number | null
  regencyId?: number | null
  districtId?: number | null
  villageId?: number | null
  onProvinceChange?: (id: number | null) => void
  onRegencyChange?: (id: number | null) => void
  onDistrictChange?: (id: number | null) => void
  onVillageChange?: (id: number | null) => void
  showVillage?: boolean
  required?: boolean
}

export function RegionSelect({
  provinceId,
  regencyId,
  districtId,
  villageId,
  onProvinceChange,
  onRegencyChange,
  onDistrictChange,
  onVillageChange,
  showVillage = false,
  required = false,
}: RegionSelectProps) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [regencies, setRegencies] = useState<Regency[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [villages, setVillages] = useState<Village[]>([])

  const [selectedProvince, setSelectedProvince] = useState<number | ''>('')
  const [selectedRegency, setSelectedRegency] = useState<number | ''>('')
  const [selectedDistrict, setSelectedDistrict] = useState<number | ''>('')
  const [selectedVillage, setSelectedVillage] = useState<number | ''>('')

  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingRegencies, setLoadingRegencies] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingVillages, setLoadingVillages] = useState(false)

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      const data = await getProvinces()
      setProvinces(data)
      setLoadingProvinces(false)

      // Set initial values if provided
      if (provinceId) {
        setSelectedProvince(provinceId)
      }
    }
    loadProvinces()
  }, [])

  // Load regencies when province changes
  useEffect(() => {
    if (selectedProvince) {
      const loadRegencies = async () => {
        setLoadingRegencies(true)
        setSelectedRegency('')
        setSelectedDistrict('')
        setSelectedVillage('')
        setRegencies([])
        setDistricts([])
        setVillages([])

        const data = await getRegenciesByProvince(selectedProvince as number)
        setRegencies(data)
        setLoadingRegencies(false)

        // Load initial regency if provinceId was set
        if (provinceId && regencyId) {
          setSelectedRegency(regencyId)
        }
      }
      loadRegencies()
    } else {
      setRegencies([])
      setSelectedRegency('')
    }
  }, [selectedProvince, provinceId])

  // Load districts when regency changes
  useEffect(() => {
    if (selectedRegency) {
      const loadDistricts = async () => {
        setLoadingDistricts(true)
        setSelectedDistrict('')
        setSelectedVillage('')
        setDistricts([])
        setVillages([])

        const data = await getDistrictsByRegency(selectedRegency as number)
        setDistricts(data)
        setLoadingDistricts(false)

        // Load initial district if regencyId was set
        if (regencyId && districtId) {
          setSelectedDistrict(districtId)
        }
      }
      loadDistricts()
    } else {
      setDistricts([])
      setSelectedDistrict('')
    }
  }, [selectedRegency, regencyId])

  // Load villages when district changes
  useEffect(() => {
    if (selectedDistrict && showVillage) {
      const loadVillages = async () => {
        setLoadingVillages(true)
        setSelectedVillage('')
        setVillages([])

        const data = await getVillagesByDistrict(selectedDistrict as number)
        setVillages(data)
        setLoadingVillages(false)

        // Load initial village if districtId was set
        if (districtId && villageId) {
          setSelectedVillage(villageId)
        }
      }
      loadVillages()
    } else {
      setVillages([])
      setSelectedVillage('')
    }
  }, [selectedDistrict, showVillage, districtId])

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null
    setSelectedProvince(value as number | '')
    setSelectedRegency('')
    setSelectedDistrict('')
    setSelectedVillage('')
    setRegencies([])
    setDistricts([])
    setVillages([])
    onProvinceChange?.(value)
    onRegencyChange?.(null)
    onDistrictChange?.(null)
    onVillageChange?.(null)
  }

  const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null
    setSelectedRegency(value as number | '')
    setSelectedDistrict('')
    setSelectedVillage('')
    setDistricts([])
    setVillages([])
    onRegencyChange?.(value)
    onDistrictChange?.(null)
    onVillageChange?.(null)
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null
    setSelectedDistrict(value as number | '')
    setSelectedVillage('')
    setVillages([])
    onDistrictChange?.(value)
    onVillageChange?.(null)
  }

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null
    setSelectedVillage(value as number | '')
    onVillageChange?.(value)
  }

  return (
    <div className="space-y-4">
      {/* Province */}
      <Select
        label="Provinsi"
        value={selectedProvince}
        onChange={handleProvinceChange}
        options={provinces.map((p) => ({ value: String(p.id), label: p.name }))}
        placeholder={loadingProvinces ? 'Memuat provinsi...' : 'Pilih Provinsi'}
        disabled={loadingProvinces}
        required={required}
      />

      {/* Regency/City */}
      <Select
        label="Kota/Kabupaten"
        value={selectedRegency}
        onChange={handleRegencyChange}
        options={regencies.map((r) => ({
          value: String(r.id),
          label: `${r.type === 'kota' ? 'Kota' : 'Kabupaten'} ${r.name}`,
        }))}
        placeholder={loadingRegencies ? 'Memuat...' : selectedProvince ? 'Pilih Kota/Kabupaten' : 'Pilih Provinsi terlebih dahulu'}
        disabled={!selectedProvince || loadingRegencies}
        required={required}
      />

      {/* District */}
      <Select
        label="Kecamatan"
        value={selectedDistrict}
        onChange={handleDistrictChange}
        options={districts.map((d) => ({ value: String(d.id), label: d.name }))}
        placeholder={loadingDistricts ? 'Memuat...' : selectedRegency ? 'Pilih Kecamatan' : 'Pilih Kota/Kabupaten terlebih dahulu'}
        disabled={!selectedRegency || loadingDistricts}
        required={required}
      />

      {/* Village (optional) */}
      {showVillage && (
        <Select
          label="Kelurahan/Desa"
          value={selectedVillage}
          onChange={handleVillageChange}
          options={villages.map((v) => ({ value: String(v.id), label: v.name }))}
          placeholder={loadingVillages ? 'Memuat...' : selectedDistrict ? 'Pilih Kelurahan/Desa' : 'Pilih Kecamatan terlebih dahulu'}
          disabled={!selectedDistrict || loadingVillages}
        />
      )}
    </div>
  )
}
