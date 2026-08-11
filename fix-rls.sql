-- RLS POLICIES FIX
-- Run this in Supabase SQL Editor

-- Drop old policies
DROP POLICY IF EXISTS "Users can CRUD their own properties" ON properties;
DROP POLICY IF EXISTS "Users can access their property rooms" ON rooms;
DROP POLICY IF EXISTS "Users can CRUD their own tenants" ON tenants;
DROP POLICY IF EXISTS "Users can access prices for their properties" ON rental_prices;
DROP POLICY IF EXISTS "Users can access expenses for their properties" ON expenses;
DROP POLICY IF EXISTS "Users can access payments for their tenants" ON payments;

-- Properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all_auth_read" ON properties FOR SELECT TO authenticated USING (true);
CREATE POLICY "all_auth_insert" ON properties FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "all_auth_update" ON properties FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "all_auth_delete" ON properties FOR DELETE TO authenticated USING (true);

-- Rooms
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all_rooms_read" ON rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "all_rooms_insert" ON rooms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "all_rooms_update" ON rooms FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "all_rooms_delete" ON rooms FOR DELETE TO authenticated USING (true);

-- Tenants
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all_tenants_read" ON tenants FOR SELECT TO authenticated USING (true);
CREATE POLICY "all_tenants_insert" ON tenants FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "all_tenants_update" ON tenants FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "all_tenants_delete" ON tenants FOR DELETE TO authenticated USING (true);

-- Rental Prices
ALTER TABLE rental_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all_prices_read" ON rental_prices FOR SELECT TO authenticated USING (true);
CREATE POLICY "all_prices_insert" ON rental_prices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "all_prices_update" ON rental_prices FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "all_prices_delete" ON rental_prices FOR DELETE TO authenticated USING (true);

-- Expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all_expenses_read" ON expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "all_expenses_insert" ON expenses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "all_expenses_update" ON expenses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "all_expenses_delete" ON expenses FOR DELETE TO authenticated USING (true);

-- Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all_payments_read" ON payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "all_payments_insert" ON payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "all_payments_update" ON payments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "all_payments_delete" ON payments FOR DELETE TO authenticated USING (true);

SELECT 'RLS Fixed!' as status;
