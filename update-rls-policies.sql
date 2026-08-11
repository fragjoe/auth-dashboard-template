-- ============================================
-- UPDATE RLS POLICIES
-- Run this in Supabase SQL Editor
-- Makes all authenticated users see ALL data
-- ============================================

-- 1. PROPERTIES - Allow all authenticated users to see all properties
DROP POLICY IF EXISTS "Users can CRUD their own properties" ON properties;
CREATE POLICY "Allow authenticated users see all properties"
ON properties FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users manage properties"
ON properties
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 2. ROOMS - Allow all authenticated users see all rooms
DROP POLICY IF EXISTS "Users can access their property rooms" ON rooms;
CREATE POLICY "Allow authenticated users see all rooms"
ON rooms
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users manage rooms"
ON rooms
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = authenticated');

-- 3. TENANTS - Allow all authenticated users see all tenants
DROP POLICY IF EXISTS "Users can CRUD their own tenants" ON tenants;
CREATE POLICY "Allow authenticated users see all tenants"
ON tenants
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users manage tenants"
ON tenants
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 4. RENTAL PRICES - Allow all authenticated users
DROP POLICY IF EXISTS "Users can access prices for their properties" ON rental_prices;
CREATE POLICY "Allow authenticated users see all prices"
ON rental_prices
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users manage prices"
ON rental_prices
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 5. EXPENSES - Allow all authenticated users
DROP POLICY IF EXISTS "Users can access expenses for their properties" ON expenses;
CREATE POLICY "Allow authenticated users see all expenses"
ON expenses
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users manage expenses"
ON expenses
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 6. PAYMENTS - Allow all authenticated users
DROP POLICY IF EXISTS "Users can access payments for their tenants" ON payments;
CREATE POLICY "Allow authenticated users see all payments"
ON payments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users manage payments"
ON payments
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 7. PROFILES - Allow all authenticated users see profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Allow authenticated users see all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users update all profiles"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 8. WILAYAH - Allow public read
DROP POLICY IF EXISTS "Allow public read wilayah" ON wilayah;
CREATE POLICY "Allow public read wilayah"
ON wilayah
FOR SELECT
TO authenticated
USING (true);

-- Verify
SELECT 'RLS Policies updated successfully' AS status;
