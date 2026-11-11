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

  // Dynamic KKN Data State with localStorage persistence
  const [kknData, setKknData] = useState<DataKKN[]>(KKN_DATA_WONOGIRI);
  const [isClient, setIsClient] = useState(false);

  // Admin Access Gate States
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
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
    tinjauan: string;
  }>({
    kode: '',
    ptn: '',
    ptnFullName: '',
    status: 'Proses',
    pic: '',
    kontak: '',
    kecamatan: [],
    lokasi: '',
    tglUsulan: '',
    tglBuka: '',
    tglTutup: '',
    tinjauan: '',
  });

  const [activeLayer, setActiveLayer] = useState<LayerType>('satellite');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataKKN | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load saved data & Admin Auth session from localStorage / URL
  useEffect(() => {
    setIsClient(true);
    try {
      // Cek auth admin session
      const savedAdminAuth = sessionStorage.getItem('wonogiri_kkn_admin_auth');
      if (savedAdminAuth === 'true') {
        setIsAdmin(true);
      } else {
        // Cek URL query parameter ?admin=bapperida2026
        const urlParams = new URLSearchParams(window.location.search);
        const adminQuery = urlParams.get('admin');
        const validPin = process.env.NEXT_PUBLIC_ADMIN_PIN || 'bapperida2026';
        if (adminQuery && (adminQuery === validPin || adminQuery === 'true')) {
          setIsAdmin(true);
          sessionStorage.setItem('wonogiri_kkn_admin_auth', 'true');
        }
      }

      // Load data KKN
      const saved = localStorage.getItem('wonogiri_kkn_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setKknData(parsed);
        }
      }
    } catch (e) {
      console.error('Gagal membaca data lokal KKN:', e);
    }
  }, []);

  // Handler Verifikasi PIN Admin
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedPin = process.env.NEXT_PUBLIC_ADMIN_PIN || 'bapperida2026';
    if (pinInput.trim() === expectedPin) {
      setIsAdmin(true);
      sessionStorage.setItem('wonogiri_kkn_admin_auth', 'true');
      setIsPinModalOpen(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('PIN salah! Silakan periksa kembali sandi admin Anda.');
    }
  };

  // Handler Logout Admin
  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('wonogiri_kkn_admin_auth');
    setIsModalOpen(false);
  };

  // Helper untuk menyimpan data ke state dan localStorage
  const saveKknData = (newData: DataKKN[]) => {
    setKknData(newData);
    try {
      localStorage.setItem('wonogiri_kkn_data', JSON.stringify(newData));
    } catch (e) {
      console.error('Gagal menyimpan data lokal KKN:', e);
    }
  };

  // Buka Modal Tambah Baru
  const handleOpenAddModal = () => {
    if (!isAdmin) {
      setPinError('');
      setPinInput('');
      setIsPinModalOpen(true);
      return;
    }
    setEditingId(null);
    setFormData({
      kode: `K-${Math.floor(1000 + Math.random() * 9000)}`,
      ptn: '',
      ptnFullName: '',
      status: 'Proses',
      pic: '',
      kontak: '',
      kecamatan: ['Wonogiri'],
      lokasi: '',
      tglUsulan: new Date().toISOString().split('T')[0],
      tglBuka: '',
      tglTutup: '',
      tinjauan: '',
    });
    setIsModalOpen(true);
  };

  // Buka Modal Edit
  const handleOpenEditModal = (item: DataKKN, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) {
      setPinError('');
      setPinInput('');
      setIsPinModalOpen(true);
      return;
    }
    setEditingId(item.id);
    setFormData({
      kode: item.kode || '',
      ptn: item.ptn || '',
      ptnFullName: item.ptnFullName || '',
      status: item.status || 'Proses',
      pic: item.pic || '',
      kontak: item.kontak || '',
      kecamatan: item.kecamatan && item.kecamatan.length > 0 ? [...item.kecamatan] : ['Wonogiri'],
      lokasi: item.lokasi || '',
      tglUsulan: item.tglUsulan || '',
      tglBuka: item.tglBuka || '',
      tglTutup: item.tglTutup || '',
      tinjauan: item.tinjauan || '',
    });
    setIsModalOpen(true);
  };

  // Hapus Card KKN
  const handleDeleteKkn = (item: DataKKN, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) {
      setPinError('');
      setPinInput('');
      setIsPinModalOpen(true);
      return;
    }
    const confirmed = window.confirm(`Hapus kegiatan KKN dari "${item.ptn}" (#${item.kode})?`);
    if (confirmed) {
      const updated = kknData.filter((d) => d.id !== item.id);
      saveKknData(updated);
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
      }
    }
  };

  // Reset ke Data Default Bapperida
  const handleResetToDefault = () => {
    if (!isAdmin) {
      setPinError('');
      setPinInput('');
      setIsPinModalOpen(true);
      return;
    }
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin memulihkan seluruh data kembali ke daftar awal resmi Bapperida Wonogiri?'
    );
    if (confirmed) {
      saveKknData(KKN_DATA_WONOGIRI);
      localStorage.removeItem('wonogiri_kkn_data');
      setSelectedItem(null);
    }
  };

  // Submit Simpan (Tambah / Edit)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ptn.trim()) {
      alert('Nama PTN/Kampus wajib diisi!');
      return;
    }
    if (formData.kecamatan.length === 0) {
      alert('Pilih minimal 1 kecamatan!');
      return;
    }

    if (editingId) {
      // Mode Edit
      const updated = kknData.map((d) => {
        if (d.id === editingId) {
          return {
            ...d,
            ...formData,
            ptnFullName: formData.ptnFullName.trim() || formData.ptn.trim(),
          };
        }
        return d;
      });
      saveKknData(updated);
      if (selectedItem?.id === editingId) {
        setSelectedItem(updated.find((d) => d.id === editingId) || null);
      }
    } else {
      // Mode Tambah Baru
      const newItem: DataKKN = {
        id: `kkn-${Date.now()}`,
        ...formData,
        ptnFullName: formData.ptnFullName.trim() || formData.ptn.trim(),
      };
      const updated = [newItem, ...kknData];
      saveKknData(updated);
      setSelectedItem(newItem);
    }

    setIsModalOpen(false);
  };

  // Toggle Kecamatan di form modal
  const toggleKecamatanSelection = (kecName: string) => {
    setFormData((prev) => {
      const exists = prev.kecamatan.includes(kecName);
      if (exists) {
        return {
          ...prev,
          kecamatan: prev.kecamatan.filter((k) => k !== kecName),
        };
      } else {
        return {
          ...prev,
          kecamatan: [...prev.kecamatan, kecName],
        };
      }
    });
  };

  // Filter Data
  const filteredData = useMemo(() => {
    return kknData.filter((item) => {
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
  }, [kknData, selectedStatus, selectedKecamatan, searchQuery]);

  // Statistik Ringkas
  const countProses = kknData.filter((d) => d.status === 'Proses').length;
  const countSelesai = kknData.filter((d) => d.status === 'Selesai').length;
  const countUsulan = kknData.filter((d) => d.status === 'Usulan').length;

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
              ${group.items.length} Kegiatan KKN
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

  // ─── iOS-style glassmorphism token ───────────────────────────────────────
  const glass = {
    base: {
      background: 'rgba(18,22,36,0.52)',
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.13)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.09)',
    },
    sidebar: {
      background: 'rgba(14,19,32,0.68)',
      backdropFilter: 'blur(48px) saturate(200%)',
      WebkitBackdropFilter: 'blur(48px) saturate(200%)',
      border: '1px solid rgba(255,255,255,0.11)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
    },
    card: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
    },
    cardActive: {
      background: 'rgba(16,185,129,0.09)',
      border: '1px solid rgba(16,185,129,0.45)',
      boxShadow: '0 0 0 3px rgba(16,185,129,0.12)',
    },
    input: {
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.11)',
    },
    divider: { borderColor: 'rgba(255,255,255,0.08)' },
    footer: {
      background: 'rgba(0,0,0,0.28)',
      borderColor: 'rgba(255,255,255,0.08)',
    },
  } as const;

  return (
    <div
      className={`relative w-full overflow-hidden font-sans select-none ${
        isFullWindow ? 'fixed inset-0 w-screen h-screen z-30' : 'h-[650px] rounded-2xl'
      } ${className}`}
      style={{ backgroundColor: '#0a0f1e' }}
    >
      {/* Kanvas Leaflet Full Window */}
      <div
        ref={mapContainerRef}
        id="kkn-leaflet-map"
        className="w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Floating Header Bar (Top Overlay) — Glassmorphism */}
      <header className="absolute top-3 left-3 right-3 z-[1000] pointer-events-none flex flex-col md:flex-row md:items-start justify-between gap-2.5">
        {/* Identitas Bapperida & Judul */}
        <div className="pointer-events-auto bg-white/8 backdrop-blur-xl text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-white/15 ring-1 ring-white/5 flex items-center gap-3" style={{background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)'}}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl p-1 border shadow-md" style={{background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)'}}>
            <img
              src="/Seal_of_Wonogiri_Regency.svg"
              alt="Lambang Kabupaten Wonogiri"
              className="h-full w-full object-contain drop-shadow-md"
            />
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
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 justify-end">
          {/* Quick Stats Badges */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px]" style={{background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.12)'}}>
            <span className="text-orange-400 font-bold">🟠 {countProses} Proses</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-bold">🟢 {countSelesai} Selesai</span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400 font-bold">🔵 {countUsulan} Usulan</span>
          </div>

          {/* Layer Selector */}
          <div className="p-1 rounded-xl shadow-xl flex items-center text-xs font-semibold" style={{background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)'}}>
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
            className="px-3 py-2 rounded-xl shadow-xl text-slate-200 hover:text-sky-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            style={{background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)'}}
          >
            <span>🌊</span>
            <span className="hidden sm:inline">Waduk Gajah Mungkur</span>
          </button>

          {/* Reset Zoom Wonogiri */}
          <button
            onClick={resetToWonogiri}
            title="Pusatkan kembali ke seluruh Kabupaten Wonogiri"
            className="px-3 py-2 rounded-xl shadow-xl text-slate-200 hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            style={{background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)'}}
          >
            <span>🎯</span>
            <span className="hidden sm:inline">Reset Peta</span>
          </button>

          {/* Tombol Akses Mode Admin */}
          {!isAdmin ? (
            <button
              onClick={() => {
                setPinError('');
                setPinInput('');
                setIsPinModalOpen(true);
              }}
              title="Masuk sebagai Administrator Bapperida (Khusus Pengelola)"
              className="px-3 py-2 rounded-xl shadow-xl text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              style={{background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)'}}
            >
              <span>🔒</span>
              <span className="hidden sm:inline">Admin</span>
            </button>
          ) : (
            <div className="backdrop-blur-xl border border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl" style={{background: 'rgba(245,158,11,0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)'}}>
              <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                <span>🛡️</span>
                <span className="hidden sm:inline">Admin Mode</span>
              </span>
              <button
                onClick={handleLogoutAdmin}
                title="Keluar dari Mode Admin"
                className="text-[10px] bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white px-2 py-0.5 rounded-md transition-colors font-bold"
              >
                Keluar
              </button>
            </div>
          )}

          {/* Toggle Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Mode Layar Penuh' : 'Mode Layar Penuh (Fullscreen)'}
            aria-label="Toggle Fullscreen"
            className="p-2 rounded-xl shadow-xl text-slate-200 hover:text-white transition-colors"
            style={{background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)'}}
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
            className="bg-emerald-600/80 hover:bg-emerald-500/90 backdrop-blur-xl text-white px-3 py-2 rounded-xl shadow-xl shadow-emerald-900/30 transition-colors flex items-center gap-1.5 text-xs font-bold border border-emerald-400/30"
            style={{backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)'}}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>{isSidebarOpen ? 'Tutup Panel' : 'Data KKN'}</span>
          </button>
        </div>
      </header>

      {/* Floating Collapsible Sidebar Panel — Glassmorphism */}
      <aside
        className={`absolute top-20 bottom-4 left-3 z-[1000] w-80 sm:w-96 text-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-[115%] opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(10,18,35,0.60)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.70), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Panel Header & Filter */}
        <div className="p-3.5 border-b" style={{borderColor: 'rgba(255,255,255,0.08)'}}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <span>📋</span> Daftar Kegiatan KKN
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                {filteredData.length}
              </span>
            </div>
            {/* Tombol Tambah KKN: Hanya Tampil untuk Admin */}
            {isAdmin ? (
              <button
                onClick={handleOpenAddModal}
                className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
                title="Tambah Kegiatan KKN Baru"
              >
                <span>➕</span>
                <span>Tambah KKN</span>
              </button>
            ) : (
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60 font-medium">
                👁️ Publik
              </span>
            )}
          </div>

          {/* Search Box */}
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Cari PTN, PIC, desa, kecamatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-2 rounded-xl border text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 transition-all"
              style={{background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.12)'}}
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
              className="w-full px-2 py-1.5 rounded-lg border text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              style={{background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)'}}
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
              className="w-full px-2 py-1.5 rounded-lg border text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              style={{background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)'}}
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
                      ? 'border-emerald-500/60 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-900/20'
                      : 'hover:border-white/15'
                  }`}
                  style={{
                    background: isSelected ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                    borderColor: isSelected ? undefined : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-white text-[13px]">{item.ptn}</span>
                      <span className="text-[10px] text-slate-400 font-mono">#{item.kode || '-'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeCls}`}>
                        {item.status}
                      </span>
                      {/* Tombol Aksi Admin: Hanya Tampil jika Login Admin */}
                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleOpenEditModal(item, e)}
                            title="Edit Profil KKN"
                            className="px-1.5 py-0.5 bg-slate-700/60 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 rounded transition-colors text-[10px] cursor-pointer"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={(e) => handleDeleteKkn(item, e)}
                            title="Hapus Profil KKN"
                            className="px-1.5 py-0.5 bg-slate-700/60 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 rounded transition-colors text-[10px] cursor-pointer"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-2 line-clamp-1">{item.ptnFullName}</p>

                  <div className="rounded-lg p-2 text-[11px] text-slate-300 space-y-1 mb-2" style={{background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.07)'}}>
                    <div className="flex items-start gap-1">
                      <span className="text-slate-400 shrink-0">📍 Kec:</span>
                      <span className="font-medium text-emerald-400">{item.kecamatan.join(', ')}</span>
                    </div>
                    <div className="flex items-start gap-1 line-clamp-2">
                      <span className="text-slate-400 shrink-0">🏡 Lokasi:</span>
                      <span className="text-slate-300 text-[10.5px]">{item.lokasi || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10.5px] text-slate-400">
                      <span>👤 PIC: {item.pic || '-'}</span>
                      <span className="font-mono text-sky-400">{item.kontak || '-'}</span>
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
        <div className="p-3 border-t rounded-b-2xl text-[11px] text-slate-400 flex items-center justify-between" style={{background: 'rgba(0,0,0,0.30)', borderColor: 'rgba(255,255,255,0.07)'}}>
          {isAdmin ? (
            <button
              onClick={handleResetToDefault}
              className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset data kembali ke bawaan awal Bapperida"
            >
              🔄 Reset Data
            </button>
          ) : (
            <span className="text-[10px] text-slate-500">Kab. Wonogiri &bull; Bapperida</span>
          )}
          <button
            onClick={resetToWonogiri}
            className="text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Fokus Semua
          </button>
        </div>
      </aside>

      {/* Floating Bottom Right Legend — Glassmorphism */}
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-auto px-3.5 py-2 rounded-xl shadow-2xl hidden sm:flex items-center gap-4 text-xs text-white" style={{background: 'rgba(10,18,35,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.10)'}}>
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

      {/* MODAL FORM: Tambah & Edit Data KKN (Glassmorphism Style) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 overflow-hidden flex flex-col max-h-[92vh] transition-all">
            {/* Ambient Background Glow Accent */}
            <div className="absolute -top-24 -left-24 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="relative px-6 py-4.5 border-b border-white/10 flex items-center justify-between bg-slate-950/40 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 text-emerald-300 flex items-center justify-center font-bold text-base border border-emerald-500/30 shadow-lg shadow-emerald-950/50">
                  {editingId ? '✏️' : '➕'}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span>{editingId ? 'Edit Identitas & Profil KKN' : 'Tambah Kegiatan KKN Baru'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                      Bapperida
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {editingId ? 'Perbarui data kampus, lokasi, atau status kegiatan' : 'Masukkan data posko kegiatan KKN untuk pemetaan Wonogiri'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Tutup dialog"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveForm} className="relative flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-200 custom-scrollbar">
              {/* Row 1: Singkatan & Nama Lengkap PTN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                    Singkatan Kampus <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: IPB, UGM"
                    value={formData.ptn}
                    onChange={(e) => setFormData({ ...formData, ptn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/50 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 placeholder-slate-500 transition-all shadow-inner"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                    Nama Lengkap Perguruan Tinggi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Institut Pertanian Bogor"
                    value={formData.ptnFullName}
                    onChange={(e) => setFormData({ ...formData, ptnFullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/50 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 placeholder-slate-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Row 2: Kode Usulan & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                    Kode Usulan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 21308"
                    value={formData.kode}
                    onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/50 backdrop-blur-sm rounded-xl border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 placeholder-slate-500 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                    Status Kegiatan <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as KKNStatus })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/60 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                  >
                    <option value="Proses">🟠 Proses (Sedang Berjalan)</option>
                    <option value="Selesai">🟢 Selesai (Tuntas)</option>
                    <option value="Usulan">🔵 Usulan (Tahap Pengajuan)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: PIC & Kontak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                    Nama PIC / Koordinator
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dr. Budi Santoso"
                    value={formData.pic}
                    onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/50 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 placeholder-slate-500 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                    Kontak / No. WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 08123456789"
                    value={formData.kontak}
                    onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/50 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 placeholder-slate-500 transition-all font-mono shadow-inner"
                  />
                </div>
              </div>

              {/* Row 4: Pilihan Wilayah Kecamatan (Multi-Select Pills) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Kecamatan Wonogiri yang Dituju <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                    Terpilih: {formData.kecamatan.length} Kecamatan
                  </span>
                </div>
                <div className="p-3 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 max-h-36 overflow-y-auto custom-scrollbar flex flex-wrap gap-1.5 shadow-inner">
                  {Object.values(KECAMATAN_COORDINATES).map((kec) => {
                    const isSelected = formData.kecamatan.includes(kec.name);
                    return (
                      <button
                        type="button"
                        key={kec.name}
                        onClick={() => toggleKecamatanSelection(kec.name)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60 border border-emerald-400/40 ring-1 ring-emerald-400/30'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{kec.name}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <span>ℹ️</span>
                  <span>Klik nama kecamatan untuk memilih/membatalkan. Pin otomatis terpasang pada koordinat wilayah.</span>
                </p>
              </div>

              {/* Row 5: Rincian Lokasi / Desa */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Rincian Lokasi / Nama Desa Posko
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Desa Pokoh Kidul, Desa Sendang Ijo"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/50 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 placeholder-slate-500 transition-all shadow-inner"
                />
              </div>

              {/* Row 6: Jadwal Pelaksanaan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                    Tanggal Buka / Mulai
                  </label>
                  <input
                    type="date"
                    value={formData.tglBuka}
                    onChange={(e) => setFormData({ ...formData, tglBuka: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/50 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                    Tanggal Penutupan
                  </label>
                  <input
                    type="date"
                    value={formData.tglTutup}
                    onChange={(e) => setFormData({ ...formData, tglTutup: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/50 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Row 7: Catatan / Tinjauan */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Catatan / Tema KKN
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: KKN Tematik Penurunan Stunting & Pemberdayaan UMKM..."
                  value={formData.tinjauan}
                  onChange={(e) => setFormData({ ...formData, tinjauan: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/50 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 placeholder-slate-500 resize-none transition-all shadow-inner"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-white font-bold shadow-lg shadow-emerald-500/25 border border-emerald-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>💾</span>
                  <span>{editingId ? 'Simpan Perubahan' : 'Tambah ke Peta'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VERIFIKASI PIN ADMIN (Glassmorphism Style) */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-[2100] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-slate-900/85 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-sm shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10 p-6 text-white overflow-hidden transition-all">
            {/* Ambient Accent Glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg border border-amber-500/30 shadow-md shadow-amber-950/40">
                  🔐
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white tracking-tight">Login Admin Bapperida</h3>
                  <p className="text-[11px] text-slate-400">Khusus pengelola data KKN Wonogiri</p>
                </div>
              </div>
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Tutup dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVerifyPin} className="relative space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-2">
                  Masukkan PIN / Sandi Admin:
                </label>
                <input
                  type="password"
                  autoFocus
                  placeholder="••••••••"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  className="w-full px-4 py-3 bg-slate-950/60 backdrop-blur-sm rounded-xl border border-white/10 text-white text-base tracking-widest text-center font-mono focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 placeholder-slate-600 transition-all shadow-inner"
                />
                {pinError && (
                  <p className="text-[11px] text-rose-400 font-medium mt-2 flex items-center gap-1">
                    <span>⚠️</span> {pinError}
                  </p>
                )}
                <p className="text-[10px] text-slate-400 mt-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                  ℹ️ Pengunjung publik tanpa PIN tetap bisa melihat peta interaktif (Read-Only).
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 border border-amber-300/40 active:scale-95 transition-all cursor-pointer"
                >
                  Buka Akses Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
