#!/usr/bin/env python3
"""
Split wilayah.sql into smaller chunks for Supabase SQL Editor.
"""
import os

# Read the original file
with open('wilayah.sql', 'r') as f:
    content = f.read()

print(f"File size: {len(content):,} bytes")

# Create output directory
os.makedirs('split', exist_ok=True)

# Create header file
header = """-- WILAYAH - Create Table
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
"""

with open('split/01-header.sql', 'w') as f:
    f.write(header)
print("Created split/01-header.sql")

# Split by INSERT INTO statement
# Each province has its own INSERT statement
import re
insert_pattern = r"INSERT INTO wilayah \(kode, nama\)\s*\nVALUES\s*\n(.*?);"
matches = re.findall(insert_pattern, content, re.DOTALL)

print(f"Found {len(matches)} provinces")

# Chunk size - how many provinces per file
chunk_size = 3
num_chunks = (len(matches) + chunk_size - 1) // chunk_size

for chunk_idx in range(num_chunks):
    start_idx = chunk_idx * chunk_size
    end_idx = min((chunk_idx + 1) * chunk_size, len(matches))

    # Get the VALUES parts for this chunk
    chunk_values = matches[start_idx:end_idx]
    # Clean up each block - remove trailing semicolons
    cleaned_values = []
    for v in chunk_values:
        v = v.strip().rstrip(';').rstrip(',')
        cleaned_values.append(v)

    # Join with comma between provinces
    combined = ',\n'.join(cleaned_values)

    sql = f"""-- CHUNK {chunk_idx+1}/{num_chunks} (provinces {start_idx+1}-{end_idx})

INSERT INTO wilayah (kode, nama) VALUES
{combined};
"""

    filename = f'split/02-insert-{chunk_idx+1:02d}.sql'
    with open(filename, 'w') as f:
        f.write(sql)

    size = os.path.getsize(filename)
    print(f"Created {filename} ({size:,} bytes)")

# Create UPDATE file
update_sql = """-- SET LEVEL COLUMN
-- Run this LAST

UPDATE wilayah SET level =
  CASE
    WHEN LENGTH(kode) = 2 THEN 'province'
    WHEN LENGTH(kode) = 5 THEN 'regency'
    WHEN LENGTH(kode) = 8 THEN 'district'
    WHEN LENGTH(kode) > 8 THEN 'village'
  END;

-- Verify
SELECT level, COUNT(*) FROM wilayah GROUP BY level ORDER BY level;
"""

with open('split/03-update-level.sql', 'w') as f:
    f.write(update_sql)
print("Created split/03-update-level.sql")

print(f"\n=== CREATED {num_chunks + 2} FILES ===")
