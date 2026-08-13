-- RLS POLICIES FIX - COMPLETE VERSION
-- Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- ============================================
-- PROPERTIES TABLE
-- ============================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Everyone can READ all properties
DROP POLICY IF EXISTS "all_auth_read" ON properties;
CREATE POLICY "all_auth_read" ON properties FOR SELECT TO authenticated USING (true);

-- Everyone can INSERT properties (user_id will be set automatically)
DROP POLICY IF EXISTS "all_auth_insert" ON properties;
CREATE POLICY "all_auth_insert" ON properties FOR INSERT TO authenticated WITH CHECK (true);

-- Users can only UPDATE their own properties
DROP POLICY IF EXISTS "users_update_own" ON properties;
CREATE POLICY "users_update_own" ON properties FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can only DELETE their own properties
DROP POLICY IF EXISTS "users_delete_own" ON properties;
CREATE POLICY "users_delete_own" ON properties FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============================================
-- TENANTS TABLE
-- ============================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Everyone can READ all tenants
DROP POLICY IF EXISTS "all_tenants_read" ON tenants;
CREATE POLICY "all_tenants_read" ON tenants FOR SELECT TO authenticated USING (true);

-- Everyone can INSERT tenants
DROP POLICY IF EXISTS "all_tenants_insert" ON tenants;
CREATE POLICY "all_tenants_insert" ON tenants FOR INSERT TO authenticated WITH CHECK (true);

-- Users can only UPDATE their own tenants
DROP POLICY IF EXISTS "users_update_own_tenants" ON tenants;
CREATE POLICY "users_update_own_tenants" ON tenants FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can only DELETE their own tenants
DROP POLICY IF EXISTS "users_delete_own_tenants" ON tenants;
CREATE POLICY "users_delete_own_tenants" ON tenants FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============================================
-- ROOMS TABLE
-- ============================================
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Everyone can READ all rooms
DROP POLICY IF EXISTS "all_rooms_read" ON rooms;
CREATE POLICY "all_rooms_read" ON rooms FOR SELECT TO authenticated USING (true);

-- Everyone can INSERT rooms
DROP POLICY IF EXISTS "all_rooms_insert" ON rooms;
CREATE POLICY "all_rooms_insert" ON rooms FOR INSERT TO authenticated WITH CHECK (true);

-- Everyone can UPDATE rooms
DROP POLICY IF EXISTS "all_rooms_update" ON rooms;
CREATE POLICY "all_rooms_update" ON rooms FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Everyone can DELETE rooms
DROP POLICY IF EXISTS "all_rooms_delete" ON rooms;
CREATE POLICY "all_rooms_delete" ON rooms FOR DELETE TO authenticated USING (true);

-- ============================================
-- RENTAL_PRICES TABLE
-- ============================================
ALTER TABLE rental_prices ENABLE ROW LEVEL SECURITY;

-- Everyone can READ all prices
DROP POLICY IF EXISTS "all_prices_read" ON rental_prices;
CREATE POLICY "all_prices_read" ON rental_prices FOR SELECT TO authenticated USING (true);

-- Everyone can INSERT prices
DROP POLICY IF EXISTS "all_prices_insert" ON rental_prices;
CREATE POLICY "all_prices_insert" ON rental_prices FOR INSERT TO authenticated WITH CHECK (true);

-- Everyone can DELETE prices
DROP POLICY IF EXISTS "all_prices_delete" ON rental_prices;
CREATE POLICY "all_prices_delete" ON rental_prices FOR DELETE TO authenticated USING (true);

-- ============================================
-- EXPENSES TABLE
-- ============================================
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Everyone can READ all expenses
DROP POLICY IF EXISTS "all_expenses_read" ON expenses;
CREATE POLICY "all_expenses_read" ON expenses FOR SELECT TO authenticated USING (true);

-- Everyone can INSERT expenses
DROP POLICY IF EXISTS "all_expenses_insert" ON expenses;
CREATE POLICY "all_expenses_insert" ON expenses FOR INSERT TO authenticated WITH CHECK (true);

-- Everyone can UPDATE expenses
DROP POLICY IF EXISTS "all_expenses_update" ON expenses;
CREATE POLICY "all_expenses_update" ON expenses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Everyone can DELETE expenses
DROP POLICY IF EXISTS "all_expenses_delete" ON expenses;
CREATE POLICY "all_expenses_delete" ON expenses FOR DELETE TO authenticated USING (true);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Everyone can READ all payments
DROP POLICY IF EXISTS "all_payments_read" ON payments;
CREATE POLICY "all_payments_read" ON payments FOR SELECT TO authenticated USING (true);

-- Everyone can INSERT payments
DROP POLICY IF EXISTS "all_payments_insert" ON payments;
CREATE POLICY "all_payments_insert" ON payments FOR INSERT TO authenticated WITH CHECK (true);

-- Everyone can UPDATE payments
DROP POLICY IF EXISTS "all_payments_update" ON payments;
CREATE POLICY "all_payments_update" ON payments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Everyone can DELETE payments
DROP POLICY IF EXISTS "all_payments_delete" ON payments;
CREATE POLICY "all_payments_delete" ON payments FOR DELETE TO authenticated USING (true);

SELECT '✅ RLS Policies Applied Successfully!' as status;
