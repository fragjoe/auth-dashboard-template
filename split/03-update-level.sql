-- SET LEVEL COLUMN
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
