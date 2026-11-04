'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapKkn() {
  useEffect(() => {
    // Inisialisasi peta dengan titik tengah Kabupaten Wonogiri
    const map = L.map('map-kkn-container').setView([-7.8166, 110.9250], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Contoh Marker Titik KKN
    L.marker([-7.8166, 110.9250]).addTo(map)
      .bindPopup('<b>Kabupaten Wonogiri</b><br/>Pusat Koordinasi KKN');

    return () => {
      map.remove(); // Bersihkan peta saat komponen ditutup
    };
  }, []);

  return (
    <div 
      id="map-kkn-container" 
      style={{ width: '100%', height: '320px', borderRadius: '8px', zIndex: 1 }} 
    />
  );
}