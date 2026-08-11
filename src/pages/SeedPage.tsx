import { useState } from 'react'
import { Database, RefreshCw, Check, AlertCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'

// API Base URL
const API_BASE = 'https://emsifa.github.io/api-wilayah-indonesia/api'

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

type SeedStatus = 'idle' | 'seeding' | 'success' | 'error'

interface SeedProgress {
  stage: string
  current: number
  total: number
  count: number
}

export function SeedDataPage() {
  const [status, setStatus] = useState<SeedStatus>('idle')
  const [progress, setProgress] = useState<SeedProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Get Supabase credentials from environment
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  // Helper to fetch JSON
  async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  // Helper to insert to Supabase
  async function supabaseInsert(table: string, data: unknown[]) {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Failed to insert to ${table}: ${text}`)
    }
  }

  const seed = async () => {
    setStatus('seeding')
    setError(null)

    // Check credentials
    if (!supabaseUrl || !supabaseKey) {
      setStatus('error')
      setError('Environment variables tidak ditemukan. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah diset.')
      return
    }

    try {
      // 1. Seed Provinces
      setProgress({ stage: '📍 Memuat provinces...', current: 0, total: 0, count: 0 })
      const provinces = await fetchJson<Province[]>(`${API_BASE}/provinces.json`)
      const provinceData = provinces.map((p) => ({ id: p.id, name: p.name }))
      await supabaseInsert('provinces', provinceData)
      setProgress({ stage: `✅ Provinces: ${provinces.length} data`, current: 1, total: 1, count: provinces.length })

      // 2. Seed Regencies
      setProgress({ stage: '📍 Memuat regencies (kota/kabupaten)...', current: 0, total: provinces.length, count: 0 })
      let totalRegencies = 0

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
        totalRegencies += regencies.length
        setProgress({
          stage: `📍 Regencies: ${i + 1}/${provinces.length} provinces`,
          current: i + 1,
          total: provinces.length,
          count: totalRegencies,
        })
      }

      // 3. Seed Districts
      setProgress({ stage: '📍 Memuat districts (kecamatan)...', current: 0, total: provinces.length, count: 0 })
      let totalDistricts = 0

      for (let i = 0; i < provinces.length; i++) {
        const province = provinces[i]
        const regencies = await fetchJson<Regency[]>(`${API_BASE}/regencies/${province.id}.json`)

        for (const regency of regencies) {
          try {
            const districts = await fetchJson<District[]>(`${API_BASE}/districts/${regency.id}.json`)
            const districtData = districts.map((d) => ({
              id: d.id,
              regency_id: d.regency_id,
              name: d.name,
            }))
            await supabaseInsert('districts', districtData)
            totalDistricts += districts.length
          } catch {
            // Skip if no districts
          }
        }
        setProgress({
          stage: `📍 Districts: ${i + 1}/${provinces.length} provinces`,
          current: i + 1,
          total: provinces.length,
          count: totalDistricts,
        })
      }

      // 4. Seed Villages
      setProgress({ stage: '📍 Memuat villages (kelurahan/desa)...', current: 0, total: provinces.length, count: 0 })
      let totalVillages = 0

      for (let i = 0; i < provinces.length; i++) {
        const province = provinces[i]
        const regencies = await fetchJson<Regency[]>(`${API_BASE}/regencies/${province.id}.json`)

        for (const regency of regencies) {
          try {
            const districts = await fetchJson<District[]>(`${API_BASE}/districts/${regency.id}.json`)

            for (const district of districts) {
              try {
                const villages = await fetchJson<Village[]>(`${API_BASE}/villages/${district.id}.json`)
                const villageData = villages.map((v) => ({
                  id: v.id,
                  district_id: v.district_id,
                  name: v.name,
                }))
                await supabaseInsert('villages', villageData)
                totalVillages += villages.length
              } catch {
                // Skip
              }
            }
          } catch {
            // Skip
          }
        }
        setProgress({
          stage: `📍 Villages: ${i + 1}/${provinces.length} provinces`,
          current: i + 1,
          total: provinces.length,
          count: totalVillages,
        })
      }

      setStatus('success')
      setProgress({
        stage: '🎉 Selesai!',
        current: provinces.length,
        total: provinces.length,
        count: totalVillages,
      })
    } catch (err) {
      console.error('Seed error:', err)
      setStatus('error')
      setError((err as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Database className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Seed Data Wilayah Indonesia</h1>
            <p className="text-gray-600 mt-2">
              Mengambil data provinces, regencies, districts, dan villages dari API
            </p>
          </div>

          {/* Debug Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 text-xs font-mono">
            <p>Supabase URL: {supabaseUrl ? '✅ Diset' : '❌ Tidak ada'}</p>
            <p>Supabase Key: {supabaseKey ? '✅ Diset' : '❌ Tidak ada'}</p>
          </div>

          {status === 'idle' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Perhatian:</strong> Data akan diambil dari GitHub API dan disimpan ke Supabase.
                  Proses ini mungkin memakan waktu beberapa menit.
                </p>
              </div>

              <Button onClick={seed} className="w-full" size="lg" disabled={!supabaseUrl || !supabaseKey}>
                <RefreshCw className="w-5 h-5 mr-2" />
                Mulai Seed Data
              </Button>

              {!supabaseUrl && (
                <p className="text-red-500 text-sm text-center">
                  Environment variables belum diset. Pastikan di Vercel sudah ditambahkan.
                </p>
              )}
            </div>
          )}

          {status === 'seeding' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">{progress?.stage}</p>
                {progress && (
                  <div className="mt-2">
                    <div className="w-full bg-yellow-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full transition-all"
                        style={{ width: progress.total > 0 ? `${(progress.current / progress.total) * 100}%` : '0%' }}
                      />
                    </div>
                    <p className="text-yellow-700 text-sm mt-1">
                      {progress.count.toLocaleString()} data terinsert
                    </p>
                  </div>
                )}
              </div>
              <p className="text-center text-gray-500 text-sm">Jangan menutup halaman ini...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Check className="w-5 h-5" />
                  <span className="font-bold">Berhasil!</span>
                </div>
                <p className="text-green-700 mt-2">
                  Data wilayah Indonesia sudah berhasil di-seed.
                </p>
                <p className="text-green-600 text-sm mt-1">
                  Total: {progress?.count?.toLocaleString()} villages
                </p>
              </div>

              <a href="/dashboard" className="block">
                <Button className="w-full">
                  Kembali ke Dashboard
                </Button>
              </a>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-bold">Error</span>
                </div>
                <p className="text-red-700 mt-2 text-sm">{error}</p>

                <div className="mt-4 p-3 bg-red-100 rounded text-xs">
                  <p className="font-medium text-red-800 mb-2">Kemungkinan penyebab:</p>
                  <ol className="text-red-700 list-decimal list-inside space-y-1">
                    <li>Environment variables belum diset di Vercel</li>
                    <li>CORS tidak diizinkan di Supabase</li>
                    <li>Koneksi internet terputus</li>
                  </ol>
                </div>

                <a
                  href="https://supabase.com/dashboard/project/_/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-3"
                >
                  <ExternalLink className="w-4 h-4" />
                  Cek Supabase API Settings
                </a>
              </div>

              <Button onClick={() => { setStatus('idle'); setError(null); }} className="w-full" variant="outline">
                Coba Lagi
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
