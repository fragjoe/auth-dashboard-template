import { supabase } from './supabase'

export interface Wilayah {
  kode: string
  nama: string
  level: 'province' | 'regency' | 'district' | 'village'
}

// Get all provinces (kode length = 2)
export async function getProvinces(): Promise<Wilayah[]> {
  const { data, error } = await supabase
    .from('wilayah')
    .select('kode, nama, level')
    .eq('level', 'province')
    .order('nama')

  if (error) {
    console.error('Error fetching provinces:', error)
    return []
  }

  return data || []
}

// Get regencies by province kode (kode length = 5, starts with province kode)
export async function getRegenciesByProvince(provinceKode: string): Promise<Wilayah[]> {
  const { data, error } = await supabase
    .from('wilayah')
    .select('kode, nama, level')
    .eq('level', 'regency')
    .like('kode', `${provinceKode}%`)
    .order('nama')

  if (error) {
    console.error('Error fetching regencies:', error)
    return []
  }

  return data || []
}

// Get districts by regency kode (kode length = 8, starts with regency kode)
export async function getDistrictsByRegency(regencyKode: string): Promise<Wilayah[]> {
  const { data, error } = await supabase
    .from('wilayah')
    .select('kode, nama, level')
    .eq('level', 'district')
    .like('kode', `${regencyKode}%`)
    .order('nama')

  if (error) {
    console.error('Error fetching districts:', error)
    return []
  }

  return data || []
}

// Get villages by district kode (kode length > 8, starts with district kode)
export async function getVillagesByDistrict(districtKode: string): Promise<Wilayah[]> {
  const { data, error } = await supabase
    .from('wilayah')
    .select('kode, nama, level')
    .eq('level', 'village')
    .like('kode', `${districtKode}%`)
    .order('nama')

  if (error) {
    console.error('Error fetching villages:', error)
    return []
  }

  return data || []
}
