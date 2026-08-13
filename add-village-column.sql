-- Add village column to properties table
-- Run this in Supabase SQL Editor

ALTER TABLE properties ADD COLUMN IF NOT EXISTS village TEXT;

SELECT '✅ Added village column to properties table' as status;
