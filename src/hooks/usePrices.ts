import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/api/prices'
import { propertyKeys } from './useProperties'
import type { RentalPrice } from '@/types/property'

// Query keys
export const priceKeys = {
  all: ['prices'] as const,
  lists: () => [...priceKeys.all, 'list'] as const,
  list: (filters: { property_id?: string; room_id?: string }) =>
    [...priceKeys.lists(), filters] as const,
}

// Get prices
export function usePrices(filters?: { property_id?: string; room_id?: string }) {
  return useQuery({
    queryKey: priceKeys.list(filters || {}),
    queryFn: () => api.getPrices(filters),
    select: (data) => data.data,
  })
}

// Create price mutation
export function useCreatePrice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (price: Omit<RentalPrice, 'id' | 'created_at' | 'updated_at'>) =>
      api.createPrice(price),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: priceKeys.all })
      if (variables.property_id) {
        queryClient.invalidateQueries({ queryKey: propertyKeys.detail(variables.property_id) })
      }
    },
  })
}

// Delete price mutation
export function useDeletePrice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, property_id: _propertyId }: { id: string; property_id?: string }) =>
      api.deletePrice(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: priceKeys.all })
      if (variables.property_id) {
        queryClient.invalidateQueries({ queryKey: propertyKeys.detail(variables.property_id) })
      }
    },
  })
}
