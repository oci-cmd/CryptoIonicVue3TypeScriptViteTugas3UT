/**
 * BERKAS: src/main.ts
 * DESKRIPSI: Titik masuk utama (entry point) aplikasi Ionic Vue 3
 */

import { createApp } from 'vue';                // Baris 1: Mengimpor fungsi pembuat instance aplikasi Vue 3
import App from './App.vue';                     // Baris 2: Mengimpor komponen pembungkus akar (root component)
import router from './router';                   // Baris 3: Mengimpor modul konfigurasi rute navigasi halaman
import { IonicVue } from '@ionic/vue';           // Baris 4: Mengimpor plugin resmi integrasi Ionic Framework dengan Vue 3

// Impor kumpulan berkas CSS resmi Ionic Framework untuk styling antarmuka mobile
import '@ionic/vue/css/core.css';                 // Baris 5: Berkas CSS inti (core) untuk seluruh komponen Ionic
import '@ionic/vue/css/normalize.css';            // Baris 6: CSS normalisasi tampilan antar-peramban mobile
import '@ionic/vue/css/structure.css';            // Baris 7: CSS pengaturan layout dan struktur grid mobile
import '@ionic/vue/css/typography.css';           // Baris 8: CSS tipografi standar (font, ukuran, jarak huruf)

// Impor berkas tema variabel CSS kustom
import './theme/variables.css';                  // Baris 9: Variabel warna tema aplikasi (--ion-color-primary, dll)

// Baris 10: Menginstansiasi aplikasi Vue baru menggunakan komponen App
const app = createApp(App)
  .use(IonicVue)                                 // Baris 11: Mendaftarkan plugin IonicVue ke dalam instans aplikasi
  .use(router);                                  // Baris 12: Mendaftarkan modul routing navigasi ke dalam aplikasi

// Baris 13: Memastikan router siap sebelum aplikasi di-mount ke DOM HTML
router.isReady().then(() => {
  app.mount('#app');                             // Baris 14: Me-mount aplikasi ke elemen HTML dengan id="app"
});
