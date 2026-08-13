// Property Types
export type PropertyType =
  | 'kos'
  | 'apartemen'
  | 'homestay'
  | 'hotel'
  | 'rumah'
  | 'kontrakan'
  | 'ruko'
  | 'villa'
  | 'parkiran'
  | 'penginapan'

export type RentalType = 'per_room' | 'per_property'

export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved'

export type TenantStatus = 'waiting' | 'active' | 'ended' | 'terminated'

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'

export type PaymentType = 'rent' | 'deposit' | 'electric' | 'water' | 'other'

export type IntervalType =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'bimonthly'
  | 'quarterly'
  | 'biannual'
  | 'yearly'

export type ExpenseType =
  | 'electric'
  | 'water'
  | 'gas'
  | 'internet'
  | 'parking'
  | 'cleaning'
  | 'maintenance'
  | 'other'

export type UnitType = 'per_kwh' | 'per_m3' | 'per_month' | 'per_use'

export interface Property {
  id: string
  user_id: string
  name: string
  type: PropertyType
  rental_type: RentalType
  description?: string
  address?: string
  country: string
  province?: string
  city?: string
  district?: string
  village?: string
  postal_code?: string
  phone?: string
  image_url?: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  property_id: string
  room_number: string
  room_type?: string
  description?: string
  floor?: number
  status: RoomStatus
  created_at: string
  updated_at: string
}

export interface RentalPrice {
  id: string
  property_id?: string
  room_id?: string
  interval_type: IntervalType
  amount: number
  is_default: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  user_id: string
  property_id?: string
  room_id?: string
  name: string
  phone?: string
  email?: string
  id_card?: string
  emergency_contact?: string
  start_date: string
  end_date?: string
  start_time: string
  end_time: string
  deposit?: number
  rental_price_id?: string
  status: TenantStatus
  notes?: string
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  property_id?: string
  room_id?: string
  expense_type: ExpenseType
  rate: number
  unit?: UnitType
  is_active: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  tenant_id: string
  amount: number
  payment_type: PaymentType
  due_date?: string
  paid_date?: string
  period_month?: string
  status: PaymentStatus
  payment_method?: string
  notes?: string
  created_at: string
  updated_at: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

// Property with relations
export interface PropertyWithRooms extends Property {
  rooms: Room[]
  rental_prices?: RentalPrice[]
  expenses?: Expense[]
}

// Room with relations
export interface RoomWithDetails extends Room {
  property?: Property
  rental_prices?: RentalPrice[]
  expenses?: Expense[]
  tenants?: Tenant[]
}

// Tenant with relations
export interface TenantWithDetails extends Tenant {
  property?: Property
  room?: Room
  rental_price?: RentalPrice
  payments?: Payment[]
}
