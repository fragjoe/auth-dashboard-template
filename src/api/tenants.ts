import { supabase } from './supabase'
import type { Tenant, TenantWithDetails, ApiResponse } from '@/types/property'

// Get all tenants (with optional filters - all users can see all tenants)
export async function getTenants(filters?: {
  property_id?: string
  room_id?: string
}): Promise<ApiResponse<Tenant[]>> {
  try {
    let query = supabase.from('tenants').select('*')

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

// Get single tenant with details (all users can view any tenant)
export async function getTenant(id: string): Promise<ApiResponse<TenantWithDetails>> {
  try {
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single()

    if (tenantError) throw new Error(tenantError.message)
    if (!tenant) throw new Error('Tenant not found')

    // Fetch related data
    const { data: property } = await supabase
      .from('properties')
      .select('*')
      .eq('id', tenant.property_id)
      .single()

    const { data: room } = tenant.room_id
      ? await supabase.from('rooms').select('*').eq('id', tenant.room_id).single()
      : { data: null }

    const { data: rental_price } = tenant.rental_price_id
      ? await supabase.from('rental_prices').select('*').eq('id', tenant.rental_price_id).single()
      : { data: null }

    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('tenant_id', id)
      .order('created_at', { ascending: false })

    return {
      data: {
        ...tenant,
        property: property || undefined,
        room: room || undefined,
        rental_price: rental_price || undefined,
        payments: payments || [],
      },
      status: 200,
    }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Create tenant
export async function createTenant(
  tenant: Omit<Tenant, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<ApiResponse<Tenant>> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw new Error(userError.message)

    const { data, error } = await supabase
      .from('tenants')
      .insert({ ...tenant, user_id: userData.user.id })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return { data, status: 201 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Update tenant
export async function updateTenant(
  id: string,
  updates: Partial<Tenant>
): Promise<ApiResponse<Tenant>> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw new Error(userError.message)

    const { data, error } = await supabase
      .from('tenants')
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

// Delete tenant
export async function deleteTenant(id: string): Promise<ApiResponse<null>> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw new Error(userError.message)

    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.user.id)

    if (error) throw new Error(error.message)
    return { status: 204 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}
