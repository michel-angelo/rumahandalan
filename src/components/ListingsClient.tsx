'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Property, Location, Cluster } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  if (price >= 1_000_000_000)
    return `Rp ${(price / 1_000_000_000).toFixed(price % 1_000_000_000 === 0 ? 0 : 1)} M`
  if (price >= 1_000_000)
    return `Rp ${(price / 1_000_000).toFixed(0)} Jt`
  return `Rp ${price.toLocaleString('id-ID')}`
}

const statusConfig: Record<string, { label: string; className: string }> = {
  tersedia: { label: 'Tersedia', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  inden: { label: 'Inden', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  terjual: { label: 'Terjual', className: 'bg-red-50 text-red-600 border border-red-200' },
}

const paymentBadgeClass = 'bg-[#EEEDF8] text-[#343270] border border-[#C8C7E8]'

// ─── Property Card ────────────────────────────────────────────────────────────

function PropertyCard({ property }: { property: Property }) {
  const primaryImage = property.images?.find((img) => img.is_primary) ?? property.images?.[0]
  const status = statusConfig[property.status] ?? statusConfig['tersedia']
  const isSold = property.status === 'terjual'

  return (
    <Link
      href={`/listings/${property.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E4E4F0] hover:border-[#9D9BCF] hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[4/3] bg-[#F7F7FB] overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.image_url}
            alt={property.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? 'opacity-60' : ''}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-[#C8C8DC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            </svg>
          </div>
        )}
        <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
          {status.label}
        </span>
        {property.is_featured && (
          <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#343270] text-white">
            Unggulan
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        {(property.is_kpr || property.is_cash_keras || property.is_subsidi) && (
          <div className="flex flex-wrap gap-1.5">
            {property.is_kpr && <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${paymentBadgeClass}`}>KPR</span>}
            {property.is_cash_keras && <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${paymentBadgeClass}`}>Cash Keras</span>}
            {property.is_subsidi && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">Subsidi</span>}
          </div>
        )}

        <div>
          <h3 className="font-semibold text-[#141422] text-[15px] leading-snug line-clamp-2 group-hover:text-[#343270] transition-colors">
            {property.title}
          </h3>
          {property.location && (
            <p className="text-[13px] text-[#8E8EA8] mt-1 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.location.district}, {property.location.city}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 text-[12px] text-[#5A5A78] border-t border-[#F0F0F8] pt-3">
          <span className="flex items-center gap-1">🛏 {property.bedrooms} KT</span>
          <span className="flex items-center gap-1">🚿 {property.bathrooms} KM</span>
          <span className="flex items-center gap-1">📐 {property.building_area} m²</span>
        </div>

        <div className="mt-auto pt-1">
          <p className="font-serif text-[18px] font-bold text-[#343270]">
            {property.price_label ?? formatPrice(property.price)}
          </p>
          {property.price_per_month && (
            <p className="text-[11px] text-[#8E8EA8]">mulai {formatPrice(property.price_per_month)}/bln</p>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── Main Client Component ────────────────────────────────────────────────────

type Props = {
  properties: Property[]
  locations: Location[]
  clusters: Cluster[]
}

type SortKey = 'terbaru' | 'termurah' | 'termahal' | 'az' | 'za'

export default function ListingsClient({ properties, locations, clusters }: Props) {
  const searchParams = useSearchParams()

  const [type, setType] = useState(searchParams.get('type') ?? '')
  const [district, setDistrict] = useState(searchParams.get('district') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')
  const [clusterId, setClusterId] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [floors, setFloors] = useState('')
  const [status, setStatus] = useState('')
  const [certificate, setCertificate] = useState('')
  const [condition, setCondition] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('terbaru')
  const [showFilter, setShowFilter] = useState(false)

  const filtered = useMemo(() => {
    let result = [...properties]

    if (type) result = result.filter((p) => p.type === type)
    if (district) result = result.filter((p) => p.location?.district === district)
    if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice))
    if (clusterId) result = result.filter((p) => p.cluster_id === clusterId)
    if (bedrooms) result = result.filter((p) => bedrooms === '4' ? p.bedrooms >= 4 : p.bedrooms === Number(bedrooms))
    if (bathrooms) result = result.filter((p) => bathrooms === '3' ? p.bathrooms >= 3 : p.bathrooms === Number(bathrooms))
    if (floors) result = result.filter((p) => p.floors === Number(floors))
    if (status) result = result.filter((p) => p.status === status)
    if (certificate) result = result.filter((p) => p.certificate === certificate)
    if (condition) result = result.filter((p) => p.condition === condition)

    switch (sortBy) {
      case 'termurah': result.sort((a, b) => a.price - b.price); break
      case 'termahal': result.sort((a, b) => b.price - a.price); break
      case 'az': result.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'za': result.sort((a, b) => b.title.localeCompare(a.title)); break
      default: result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return result
  }, [properties, type, district, maxPrice, clusterId, bedrooms, bathrooms, floors, status, certificate, condition, sortBy])

  function resetFilters() {
    setType(''); setDistrict(''); setMaxPrice(''); setClusterId('')
    setBedrooms(''); setBathrooms(''); setFloors(''); setStatus('')
    setCertificate(''); setCondition(''); setSortBy('terbaru')
  }

  const activeFilterCount = [type, district, maxPrice, clusterId, bedrooms, bathrooms, floors, status, certificate, condition]
    .filter(Boolean).length

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <p className="text-[#5A5A78] text-[14px]">
          Menampilkan <span className="font-semibold text-[#141422]">{filtered.length}</span> properti
        </p>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="border border-[#E4E4F0] rounded-xl px-3 py-2 text-[13px] text-[#141422] focus:outline-none focus:border-[#343270] bg-white"
          >
            <option value="terbaru">Terbaru</option>
            <option value="termurah">Termurah</option>
            <option value="termahal">Termahal</option>
            <option value="az">A–Z</option>
            <option value="za">Z–A</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E4E4F0] bg-white text-[13px] font-semibold text-[#141422] hover:border-[#343270] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filter
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#343270] text-white text-[11px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="bg-white border border-[#E4E4F0] rounded-2xl p-5 mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Tipe */}
          <div>
            <label className="text-[12px] font-semibold text-[#5A5A78] mb-1 block">Tipe</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-[#E4E4F0] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#343270]">
              <option value="">Semua</option>
              <option value="rumah">Rumah</option>
              <option value="apartemen">Apartemen</option>
            </select>
          </div>

          {/* Lokasi */}
          <div>
            <label className="text-[12px] font-semibold text-[#5A5A78] mb-1 block">Kecamatan</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full border border-[#E4E4F0] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#343270]">
              <option value="">Semua</option>
              {locations.map((l) => (
                <option key={l.id} value={l.district}>{l.district}</option>
              ))}
            </select>
          </div>

          {/* Cluster */}
          <div>
            <label className="text-[12px] font-semibold text-[#5A5A78] mb-1 block">Cluster</label>
            <select value={clusterId} onChange={(e) => setClusterId(e.target.value)} className="w-full border border-[#E4E4F0] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#343270]">
              <option value="">Semua</option>
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Max Harga */}
          <div>
            <label className="text-[12px] font-semibold text-[#5A5A78] mb-1 block">Maks. Harga</label>
            <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full border border-[#E4E4F0] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#343270]">
              <option value="">Semua</option>
              <option value="300000000">300 Jt</option>
              <option value="500000000">500 Jt</option>
              <option value="750000000">750 Jt</option>
              <option value="1000000000">1 M</option>
              <option value="2000000000">2 M</option>
            </select>
          </div>

          {/* Kamar Tidur */}
          <div>
            <label className="text-[12px] font-semibold text-[#5A5A78] mb-1 block">Kamar Tidur</label>
            <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="w-full border border-[#E4E4F0] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#343270]">
              <option value="">Semua</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4+</option>
            </select>
          </div>

          {/* Kamar Mandi */}
          <div>
            <label className="text-[12px] font-semibold text-[#5A5A78] mb-1 block">Kamar Mandi</label>
            <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="w-full border border-[#E4E4F0] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#343270]">
              <option value="">Semua</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3+</option>
            </select>
          </div>

          {/* Lantai */}
          <div>
            <label className="text-[12px] font-semibold text-[#5A5A78] mb-1 block">Lantai</label>
            <select value={floors} onChange={(e) => setFloors(e.target.value)} className="w-full border border-[#E4E4F0] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#343270]">
              <option value="">Semua</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3+</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[12px] font-semibold text-[#5A5A78] mb-1 block">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-[#E4E4F0] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#343270]">
              <option value="">Semua</option>
              <option value="tersedia">Tersedia</option>
              <option value="inden">Inden</option>
              <option value="terjual">Terjual</option>
            </select>
          </div>

          {/* Sertifikat */}
          <div>
            <label className="text-[12px] font-semibold text-[#5A5A78] mb-1 block">Sertifikat</label>
            <select value={certificate} onChange={(e) => setCertificate(e.target.value)} className="w-full border border-[#E4E4F0] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#343270]">
              <option value="">Semua</option>
              <option value="shm">SHM</option>
              <option value="hgb">HGB</option>
              <option value="ajb">AJB</option>
            </select>
          </div>

          {/* Kondisi */}
          <div>
            <label className="text-[12px] font-semibold text-[#5A5A78] mb-1 block">Kondisi</label>
            <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full border border-[#E4E4F0] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#343270]">
              <option value="">Semua</option>
              <option value="baru">Baru</option>
              <option value="second">Second</option>
            </select>
          </div>

          {/* Reset */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="text-[13px] text-[#8E8EA8] hover:text-red-500 transition-colors font-semibold"
            >
              Reset Filter
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-[#8E8EA8]">
          <svg className="w-14 h-14 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
          </svg>
          <p className="text-[15px] font-semibold mb-1">Properti tidak ditemukan</p>
          <p className="text-[13px]">Coba ubah filter pencarian Anda</p>
          <button onClick={resetFilters} className="mt-4 px-5 py-2.5 rounded-xl bg-[#343270] text-white text-[13px] font-semibold hover:bg-[#2E9AB8] transition-colors">
            Reset Filter
          </button>
        </div>
      )}
    </div>
  )
}