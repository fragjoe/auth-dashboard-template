import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/api/rooms'
import { propertyKeys } from './useProperties'
import type { Room } from '@/types/property'

// Query keys
export const roomKeys = {
  all: ['rooms'] as const,
  forProperty: (propertyId: string) => ['rooms', propertyId] as const,
  detail: (propertyId: string, roomId: string) => ['rooms', propertyId, roomId] as const,
}

// Get rooms for a property
export function useRooms(propertyId: string) {
  return useQuery({
    queryKey: roomKeys.forProperty(propertyId),
    queryFn: () => api.getRooms(propertyId),
    select: (data) => data.data,
    enabled: !!propertyId,
  })
}

// Get single room
export function useRoom(propertyId: string, roomId: string) {
  return useQuery({
    queryKey: roomKeys.detail(propertyId, roomId),
    queryFn: () => api.getRoom(propertyId, roomId),
    select: (data) => data.data,
    enabled: !!propertyId && !!roomId,
  })
}

// Create rooms mutation
export function useCreateRooms() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      propertyId,
      rooms,
    }: {
      propertyId: string
      rooms: Array<Omit<Room, 'id' | 'property_id' | 'created_at' | 'updated_at'>>
    }) => api.createRooms(propertyId, rooms),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.forProperty(variables.propertyId) })
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(variables.propertyId) })
    },
  })
}

// Update room mutation
export function useUpdateRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      propertyId,
      roomId,
      updates,
    }: {
      propertyId: string
      roomId: string
      updates: Partial<Room>
    }) => api.updateRoom(propertyId, roomId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.forProperty(variables.propertyId) })
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(variables.propertyId, variables.roomId) })
    },
  })
}

// Delete room mutation
export function useDeleteRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ propertyId, roomId }: { propertyId: string; roomId: string }) =>
      api.deleteRoom(propertyId, roomId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.forProperty(variables.propertyId) })
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(variables.propertyId, variables.roomId) })
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(variables.propertyId) })
    },
  })
}
