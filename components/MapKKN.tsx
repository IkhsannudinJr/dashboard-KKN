'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Koordinat Geografis Presisi 25 Kecamatan Kabupaten Wonogiri (Sumber: Bapperida Wonogiri)
export const KECAMATAN_COORDINATES: Record<string, { lat: number; lng: number; name: string }> = {
  selogiri: { lat: -7.7845, lng: 110.9032, name: 'Selogiri' },
  wonogiri: { lat: -7.8142, lng: 110.9254, name: 'Wonogiri' },
  manyaran: { lat: -7.8542, lng: 110.7645, name: 'Manyaran' },
  wuryantoro: { lat: -7.9042, lng: 110.8753, name: 'Wuryantoro' },
  eromoko: { lat: -7.9863, lng: 110.8652, name: 'Eromoko' },
  pracimantoro: { lat: -8.0694, lng: 110.8228, name: 'Pracimantoro' },
  giritontro: { lat: -8.1367, lng: 110.9012, name: 'Giritontro' },
  giriwoyo: { lat: -8.0772, lng: 110.9765, name: 'Giriwoyo' },
  baturetno: { lat: -8.0068, lng: 110.9851, name: 'Baturetno' },
  batuwarno: { lat: -7.9798, lng: 111.0924, name: 'Batuwarno' },
  nguntoronadi: { lat: -7.9103, lng: 111.0375, name: 'Nguntoronadi' },
  ngadirojo: { lat: -7.8286, lng: 111.0028, name: 'Ngadirojo' },
  sidoharjo: { lat: -7.8173, lng: 111.0768, name: 'Sidoharjo' },
  girimarto: { lat: -7.7314, lng: 111.0941, name: 'Girimarto' },
  jatipurno: { lat: -7.7208, lng: 111.1685, name: 'Jatipurno' },
  jatisrono: { lat: -7.7942, lng: 111.1432, name: 'Jatisrono' },
  jatiroto: { lat: -7.8552, lng: 111.1718, name: 'Jatiroto' },
  slogohimo: { lat: -7.7792, lng: 111.2064, name: 'Slogohimo' },
  bulukerto: { lat: -7.7186, lng: 111.2589, name: 'Bulukerto' },
  puhpelem: { lat: -7.7554, lng: 111.2789, name: 'Puhpelem' },
  purwantoro: { lat: -7.8152, lng: 111.2825, name: 'Purwantoro' },
  kismantoro: { lat: -7.8687, lng: 111.2721, name: 'Kismantoro' },
  tirtomoyo: { lat: -7.9482, lng: 111.1378, name: 'Tirtomoyo' },
  karangtengah: { lat: -8.0381, lng: 111.1554, name: 'Karangtengah' },
  paranggupito: { lat: -8.2045, lng: 110.8354, name: 'Paranggupito' },
};

export type KKNStatus = 'Proses' | 'Selesai' | 'Usulan';

export interface DataKKN {
  id: string;
  kode: string;
  ptn: string;
  ptnFullName: string;
  status: KKNStatus;
  pic: string;
  kontak: string;
  kecamatan: string[];
  lokasi: string;
  tglUsulan: string;
  tglBuka: string;
  tglTutup: string;
  tinjauan?: string;
  koordinatKhusus?: [number, number];
}

