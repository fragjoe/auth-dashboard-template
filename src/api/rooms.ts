import { supabase } from './supabase'
import type { Room, ApiResponse } from '@/types/property'

// Get all rooms for a property
export async function getRooms(propertyId: string): Promise<ApiResponse<Room[]>> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('property_id', propertyId)
      .order('room_number')

    if (error) throw new Error(error.message)
    return { data: data || [], status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Get single room by ID only
export async function getRoomById(roomId: string): Promise<ApiResponse<Room>> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (error) throw new Error(error.message)
    return { data, status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Get single room
export async function getRoom(propertyId: string, roomId: string): Promise<ApiResponse<Room>> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('property_id', propertyId)
      .eq('id', roomId)
      .single()

    if (error) throw new Error(error.message)
    return { data, status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Create room(s) - supports bulk create
export async function createRooms(
  propertyId: string,
  rooms: Array<Omit<Room, 'id' | 'property_id' | 'created_at' | 'updated_at'>>
): Promise<ApiResponse<Room[]>> {
  try {
    const roomsWithPropertyId = rooms.map((room) => ({
      ...room,
      property_id: propertyId,
    }))

    const { data, error } = await supabase
      .from('rooms')
      .insert(roomsWithPropertyId)
      .select()

    if (error) throw new Error(error.message)
    return { data: data || [], status: 201 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Update room
export async function updateRoom(
  propertyId: string,
  roomId: string,
  updates: Partial<Room>
): Promise<ApiResponse<Room>> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', roomId)
      .eq('property_id', propertyId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return { data, status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Delete room
export async function deleteRoom(propertyId: string, roomId: string): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', roomId)
      .eq('property_id', propertyId)

    if (error) throw new Error(error.message)
    return { status: 204 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}
