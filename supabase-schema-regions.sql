-- ============================================
-- REGIONS TABLES (Provinces, Regencies, Districts, Villages)
-- Data source: https://github.com/emsifa/api-wilayah-indonesia
-- ============================================

-- Provinces (Provinsi)
CREATE TABLE IF NOT EXISTS provinces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regencies/Cities (Kota/Kabupaten)
CREATE TABLE IF NOT EXISTS regencies (
    id SERIAL PRIMARY KEY,
    province_id INTEGER REFERENCES provinces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,  -- 'kabupaten' or 'kota'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Districts (Kecamatan)
CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    regency_id INTEGER REFERENCES regencies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Villages (Kelurahan/Desa)
CREATE TABLE IF NOT EXISTS villages (
    id SERIAL PRIMARY KEY,
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all region tables
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE regencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE villages ENABLE ROW LEVEL SECURITY;

-- Public read access (everyone can read regions)
CREATE POLICY "Allow public read provinces" ON provinces FOR SELECT USING (true);
CREATE POLICY "Allow public read regencies" ON regencies FOR SELECT USING (true);
CREATE POLICY "Allow public read districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Allow public read villages" ON villages FOR SELECT USING (true);

-- ============================================
-- INDEXES FOR BETTER PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_regencies_province_id ON regencies(province_id);
CREATE INDEX IF NOT EXISTS idx_districts_regency_id ON districts(regency_id);
CREATE INDEX IF NOT EXISTS idx_villages_district_id ON villages(district_id);
