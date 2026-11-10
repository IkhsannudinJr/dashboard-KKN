'use client';

import dynamic from 'next/dynamic';

// Memuat komponen peta secara dinamis tanpa Server-Side Rendering (SSR)
const MapKkn = dynamic(() => import('@/components/MapKkn'), {
  ssr: false,
  loading: () => <p className="text-center py-10">Memuat peta wilayah KKN...</p>
});

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard KKN Wonogiri</h1>
          <p className="text-gray-600">Pemetaan lokasi mahasiswa KKN di wilayah Kabupaten Wonogiri</p>
        </header>

        {/* Kotak Wadah Peta */}
        <section className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Peta Lokasi KKN</h2>
          <div className="w-full h-[450px] rounded-lg overflow-hidden border">
            <MapKkn />
          </div>
        </section>
      </div>
    </main>
  );
}
