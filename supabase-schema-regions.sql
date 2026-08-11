-- ============================================
-- SINGLE WILAYAH TABLE
-- Hierarchical kode system for Indonesian regions
-- Format: XX.XX.XX.XXXX = Province.City.District.Village
-- ============================================

-- Single table with hierarchical structure
DROP TABLE IF EXISTS wilayah;
CREATE TABLE IF NOT EXISTS wilayah (
    kode varchar(13) NOT NULL PRIMARY KEY,
    nama varchar(100) NOT NULL,
    level varchar(20) NOT NULL,  -- 'province', 'regency', 'district', 'village'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_wilayah_level ON wilayah(level);
CREATE INDEX IF NOT EXISTS idx_wilayah_nama ON wilayah(nama);
CREATE INDEX IF NOT EXISTS idx_wilayah_parent ON wilayah(kode);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE wilayah ENABLE ROW LEVEL SECURITY;

-- Public read access (everyone can read wilayah)
CREATE POLICY "Allow public read wilayah" ON wilayah FOR SELECT USING (true);

-- ============================================
-- NOTES FOR IMPORTING DATA
-- ============================================
-- 1. Your wilayah.sql file has INSERT statements for all regions
-- 2. Edit the CREATE TABLE syntax to be PostgreSQL compatible
-- 3. After importing, you can set the level column with:
--
-- UPDATE wilayah SET level =
--   CASE
--     WHEN LENGTH(kode) = 2 THEN 'province'
--     WHEN LENGTH(kode) = 5 THEN 'regency'
--     WHEN LENGTH(kode) = 8 THEN 'district'
--     WHEN LENGTH(kode) > 8 THEN 'village'
--   END;
--
-- Or if your SQL already has proper INSERT, make sure each INSERT
-- includes the 'level' column.
