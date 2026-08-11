import { supabase } from './supabase'

export interface Province {
  id: number
  name: string
}

export interface Regency {
  id: number
  province_id: number
  name: string
  type: 'kabupaten' | 'kota'
}

export interface District {
  id: number
  regency_id: number
  name: string
}

export interface Village {
  id: number
  district_id: number
  name: string
}

// Get all provinces
export async function getProvinces(): Promise<Province[]> {
  const { data, error } = await supabase
    .from('provinces')
    .select('id, name')
    .order('name')

  if (error) {
    console.error('Error fetching provinces:', error)
    return []
  }

  return data || []
}

// Get regencies by province ID
export async function getRegenciesByProvince(provinceId: number): Promise<Regency[]> {
  const { data, error } = await supabase
    .from('regencies')
    .select('id, province_id, name, type')
    .eq('province_id', provinceId)
    .order('type')
    .order('name')

  if (error) {
    console.error('Error fetching regencies:', error)
    return []
  }

  return data || []
}

// Get districts by regency ID
export async function getDistrictsByRegency(regencyId: number): Promise<District[]> {
  const { data, error } = await supabase
    .from('districts')
    .select('id, regency_id, name')
    .eq('regency_id', regencyId)
    .order('name')

  if (error) {
    console.error('Error fetching districts:', error)
    return []
  }

  return data || []
}

// Get villages by district ID
export async function getVillagesByDistrict(districtId: number): Promise<Village[]> {
  const { data, error } = await supabase
    .from('villages')
    .select('id, district_id, name')
    .eq('district_id', districtId)
    .order('name')

  if (error) {
    console.error('Error fetching villages:', error)
    return []
  }

  return data || []
}
