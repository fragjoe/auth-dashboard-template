/**
 * Seed Script for Indonesian Regions
 * Run this script to populate provinces, regencies, districts, and villages
 *
 * Usage:
 *   npx ts-node seed-regions.ts
 *
 * Or with tsx:
 *   npx tsx seed-regions.ts
 *
 * Make sure to set environment variables:
 *   SUPABASE_URL=your-supabase-url
 *   SUPABASE_ANON_KEY=your-anon-key
 */

import * as https from 'https'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || ''

// API Base URL
const API_BASE = 'https://emsifa.github.io/api-wilayah-indonesia/api'

// Helper to fetch JSON
function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

// Helper to insert to Supabase
async function supabaseInsert(table: string, data: unknown[]) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

interface Province {
  id: number
  name: string
}

interface Regency {
  id: number
  province_id: number
  name: string
  type: string
}

interface District {
  id: number
  regency_id: number
  name: string
}

interface Village {
  id: number
  district_id: number
  name: string
}

async function seed() {
  console.log('🚀 Starting seed for Indonesian regions...\n')

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables')
    process.exit(1)
  }

  try {
    // 1. Seed Provinces
    console.log('📍 Fetching provinces...')
    const provinces = await fetchJson<Province[]>(`${API_BASE}/provinces.json`)
    console.log(`   Found ${provinces.length} provinces`)

    const provinceData = provinces.map((p) => ({ id: p.id, name: p.name }))
    await supabaseInsert('provinces', provinceData)
    console.log('   ✅ Provinces inserted\n')

    // 2. Seed Regencies (batch by province)
    console.log('📍 Fetching and inserting regencies by province...')
    let regencyCount = 0

    for (let i = 0; i < provinces.length; i++) {
      const province = provinces[i]
      const regencies = await fetchJson<Regency[]>(`${API_BASE}/regencies/${province.id}.json`)
      const regencyData = regencies.map((r) => ({
        id: r.id,
        province_id: r.province_id,
        name: r.name.replace(/^(Kabupaten|Kota)\s+/i, ''),
        type: r.name.toLowerCase().startsWith('kota ') ? 'kota' : 'kabupaten',
      }))
      await supabaseInsert('regencies', regencyData)
      regencyCount += regencies.length
      process.stdout.write(`\r   Progress: ${i + 1}/${provinces.length} provinces (${regencyCount} regencies)`)
    }
    console.log('\n   ✅ Regencies inserted\n')

    // 3. Seed Districts (batch by regency)
    console.log('📍 Fetching and inserting districts by regency...')
    let districtCount = 0

    for (let i = 0; i < provinces.length; i++) {
      const province = provinces[i]
      const regencies = await fetchJson<Regency[]>(`${API_BASE}/regencies/${province.id}.json`)

      for (let j = 0; j < regencies.length; j++) {
        const regency = regencies[j]
        try {
          const districts = await fetchJson<District[]>(`${API_BASE}/districts/${regency.id}.json`)
          const districtData = districts.map((d) => ({
            id: d.id,
            regency_id: d.regency_id,
            name: d.name,
          }))
          await supabaseInsert('districts', districtData)
          districtCount += districts.length
        } catch {
          // Skip if no districts found
        }
        process.stdout.write(`\r   Progress: ${i + 1}/${provinces.length} provinces, ${j + 1}/${regencies.length} regencies (${districtCount} districts)`)
      }
    }
    console.log('\n   ✅ Districts inserted\n')

    // 4. Seed Villages (batch by district)
    console.log('📍 Fetching and inserting villages by district...')
    let villageCount = 0

    // Get all districts
    const allRegencies = []
    for (const province of provinces) {
      const regencies = await fetchJson<Regency[]>(`${API_BASE}/regencies/${province.id}.json`)
      allRegencies.push(...regencies)
    }

    const allDistricts = []
    for (const regency of allRegencies) {
      try {
        const districts = await fetchJson<District[]>(`${API_BASE}/districts/${regency.id}.json`)
        allDistricts.push(...districts)
      } catch {
        // Skip
      }
    }

    for (let i = 0; i < allDistricts.length; i++) {
      const district = allDistricts[i]
      try {
        const villages = await fetchJson<Village[]>(`${API_BASE}/villages/${district.id}.json`)
        const villageData = villages.map((v) => ({
          id: v.id,
          district_id: v.district_id,
          name: v.name,
        }))
        await supabaseInsert('villages', villageData)
        villageCount += villages.length
      } catch {
        // Skip if no villages found
      }
      if (i % 100 === 0) {
        process.stdout.write(`\r   Progress: ${i + 1}/${allDistricts.length} districts (${villageCount} villages)`)
      }
    }
    console.log('\n   ✅ Villages inserted\n')

    console.log('🎉 Seed completed successfully!')
    console.log(`   - ${provinces.length} provinces`)
    console.log(`   - ${regencyCount} regencies`)
    console.log(`   - ${districtCount} districts`)
    console.log(`   - ${villageCount} villages`)
  } catch (error) {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()
