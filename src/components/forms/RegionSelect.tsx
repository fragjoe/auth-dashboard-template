import { useState, useEffect } from 'react'
import { Select } from '@/components/ui/Select'
import { getProvinces, getRegenciesByProvince, getDistrictsByRegency, getVillagesByDistrict } from '@/api/regions'
import type { Wilayah } from '@/api/regions'

interface RegionSelectProps {
  onProvinceChange?: (nama: string | null) => void
  onRegencyChange?: (nama: string | null) => void
  onDistrictChange?: (nama: string | null) => void
  onVillageChange?: (nama: string | null) => void
  showVillage?: boolean
}

export function RegionSelect({
  onProvinceChange,
  onRegencyChange,
  onDistrictChange,
  onVillageChange,
  showVillage = true,
}: RegionSelectProps) {
  const [provinces, setProvinces] = useState<Wilayah[]>([])
  const [regencies, setRegencies] = useState<Wilayah[]>([])
  const [districts, setDistricts] = useState<Wilayah[]>([])
  const [villages, setVillages] = useState<Wilayah[]>([])

  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedRegency, setSelectedRegency] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [selectedVillage, setSelectedVillage] = useState<string>('')

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
    }
    loadProvinces()
  }, [])

  // Load regencies when province changes
  useEffect(() => {
    if (selectedProvince) {
      const province = provinces.find(p => p.nama === selectedProvince)
      if (province) {
        const loadRegencies = async () => {
          setLoadingRegencies(true)
          setSelectedRegency('')
          setSelectedDistrict('')
          setSelectedVillage('')
          setRegencies([])
          setDistricts([])
          setVillages([])

          const data = await getRegenciesByProvince(province.kode)
          setRegencies(data)
          setLoadingRegencies(false)
        }
        loadRegencies()
      }
    } else {
      setRegencies([])
      setSelectedRegency('')
      setSelectedDistrict('')
      setSelectedVillage('')
      setDistricts([])
      setVillages([])
    }
  }, [selectedProvince, provinces])

  // Load districts when regency changes
  useEffect(() => {
    if (selectedRegency) {
      const regency = regencies.find(r => r.nama === selectedRegency)
      if (regency) {
        const loadDistricts = async () => {
          setLoadingDistricts(true)
          setSelectedDistrict('')
          setSelectedVillage('')
          setDistricts([])
          setVillages([])

          const data = await getDistrictsByRegency(regency.kode)
          setDistricts(data)
          setLoadingDistricts(false)
        }
        loadDistricts()
      }
    } else {
      setDistricts([])
      setSelectedDistrict('')
      setSelectedVillage('')
      setVillages([])
    }
  }, [selectedRegency, regencies])

  // Load villages when district changes
  useEffect(() => {
    if (selectedDistrict && showVillage) {
      const district = districts.find(d => d.nama === selectedDistrict)
      if (district) {
        const loadVillages = async () => {
          setLoadingVillages(true)
          setSelectedVillage('')
          setVillages([])

          const data = await getVillagesByDistrict(district.kode)
          setVillages(data)
          setLoadingVillages(false)
        }
        loadVillages()
      }
    } else {
      setVillages([])
      setSelectedVillage('')
    }
  }, [selectedDistrict, districts, showVillage])

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedProvince(value)
    setSelectedRegency('')
    setSelectedDistrict('')
    setSelectedVillage('')
    setRegencies([])
    setDistricts([])
    setVillages([])
    onProvinceChange?.(value || null)
    onRegencyChange?.(null)
    onDistrictChange?.(null)
    onVillageChange?.(null)
  }

  const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedRegency(value)
    setSelectedDistrict('')
    setSelectedVillage('')
    setDistricts([])
    setVillages([])
    onRegencyChange?.(value || null)
    onDistrictChange?.(null)
    onVillageChange?.(null)
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedDistrict(value)
    setSelectedVillage('')
    setVillages([])
    onDistrictChange?.(value || null)
    onVillageChange?.(null)
  }

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedVillage(value)
    onVillageChange?.(value || null)
  }

  return (
    <div className="space-y-4">
      {/* Provinsi */}
      <Select
        label="Provinsi"
        value={selectedProvince}
        onChange={handleProvinceChange}
        options={provinces.map(p => ({ value: p.nama, label: p.nama }))}
        placeholder={loadingProvinces ? 'Memuat provinsi...' : 'Pilih Provinsi'}
        disabled={loadingProvinces}
      />

      {/* Kota/Kabupaten */}
      <Select
        label="Kota/Kabupaten"
        value={selectedRegency}
        onChange={handleRegencyChange}
        options={regencies.map(r => ({ value: r.nama, label: r.nama }))}
        placeholder={loadingRegencies ? 'Memuat...' : selectedProvince ? 'Pilih Kota/Kabupaten' : 'Pilih Provinsi terlebih dahulu'}
        disabled={!selectedProvince || loadingRegencies}
      />

      {/* Kecamatan */}
      <Select
        label="Kecamatan"
        value={selectedDistrict}
        onChange={handleDistrictChange}
        options={districts.map(d => ({ value: d.nama, label: d.nama }))}
        placeholder={loadingDistricts ? 'Memuat...' : selectedRegency ? 'Pilih Kecamatan' : 'Pilih Kota/Kabupaten terlebih dahulu'}
        disabled={!selectedRegency || loadingDistricts}
      />

      {/* Kelurahan/Desa */}
      {showVillage && (
        <Select
          label="Kelurahan/Desa"
          value={selectedVillage}
          onChange={handleVillageChange}
          options={villages.map(v => ({ value: v.nama, label: v.nama }))}
          placeholder={loadingVillages ? 'Memuat...' : selectedDistrict ? 'Pilih Kelurahan/Desa' : 'Pilih Kecamatan terlebih dahulu'}
          disabled={!selectedDistrict || loadingVillages}
        />
      )}
    </div>
  )
}
