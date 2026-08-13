import { supabase } from './supabase'
import type { Property, PropertyWithRooms, ApiResponse } from '@/types/property'

// Get all properties (all users can see all properties)
export async function getProperties(): Promise<ApiResponse<Property[]>> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return { data: data || [], status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Get single property by ID (all users can view any property)
export async function getProperty(id: string): Promise<ApiResponse<PropertyWithRooms>> {
  // Don't query if id is empty
  if (!id) {
    return { data: undefined, status: 200 }
  }

  try {
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()

    // Handle case where property doesn't exist (e.g., just deleted)
    if (propertyError?.code === 'PGRST116' || !property) {
      return { data: undefined, status: 200 }
    }

    if (propertyError) throw new Error(propertyError.message)

    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('property_id', id)
      .order('room_number')

    if (roomsError) throw new Error(roomsError.message)

    const { data: rental_prices, error: pricesError } = await supabase
      .from('rental_prices')
      .select('*')
      .eq('property_id', id)

    if (pricesError) throw new Error(pricesError.message)

    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('property_id', id)

    if (expensesError) throw new Error(expensesError.message)

    return {
      data: {
        ...property,
        rooms: rooms || [],
        rental_prices: rental_prices || [],
        expenses: expenses || [],
      },
      status: 200,
    }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Create new property
export async function createProperty(
  property: Omit<Property, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<ApiResponse<Property>> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw new Error(userError.message)

    const { data, error } = await supabase
      .from('properties')
      .insert({ ...property, user_id: userData.user.id })
      .select()
      .single()

    if (error) return { error: error.message, status: 400 }
    return { data, status: 201 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Update property
export async function updateProperty(
  id: string,
  updates: Partial<Property>
): Promise<ApiResponse<Property>> {
  const { data, error } = await supabase
    .from('properties')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new Error('Properti tidak ditemukan')

  return { data, status: 200 }
}

// Delete property
export async function deleteProperty(id: string): Promise<ApiResponse<null>> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return { status: 204 }
}