// Data Riil KKN Bapperida Kabupaten Wonogiri (Tahun 2026/2027)
export const KKN_DATA_WONOGIRI: DataKKN[] = [
  {
    id: 'kkn-ipb',
    kode: '21308',
    ptn: 'IPB',
    ptnFullName: 'Institut Pertanian Bogor',
    status: 'Selesai',
    pic: 'Handian Purwawangsa',
    kontak: '+6281262106768',
    kecamatan: ['Sidoharjo', 'Jatiroto', 'Jatisrono', 'Wonogiri'],
    lokasi:
      'Desa Pingkuk, Desa Mojopuro, Desa Pesido, Desa Cangkring, Desa Sanggorng, Desa Jatirejo, Desa Tremes, Desa Kebon Agung, Desa Ngabeyan, Desa Sembukan, Desa Tempursari, Desa Jatinom, Desa Mojoreno, Desa Widoro, Desa Kedunggupit, Desa Sumpekerep, Kelurahan Sidoharjo, Kelurahan Kayuloko, Desa Manjung',
    tglUsulan: '2026-06-17',
    tglBuka: '2026-07-06',
    tglTutup: '2026-08-14',
    tinjauan: '-',
  },
  {
    id: 'kkn-stabn',
    kode: '21871',
    ptn: 'STABN Wonogiri',
    ptnFullName: 'STABN Raden Wijaya Wonogiri',
    status: 'Selesai',
    pic: 'Tri Yatno',
    kontak: '+6285870418109',
    kecamatan: ['Bulukerto'],
    lokasi: 'Desa Krandegan',
    tglUsulan: '2026-07-01',
    tglBuka: '2026-07-14',
    tglTutup: '2026-08-21',
    tinjauan: '-',
  },
  {
    id: 'kkn-stai',
    kode: '5837',
    ptn: 'STAI Mulia Astuti',
    ptnFullName: 'STAI Mulia Astuti Wonogiri',
    status: 'Proses',
    pic: 'Amir Mukminin, S.Pd.I., M.Pd.',
    kontak: '082223204552',
    kecamatan: ['Jatipurno', 'Wonogiri', 'Selogiri'],
    lokasi: 'Jatipurno (Slogoretno), Wonogiri (Pokoh Kidul), Selogiri (Sendang Ijo)',
    tglUsulan: '2026-01-21',
    tglBuka: '2026-07-07',
    tglTutup: '2026-08-20',
    tinjauan: '-',
  },
  {
    id: 'kkn-ugm-1',
    kode: '3814',
    ptn: 'UGM 1',
    ptnFullName: 'Universitas Gadjah Mada (Tahap 1)',
    status: 'Proses',
    pic: 'Elisa Dwi Rohani, S.E., M.Sc',
    kontak: '085932932705',
    kecamatan: ['Slogohimo'],
    lokasi: 'Desa Setren & Desa Sokoboyo',
    tglUsulan: '2026-01-10',
    tglBuka: '2026-06-01',
    tglTutup: '2026-08-01',
    tinjauan: '-',
    koordinatKhusus: [-7.77582, 111.19044], // Setren
  },
  {
    id: 'kkn-ugm-2',
    kode: '21579',
    ptn: 'UGM 2',
    ptnFullName: 'Universitas Gadjah Mada (Tahap 2)',
    status: 'Selesai',
    pic: 'Muhammad Naufal Aljazari',
    kontak: '+6285321569293',
    kecamatan: ['Jatisrono', 'Selogiri'],
    lokasi: 'Desa Pule, Kelurahan Pelem',
    tglUsulan: '2026-06-10',
    tglBuka: '2026-06-20',
    tglTutup: '2026-08-09',
    tinjauan: '-',
  },
  {
    id: 'kkn-uin-malang',
    kode: 'USUL-01',
    ptn: 'UIN Malang',
    ptnFullName: 'UIN Maulana Maliki Ibrahim Malang',
    status: 'Usulan',
    pic: 'Nouval Rafif Alvaro',
    kontak: '081216909470',
    kecamatan: ['Girimarto'],
    lokasi: 'Desa Nungkulan',
    tglUsulan: '2026-10-27',
    tglBuka: '2026-12-28',
    tglTutup: '2027-02-05',
    tinjauan: 'Pengajuan proposal KKN tematik kepegawaian',
  },
  {
    id: 'kkn-univet',
    kode: '20873',
    ptn: 'UNIVET',
    ptnFullName: 'Universitas Veteran Bangun Nusantara',
    status: 'Selesai',
    pic: 'Ainur Komariah',
    kontak: '081393456122',
    kecamatan: ['Manyaran'],
    lokasi: 'Desa Pijiharjo',
    tglUsulan: '2026-03-03',
    tglBuka: '2026-08-01',
    tglTutup: '2026-09-15',
    tinjauan: '-',
  },
  {
    id: 'kkn-uns',
    kode: 'USUL-02',
    ptn: 'UNS',
    ptnFullName: 'Universitas Sebelas Maret',
    status: 'Usulan',
    pic: 'Hery Widjianto',
    kontak: '08122609524',
    kecamatan: ['Ngadirojo'],
    lokasi:
      '1. Desa Gedong, 2. Desa Mlokomanis Kulon, 3. Desa Ngadirojo Kidul, 4. Kelurahan Kasihan, 5. Desa Mlokomanis Wetan, 6. Desa Ngadirojo Lor, 7. Desa Kerjo Lor, 8. Desa Kerjo Kidul, 9. Desa Pondok',
    tglUsulan: '2027-01-01',
    tglBuka: '2027-02-01',
    tglTutup: '2027-08-21',
    tinjauan: 'Usulan KKN Terpadu Kemandirian Desa',
  },
  {
    id: 'kkn-uny',
    kode: '22611',
    ptn: 'UNY',
    ptnFullName: 'Universitas Negeri Yogyakarta',
    status: 'Proses',
    pic: 'Dr. Banu Setyo Adi, M.Pd.',
    kontak: '081249154670',
    kecamatan: ['Pracimantoro', 'Giriwoyo'],
    lokasi: 'Desa Banaran, Desa Bulurejo, Desa Gerikikis, Desa Gebangharjo',
    tglUsulan: '2026-10-05',
    tglBuka: '2026-10-12',
    tglTutup: '2026-12-18',
    tinjauan: 'Monitoring berkala Bapperida',
  },
];

