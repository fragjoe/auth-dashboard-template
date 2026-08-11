import { supabase } from './supabase'
import type { Expense, ApiResponse } from '@/types/property'

// Get expenses (with optional filters)
export async function getExpenses(filters?: {
  property_id?: string
  room_id?: string
}): Promise<ApiResponse<Expense[]>> {
  try {
    let query = supabase.from('expenses').select('*')

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

// Get single expense
export async function getExpense(id: string): Promise<ApiResponse<Expense>> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return { data, status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Create expense
export async function createExpense(
  expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>
): Promise<ApiResponse<Expense>> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return { data, status: 201 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Update expense
export async function updateExpense(
  id: string,
  updates: Partial<Expense>
): Promise<ApiResponse<Expense>> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return { data, status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Delete expense
export async function deleteExpense(id: string): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase.from('expenses').delete().eq('id', id)

    if (error) throw new Error(error.message)
    return { status: 204 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}
