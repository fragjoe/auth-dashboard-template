import { supabase } from './supabase'
import type { RentalPrice, ApiResponse } from '@/types/property'

// Get prices (with optional filters)
export async function getPrices(filters?: {
  property_id?: string
  room_id?: string
}): Promise<ApiResponse<RentalPrice[]>> {
  try {
    let query = supabase.from('rental_prices').select('*')

    if (filters?.property_id) {
      query = query.eq('property_id', filters.property_id)
    }
    if (filters?.room_id) {
      query = query.eq('room_id', filters.room_id)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return { data: data || [], status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Get single price
export async function getPrice(id: string): Promise<ApiResponse<RentalPrice>> {
  try {
    const { data, error } = await supabase
      .from('rental_prices')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return { data, status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Create price
export async function createPrice(
  price: Omit<RentalPrice, 'id' | 'created_at' | 'updated_at'>
): Promise<ApiResponse<RentalPrice>> {
  try {
    const { data, error } = await supabase
      .from('rental_prices')
      .insert(price)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return { data, status: 201 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Delete price
export async function deletePrice(id: string): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase.from('rental_prices').delete().eq('id', id)

    if (error) throw new Error(error.message)
    return { status: 204 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}
