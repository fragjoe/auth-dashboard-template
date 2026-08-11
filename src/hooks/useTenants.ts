import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/api/tenants'
import type { Tenant } from '@/types/property'

// Query keys
export const tenantKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  list: (filters: { property_id?: string; room_id?: string }) =>
    [...tenantKeys.lists(), filters] as const,
  details: () => [...tenantKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
}

// Get all tenants
export function useTenants(filters?: { property_id?: string; room_id?: string }) {
  return useQuery({
    queryKey: tenantKeys.list(filters || {}),
    queryFn: () => api.getTenants(filters),
    select: (data) => data.data,
  })
}

// Get single tenant
export function useTenant(id: string) {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => api.getTenant(id),
    select: (data) => data.data,
    enabled: !!id,
  })
}

// Create tenant mutation
export function useCreateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tenant: Omit<Tenant, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
      api.createTenant(tenant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all })
    },
  })
}

// Update tenant mutation
export function useUpdateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Tenant> }) =>
      api.updateTenant(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all })
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(variables.id) })
    },
  })
}

// Delete tenant mutation
export function useDeleteTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all })
    },
  })
}
