import type { CapacitorConfig } from '@capacitor/cli';

// Konfigurasi resmi Capacitor untuk ekspor proyek mobile hybrid ke native Android & iOS
const config: CapacitorConfig = {
  // Identifier unik paket aplikasi Android (Package Name)
  appId: 'id.ac.ut.cryptotracker',
  // Nama aplikasi yang tampil pada layar beranda (home screen) smartphone
  appName: 'Crypto Tracker UT',
  // Direktori keluaran build bundle web hasil kompilasi Vite yang akan dimuat oleh Capacitor
  webDir: 'dist',
  server: {
    // Menggunakan skema HTTPS lokal pada platform Android agar pemanggilan API eksternal aman
    androidScheme: 'https'
  }
};

export default config;
