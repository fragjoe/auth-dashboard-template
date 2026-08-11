-- Property Manager Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    rental_type VARCHAR(50) NOT NULL,
    description TEXT,
    address TEXT,
    country VARCHAR(100) DEFAULT 'Indonesia',
    province VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    postal_code VARCHAR(10),
    phone VARCHAR(20),
    image_url TEXT,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    room_type VARCHAR(100),
    description TEXT,
    floor INTEGER,
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, room_number)
);

-- Rental Prices Table
CREATE TABLE IF NOT EXISTS rental_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    interval_type VARCHAR(50) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (
        (property_id IS NOT NULL AND room_id IS NULL) OR
        (property_id IS NULL AND room_id IS NOT NULL)
    )
);

-- Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    id_card VARCHAR(50),
    emergency_contact VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    start_time TIME DEFAULT '14:00',
    end_time TIME DEFAULT '12:00',
    deposit DECIMAL(12, 2),
    rental_price_id UUID REFERENCES rental_prices(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (
        (property_id IS NOT NULL AND room_id IS NULL) OR
        (property_id IS NULL AND room_id IS NOT NULL)
    )
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    expense_type VARCHAR(50) NOT NULL,
    rate DECIMAL(12, 2) NOT NULL,
    unit VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_type VARCHAR(50) NOT NULL,
    due_date DATE,
    paid_date DATE,
    period_month VARCHAR(7),
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Properties Policies
CREATE POLICY "Users can CRUD their own properties"
ON properties
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Rooms Policies
CREATE POLICY "Users can access their property rooms"
ON rooms
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM properties
        WHERE properties.id = rooms.property_id
        AND properties.user_id = auth.uid()
    )
);

-- Tenants Policies
CREATE POLICY "Users can CRUD their own tenants"
ON tenants
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Rental Prices Policies
CREATE POLICY "Users can access prices for their properties"
ON rental_prices
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM properties
        WHERE properties.id = rental_prices.property_id
        AND properties.user_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1 FROM rooms
        JOIN properties ON properties.id = rooms.property_id
        WHERE rooms.id = rental_prices.room_id
        AND properties.user_id = auth.uid()
    )
);

-- Expenses Policies
CREATE POLICY "Users can access expenses for their properties"
ON expenses
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM properties
        WHERE properties.id = expenses.property_id
        AND properties.user_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1 FROM rooms
        JOIN properties ON properties.id = rooms.property_id
        WHERE rooms.id = expenses.room_id
        AND properties.user_id = auth.uid()
    )
);

-- Payments Policies
CREATE POLICY "Users can access payments for their tenants"
ON payments
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM tenants
        WHERE tenants.id = payments.tenant_id
        AND tenants.user_id = auth.uid()
    )
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rental_prices_updated_at
    BEFORE UPDATE ON rental_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