const WONOGIRI_CENTER: [number, number] = [-7.915, 111.02];
const WADUK_COORDINATES: [number, number] = [-7.892, 110.916];
const DEFAULT_ZOOM = 10;

type LayerType = 'satellite' | 'street' | 'osm';

interface MapKKNProps {
  className?: string;
  isFullWindow?: boolean;
}

export default function MapKKN({ className = '', isFullWindow = true }: MapKKNProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const layersRef = useRef<{ [key in LayerType]?: L.TileLayer }>({});

  const [activeLayer, setActiveLayer] = useState<LayerType>('satellite');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DataKKN | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter Data
  const filteredData = useMemo(() => {
    return KKN_DATA_WONOGIRI.filter((item) => {
      const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchKec =
        selectedKecamatan === 'all' ||
        item.kecamatan.some((k) => k.toLowerCase().replace(/\s+/g, '') === selectedKecamatan.toLowerCase().replace(/\s+/g, ''));
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        item.ptn.toLowerCase().includes(query) ||
        item.ptnFullName.toLowerCase().includes(query) ||
        item.pic.toLowerCase().includes(query) ||
        item.kode.toLowerCase().includes(query) ||
        item.lokasi.toLowerCase().includes(query) ||
        item.kecamatan.some((k) => k.toLowerCase().includes(query));

      return matchStatus && matchKec && matchSearch;
    });
  }, [selectedStatus, selectedKecamatan, searchQuery]);

  // Statistik Ringkas
  const countProses = KKN_DATA_WONOGIRI.filter((d) => d.status === 'Proses').length;
  const countSelesai = KKN_DATA_WONOGIRI.filter((d) => d.status === 'Selesai').length;
  const countUsulan = KKN_DATA_WONOGIRI.filter((d) => d.status === 'Usulan').length;

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Layer 1: Google Hybrid Satelit Asli
    const satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20,
      attribution: '&copy; Google Satellite Imagery &mdash; Bapperida Wonogiri',
    });

    // Layer 2: Google Maps Jalan
    const streetLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20,
      attribution: '&copy; Google Maps',
    });

    // Layer 3: OpenStreetMap
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    });

    layersRef.current = {
      satellite: satelliteLayer,
      street: streetLayer,
      osm: osmLayer,
    };

    const map = L.map(mapContainerRef.current, {
      center: WONOGIRI_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      layers: [satelliteLayer],
    });

    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.scale({ imperial: false, position: 'bottomright' }).addTo(map);

    mapRef.current = map;

    // Refresh ukuran peta
    const timers = [
      setTimeout(() => map.invalidateSize(), 150),
      setTimeout(() => map.invalidateSize(), 500),
      setTimeout(() => map.invalidateSize(), 1200),
    ];

    const handleWindowResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener('resize', handleWindowResize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Layer Aktif
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(layersRef.current).forEach((l) => {
      if (l && map.hasLayer(l)) {
        map.removeLayer(l);
      }
    });

    const active = layersRef.current[activeLayer];
    if (active) {
      active.addTo(map);
    }
  }, [activeLayer]);

  // Update Markers ketika filter berubah
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Bersihkan marker lama
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Kelompokkan data KKN per titik koordinat kecamatan
    const kecGroups: Record<
      string,
      {
        kecName: string;
        lat: number;
        lng: number;
        items: DataKKN[];
      }
    > = {};

    filteredData.forEach((kkn) => {
      kkn.kecamatan.forEach((kec) => {
        const cleanKec = kec.toLowerCase().replace(/\s+/g, '');
        const pos = KECAMATAN_COORDINATES[cleanKec];
        if (pos) {
          if (!kecGroups[cleanKec]) {
            kecGroups[cleanKec] = {
              kecName: pos.name,
              lat: kkn.koordinatKhusus ? kkn.koordinatKhusus[0] : pos.lat,
              lng: kkn.koordinatKhusus ? kkn.koordinatKhusus[1] : pos.lng,
              items: [],
            };
          }
          kecGroups[cleanKec].items.push(kkn);
        }
      });
    });

    // Buat marker untuk tiap kecamatan
    Object.entries(kecGroups).forEach(([key, group]) => {
      const hasProses = group.items.some((i) => i.status === 'Proses');
      const hasSelesai = group.items.some((i) => i.status === 'Selesai');
      const primaryStatus: KKNStatus = hasProses ? 'Proses' : hasSelesai ? 'Selesai' : 'Usulan';

      const colorMap: Record<KKNStatus, { border: string; bg: string; dot: string }> = {
        Proses: { border: '#f97316', bg: 'rgba(249, 115, 22, 0.9)', dot: '#ea580c' },
        Selesai: { border: '#10b981', bg: 'rgba(16, 185, 129, 0.9)', dot: '#059669' },
        Usulan: { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.9)', dot: '#2563eb' },
      };
      const colors = colorMap[primaryStatus];

      const ptnNames = Array.from(new Set(group.items.map((i) => i.ptn)));
      const ptnLabel = ptnNames.length > 2 ? `${ptnNames[0]} +${ptnNames.length - 1}` : ptnNames.join(', ');

      const iconHtml = `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
          <!-- Floating Pill -->
          <div style="
            display: inline-flex; align-items: center; gap: 6px;
            background: rgba(24, 24, 37, 0.92); backdrop-filter: blur(8px);
            color: #ffffff; padding: 4px 10px; border-radius: 9999px;
            border: 1.5px solid ${colors.border};
            box-shadow: 0 4px 14px rgba(0,0,0,0.45);
            font-size: 11px; font-weight: 700; white-space: nowrap;
          ">
            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${colors.border}; box-shadow: 0 0 8px ${colors.border};"></span>
            <span>${ptnLabel}</span>
            ${
              group.items.length > 1
                ? `<span style="background: ${colors.border}; color: white; padding: 1px 5px; border-radius: 9999px; font-size: 9px; font-weight: 800;">${group.items.length}</span>`
                : ''
            }
          </div>

          <!-- Pin stem -->
          <div style="width: 2px; height: 10px; background: ${colors.border}; margin-top: 1px;"></div>

          <!-- Pulsing dot on map -->
          <div style="position: relative; width: 10px; height: 10px; display: flex; align-items: center; justify-content: center;">
            <span style="position: absolute; width: 18px; height: 18px; border-radius: 50%; background-color: ${colors.border}; opacity: 0.5; animation: ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #ffffff; border: 2px solid ${colors.border};"></span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'kkn-div-icon',
        html: iconHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([group.lat, group.lng], { icon: customIcon }).addTo(map);

      // Popup Bapperida Style
      const popupHtml = `
        <div style="font-family: ui-sans-serif, system-ui, sans-serif; min-width: 260px; max-width: 310px; color: #1e293b; padding: 2px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
            <div style="font-size: 13px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 4px;">
              📍 KEC. ${group.kecName.toUpperCase()}
            </div>
            <span style="font-size: 10px; font-weight: 700; background: #f1f5f9; color: #475569; padding: 2px 7px; border-radius: 9999px;">
              ${group.items.length} Usulan KKN
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto;">
            ${group.items
              .map((item) => {
                const badgeColor =
                  item.status === 'Proses'
                    ? 'background: #ffedd5; color: #9a3412;'
                    : item.status === 'Selesai'
                    ? 'background: #dcfce7; color: #166534;'
                    : 'background: #dbeafe; color: #1e40af;';

                return `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-weight: 800; font-size: 13px; color: #0f172a;">🏛️ ${item.ptn}</span>
                    <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; ${badgeColor}">
                      ${item.status}
                    </span>
                  </div>
                  <div style="font-size: 11px; color: #64748b; margin-bottom: 3px;">
                    <strong>Kode:</strong> <code style="background: #e2e8f0; padding: 1px 4px; border-radius: 4px;">${item.kode || '-'}</code>
                  </div>
                  <div style="font-size: 11px; color: #334155; margin-bottom: 3px;">
                    <strong>PIC:</strong> ${item.pic} (<a href="tel:${item.kontak}" style="color: #0284c7; text-decoration: none;">${item.kontak}</a>)
                  </div>
                  <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
                    <strong>Lokasi Desa:</strong> ${item.lokasi}
                  </div>
                  <div style="font-size: 10px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 4px;">
                    📅 ${item.tglBuka || '?'} s/d ${item.tglTutup || '?'}
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 340, className: 'bapperida-popup' });

      marker.on('click', () => {
        if (group.items.length > 0) {
          setSelectedItem(group.items[0]);
        }
      });

      markersRef.current.push(marker);
    });
  }, [filteredData]);

  // Aksi Fokus ke Posko / KKN Tertentu
  const focusToKkn = (item: DataKKN) => {
    setSelectedItem(item);
    if (!mapRef.current) return;

    const firstKec = item.kecamatan[0]?.toLowerCase().replace(/\s+/g, '');
    const coord = item.koordinatKhusus
      ? { lat: item.koordinatKhusus[0], lng: item.koordinatKhusus[1] }
      : KECAMATAN_COORDINATES[firstKec] || { lat: WONOGIRI_CENTER[0], lng: WONOGIRI_CENTER[1] };

    mapRef.current.flyTo([coord.lat, coord.lng], 13, { duration: 1.2 });
  };

  // Reset Peta ke Seluruh Kabupaten Wonogiri
  const resetToWonogiri = () => {
    if (!mapRef.current) return;
    setSelectedItem(null);
    mapRef.current.flyTo(WONOGIRI_CENTER, DEFAULT_ZOOM, { duration: 1.2 });
  };

  // Fokus ke Waduk Gajah Mungkur
  const focusToWaduk = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo(WADUK_COORDINATES, 13, { duration: 1.5 });
  };

  // Toggle Layar Penuh (Browser Fullscreen)
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 300);
  };

  return (
    <div
      className={`relative w-full overflow-hidden font-sans select-none ${
        isFullWindow ? 'fixed inset-0 w-screen h-screen z-30' : 'h-[650px] rounded-2xl'
      } ${className}`}
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Kanvas Leaflet Full Window */}
      <div
        ref={mapContainerRef}
        id="kkn-leaflet-map"
        className="w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Floating Header Bar (Top Overlay) */}
      <header className="absolute top-3 left-3 right-3 z-[1000] pointer-events-none flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Identitas Bapperida & Judul */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-lg shadow-md shadow-emerald-500/25">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-extrabold tracking-tight text-white leading-tight">
                Peta Sebaran KKN Kabupaten Wonogiri
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Bapperida Riset
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden sm:block">
              Bidang Riset & Inovasi Daerah &mdash; Kabupaten Wonogiri
            </p>
          </div>
        </div>

        {/* Quick Toolbar & Map Controls */}
        <div className="pointer-events-auto flex items-center gap-2 flex-wrap justify-end">
          {/* Quick Stats Badges */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-[11px]">
            <span className="text-slate-300 font-medium">📍 {KKN_DATA_WONOGIRI.length} Usulan</span>
            <span className="text-slate-600">•</span>
            <span className="text-orange-400 font-bold">🟠 {countProses} Proses</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-bold">🟢 {countSelesai} Selesai</span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400 font-bold">🔵 {countUsulan} Usulan</span>
          </div>

          {/* Layer Selector */}
          <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl shadow-xl border border-slate-700/60 flex items-center text-xs font-semibold">
            <button
              onClick={() => setActiveLayer('satellite')}
              title="Citra Satelit Asli Google Hybrid"
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                activeLayer === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🛰️ Satelit
            </button>
            <button
              onClick={() => setActiveLayer('street')}
              title="Peta Jalan Google Maps"
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                activeLayer === 'street'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🗺️ Jalan
            </button>
            <button
              onClick={() => setActiveLayer('osm')}
              title="Peta Komunitas OpenStreetMap"
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                activeLayer === 'osm'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🌐 OSM
            </button>
          </div>

          {/* Tombol Waduk Gajah Mungkur */}
          <button
            onClick={focusToWaduk}
            title="Fokus ke Waduk Gajah Mungkur"
            className="bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-xl border border-slate-700/60 text-slate-200 hover:bg-slate-800 hover:text-sky-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <span>🌊</span>
            <span className="hidden sm:inline">Waduk Gajah Mungkur</span>
          </button>

          {/* Reset Zoom Wonogiri */}
          <button
            onClick={resetToWonogiri}
            title="Pusatkan kembali ke seluruh Kabupaten Wonogiri"
            className="bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-xl border border-slate-700/60 text-slate-200 hover:bg-slate-800 hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <span>🎯</span>
            <span className="hidden sm:inline">Reset Peta</span>
          </button>

          {/* Toggle Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Mode Layar Penuh' : 'Mode Layar Penuh (Fullscreen)'}
            aria-label="Toggle Fullscreen"
            className="bg-slate-900/90 backdrop-blur-md p-2 rounded-xl shadow-xl border border-slate-700/60 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              )}
            </svg>
          </button>

          {/* Toggle Sidebar Panel */}
          <button
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setTimeout(() => mapRef.current?.invalidateSize(), 250);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl shadow-xl shadow-emerald-900/30 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>{isSidebarOpen ? 'Tutup Panel' : 'Data KKN'}</span>
          </button>
        </div>
      </header>

      {/* Floating Collapsible Sidebar Panel */}
      <aside
        className={`absolute top-20 bottom-4 left-3 z-[1000] w-80 sm:w-96 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/70 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-[115%] opacity-0 pointer-events-none'
        }`}
      >
        {/* Panel Header & Filter */}
        <div className="p-3.5 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>📋</span> Daftar Kegiatan KKN
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
              {filteredData.length} Hasil
            </span>
          </div>

          {/* Search Box */}
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Cari PTN, PIC, desa, kecamatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-2 bg-slate-800/90 rounded-xl border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Bar: Status & Kecamatan */}
          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter berdasarkan status"
              className="w-full px-2 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua Status</option>
              <option value="Proses">🟠 Proses ({countProses})</option>
              <option value="Selesai">🟢 Selesai ({countSelesai})</option>
              <option value="Usulan">🔵 Usulan ({countUsulan})</option>
            </select>

            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              aria-label="Filter berdasarkan kecamatan"
              className="w-full px-2 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua Kecamatan</option>
              {Object.values(KECAMATAN_COORDINATES).map((kec) => (
                <option key={kec.name} value={kec.name}>
                  {kec.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable KKN Item List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
          {filteredData.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Tidak ada data KKN yang cocok dengan filter pencarian.
            </div>
          ) : (
            filteredData.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              const statusBadgeCls =
                item.status === 'Proses'
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                  : item.status === 'Selesai'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-blue-500/20 text-blue-400 border-blue-500/30';

              return (
                <div
                  key={item.id}
                  onClick={() => focusToKkn(item)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-slate-800 ring-2 ring-emerald-500/50 shadow-lg'
                      : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-white text-[13px]">{item.ptn}</span>
                      <span className="text-[10px] text-slate-400 font-mono">#{item.kode || '-'}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeCls}`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-2 line-clamp-1">{item.ptnFullName}</p>

                  <div className="bg-slate-900/60 rounded-lg p-2 text-[11px] text-slate-300 border border-slate-800/80 space-y-1 mb-2">
                    <div className="flex items-start gap-1">
                      <span className="text-slate-400 shrink-0">📍 Kec:</span>
                      <span className="font-medium text-emerald-400">{item.kecamatan.join(', ')}</span>
                    </div>
                    <div className="flex items-start gap-1 line-clamp-2">
                      <span className="text-slate-400 shrink-0">🏡 Lokasi:</span>
                      <span className="text-slate-300 text-[10.5px]">{item.lokasi}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10.5px] text-slate-400">
                      <span>👤 PIC: {item.pic}</span>
                      <span className="font-mono text-sky-400">{item.kontak}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10.5px] text-slate-400">
                    <span>📅 {item.tglBuka || '?'} s/d {item.tglTutup || '?'}</span>
                    <span className="font-bold text-emerald-400 hover:underline flex items-center gap-1">
                      Fokus Peta &rarr;
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800 rounded-b-2xl text-[11px] text-slate-400 flex items-center justify-between">
          <span>Wonogiri Sukses &bull; Bapperida</span>
          <button
            onClick={resetToWonogiri}
            className="text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Fokus Semua
          </button>
        </div>
      </aside>

      {/* Floating Bottom Right Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-2xl border border-slate-700/60 hidden sm:flex items-center gap-4 text-xs text-white">
        <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">Status:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block shadow-sm shadow-orange-500"></span>
          <span className="text-slate-300 text-[11px]">Proses ({countProses})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500"></span>
          <span className="text-slate-300 text-[11px]">Selesai ({countSelesai})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shadow-sm shadow-blue-500"></span>
          <span className="text-slate-300 text-[11px]">Usulan ({countUsulan})</span>
        </div>
      </div>
    </div>
  );
}
