import { supabase } from './supabase'
import type { Property, PropertyWithRooms, ApiResponse } from '@/types/property'

// Get all properties for current user
export async function getProperties(): Promise<ApiResponse<Property[]>> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw new Error(userError.message)

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return { data: data || [], status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Get single property by ID
export async function getProperty(id: string): Promise<ApiResponse<PropertyWithRooms>> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw new Error(userError.message)

    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .single()

    if (propertyError) throw new Error(propertyError.message)
    if (!property) throw new Error('Property not found')

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

    if (error) throw new Error(error.message)
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
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw new Error(userError.message)

    const { data, error } = await supabase
      .from('properties')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return { data, status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Delete property
export async function deleteProperty(id: string): Promise<ApiResponse<null>> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw new Error(userError.message)

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.user.id)

    if (error) throw new Error(error.message)
    return { status: 204 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}
