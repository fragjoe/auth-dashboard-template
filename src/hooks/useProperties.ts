import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/api/properties'
import type { Property } from '@/types/property'

// Query keys
export const propertyKeys = {
  all: ['properties'] as const,
  detail: (id: string) => ['properties', id] as const,
}

// Get all properties
export function useProperties() {
  return useQuery({
    queryKey: propertyKeys.all,
    queryFn: api.getProperties,
    select: (data) => data.data,
  })
}

// Get single property
export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => api.getProperty(id),
    select: (data) => data.data,
    enabled: !!id,
  })
}

// Create property mutation
export function useCreateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (property: Omit<Property, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
      api.createProperty(property),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
    },
  })
}

// Update property mutation
export function useUpdateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Property> }) =>
      api.updateProperty(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(variables.id) })
    },
  })
}

// Delete property mutation
export function useDeleteProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
    },
  })
}
