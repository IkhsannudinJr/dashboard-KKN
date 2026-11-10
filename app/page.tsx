'use client';

import dynamic from 'next/dynamic';

const MapKkn = dynamic(() => import('../components/MapKKN'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
        <p className="text-sm font-medium text-slate-300">
          Memuat citra satelit & peta sebaran KKN Wonogiri...
        </p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <MapKkn isFullWindow={true} />
    </main>
  );
}
