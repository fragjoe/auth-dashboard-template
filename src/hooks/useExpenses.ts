import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/api/expenses'
import { propertyKeys } from './useProperties'
import type { Expense } from '@/types/property'

// Query keys
export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filters: { property_id?: string; room_id?: string }) =>
    [...expenseKeys.lists(), filters] as const,
}

// Get expenses
export function useExpenses(filters?: { property_id?: string; room_id?: string }) {
  return useQuery({
    queryKey: expenseKeys.list(filters || {}),
    queryFn: () => api.getExpenses(filters),
    select: (data) => data.data,
  })
}

// Create expense mutation
export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) =>
      api.createExpense(expense),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all })
      if (variables.property_id) {
        queryClient.invalidateQueries({ queryKey: propertyKeys.detail(variables.property_id) })
      }
    },
  })
}

// Update expense mutation
export function useUpdateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Expense> }) =>
      api.updateExpense(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all })
    },
  })
}

// Delete expense mutation
export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, property_id: _propertyId }: { id: string; property_id?: string }) =>
      api.deleteExpense(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all })
      if (variables.property_id) {
        queryClient.invalidateQueries({ queryKey: propertyKeys.detail(variables.property_id) })
      }
    },
  })
}
