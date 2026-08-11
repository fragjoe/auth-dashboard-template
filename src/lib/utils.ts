import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date, locale: string = 'id-ID'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date, locale: string = 'id-ID'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatInterval(interval: string): string {
  const intervals: Record<string, string> = {
    daily: 'Harian',
    weekly: 'Mingguan',
    biweekly: '2 Mingguan',
    monthly: 'Bulanan',
    bimonthly: '2 Bulanan',
    quarterly: '3 Bulanan',
    biannual: '6 Bulanan',
    yearly: 'Tahunan',
  }
  return intervals[interval] || interval
}

export function formatPropertyType(type: string): string {
  const types: Record<string, string> = {
    kos: 'Kos',
    apartemen: 'Apartemen',
    homestay: 'Homestay',
    hotel: 'Hotel',
    rumah: 'Rumah',
    kontrakan: 'Kontrakan',
    ruko: 'Ruko',
    villa: 'Villa',
    parkiran: 'Parkiran',
    penginapan: 'Penginapan',
  }
  return types[type] || type
}

export function formatRoomStatus(status: string): string {
  const statuses: Record<string, { label: string; color: string }> = {
    available: { label: 'Tersedia', color: 'text-green-600 bg-green-100' },
    occupied: { label: 'Terisi', color: 'text-blue-600 bg-blue-100' },
    maintenance: { label: 'Perbaikan', color: 'text-yellow-600 bg-yellow-100' },
    reserved: { label: 'Dipesan', color: 'text-purple-600 bg-purple-100' },
  }
  return statuses[status]?.label || status
}

export function getRoomStatusBadge(status: string) {
  const statuses: Record<string, { label: string; color: string }> = {
    available: { label: 'Tersedia', color: 'bg-green-100 text-green-800' },
    occupied: { label: 'Terisi', color: 'bg-blue-100 text-blue-800' },
    maintenance: { label: 'Perbaikan', color: 'bg-yellow-100 text-yellow-800' },
    reserved: { label: 'Dipesan', color: 'bg-purple-100 text-purple-800' },
  }
  return statuses[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
}

export function formatTenantStatus(status: string): string {
  const statuses: Record<string, string> = {
    waiting: 'Menunggu',
    active: 'Aktif',
    ended: 'Selesai',
    terminated: 'Dikeluarkan',
  }
  return statuses[status] || status
}

export function getTenantStatusBadge(status: string) {
  const statuses: Record<string, { label: string; color: string }> = {
    waiting: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
    active: { label: 'Aktif', color: 'bg-green-100 text-green-800' },
    ended: { label: 'Selesai', color: 'bg-gray-100 text-gray-800' },
    terminated: { label: 'Dikeluarkan', color: 'bg-red-100 text-red-800' },
  }
  return statuses[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
}

export function generateRoomNumbers(start: number, count: number): string[] {
  return Array.from({ length: count }, (_, i) => String(start + i))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
