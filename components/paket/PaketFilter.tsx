'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

interface Props {
  wilayahs: { id: string; nama: string; slug: string }[]
}

export default function PaketFilter({ wilayahs }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [wilayah, setWilayah] = useState(searchParams.get('wilayah') || '')
  const [durasi, setDurasi] = useState(searchParams.get('durasi') || '')

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (wilayah) params.set('wilayah', wilayah)
    if (durasi) params.set('durasi', durasi)
    router.push('/paket-wisata?' + params.toString())
  }

  const handleReset = () => {
    setQ(''); setWilayah(''); setDurasi('')
    router.push('/paket-wisata')
  }

  return (
    <div className="flex flex-wrap gap-3 mb-8 bg-white p-4 rounded-xl shadow-sm border">
      <input
        value={q} onChange={e => setQ(e.target.value)}
        placeholder="Cari paket wisata..."
        onKeyDown={e => e.key === 'Enter' && handleFilter()}
        className="flex-1 min-w-48 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select value={wilayah} onChange={e => setWilayah(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Semua Wilayah</option>
        {wilayahs.map(w => <option key={w.id} value={w.slug}>{w.nama}</option>)}
      </select>
      <select value={durasi} onChange={e => setDurasi(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Semua Durasi</option>
        <option value="3">3 Hari</option>
        <option value="4">4 Hari</option>
        <option value="5">5 Hari</option>
        <option value="7">7 Hari</option>
      </select>
      <button onClick={handleFilter}
        className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-800 transition">
        <Search className="w-4 h-4" /> Filter
      </button>
      {(q || wilayah || durasi) && (
        <button onClick={handleReset} className="text-gray-500 text-sm hover:text-gray-700 px-3">Reset</button>
      )}
    </div>
  )
}