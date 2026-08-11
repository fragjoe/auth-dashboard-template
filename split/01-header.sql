-- WILAYAH - Create Table
-- Run this FIRST

DROP TABLE IF EXISTS wilayah;
CREATE TABLE IF NOT EXISTS wilayah (
    kode varchar(13) NOT NULL PRIMARY KEY,
    nama varchar(100) NOT NULL,
    level varchar(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wilayah_level ON wilayah(level);
CREATE INDEX IF NOT EXISTS idx_wilayah_nama ON wilayah(nama);

ALTER TABLE wilayah ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read wilayah" ON wilayah FOR SELECT USING (true);
