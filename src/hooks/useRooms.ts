import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/api/rooms'
import type { Room } from '@/types/property'

// Query keys
export const roomKeys = {
  all: ['rooms'] as const,
  forProperty: (propertyId: string) => ['rooms', propertyId] as const,
  detail: (propertyId: string, roomId: string) => ['rooms', propertyId, roomId] as const,
  byId: (roomId: string) => ['rooms', 'byId', roomId] as const,
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

// Get room by ID only (flat URL /rooms/[id])
export function useRoomById(roomId: string) {
  return useQuery({
    queryKey: roomKeys.byId(roomId),
    queryFn: () => api.getRoomById(roomId),
    select: (data) => data.data,
    enabled: !!roomId,
  })
}

// Get single room (nested URL /properties/[id]/rooms/[id])
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
    mutationFn: (variables: { propertyId: string; rooms: Omit<Room, 'id' | 'property_id' | 'created_at' | 'updated_at'>[] }) =>
      api.createRooms(variables.propertyId, variables.rooms),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.forProperty(variables.propertyId) })
    },
  })
}

// Update room mutation
export function useUpdateRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { propertyId: string; roomId: string; updates: Partial<Room> }) =>
      api.updateRoom(variables.propertyId, variables.roomId, variables.updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(variables.propertyId, variables.roomId) })
      queryClient.invalidateQueries({ queryKey: roomKeys.byId(variables.roomId) })
    },
  })
}

// Delete room mutation
export function useDeleteRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { propertyId: string; roomId: string }) =>
      api.deleteRoom(variables.propertyId, variables.roomId),
      onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.forProperty(variables.propertyId) })
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(variables.propertyId, variables.roomId) })
      queryClient.invalidateQueries({ queryKey: roomKeys.byId(variables.roomId) })
    },
  })
}
