<template>
  <!-- Baris 1: Kontainer halaman tunggal resmi standar Ionic Framework -->
  <ion-page>
    <!-- Baris 2: Header navigasi yang menempel di bagian atas layar ponsel -->
    <ion-header :translucent="true">
      <!-- Baris 3: Toolbar pembungkus judul dan tombol aksi dengan warna utama primary -->
      <ion-toolbar color="primary">
        <!-- Baris 4: Judul aplikasi mobile yang tampil di header -->
        <ion-title>Crypto Tracker UT</ion-title>
        <!-- Baris 5: Wadah tombol aksi di sisi kanan (slot="end") -->
        <ion-buttons slot="end">
          <!-- Baris 6: Tombol Refresh utama sesuai gambar mockup soal Tugas 3 -->
          <ion-button class="header-refresh-btn" @click="fetchData(false)">
            <!-- Baris 7: Ikon putar dengan animasi berputar saat sedang proses loading -->
            <ion-icon slot="start" :icon="refreshOutline" :class="{ 'spin-icon': isLoading }"></ion-icon>
            <!-- Baris 8: Teks label tombol Refresh -->
            Refresh
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <!-- Baris 9: Toolbar kedua untuk fitur pencarian instan (Nilai Tambah / Kreativitas) -->
      <ion-toolbar color="primary" class="search-toolbar">
        <!-- Baris 10: Input searchbar reaktif yang terhubung ke variabel searchQuery -->
        <ion-searchbar
          v-model="searchQuery"
          placeholder="Cari koin (cth: BTC, Bitcoin)..."
          :debounce="150"
          class="custom-search"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <!-- Baris 11: Kontainer konten utama yang memiliki fitur scrollable pada layar ponsel -->
    <ion-content :fullscreen="true" class="ion-padding content-background">
      <!-- Baris 12: Komponen gestur mobile native tarik-ke-bawah (Pull-to-Refresh) -->
      <ion-refresher slot="fixed" @ionRefresh="handlePullRefresh($event)">
        <!-- Baris 13: Indikator spinner dan teks saat pengguna menarik layar ke bawah -->
        <ion-refresher-content pulling-text="Tarik untuk memperbarui..." refreshing-spinner="circles">
        </ion-refresher-content>
      </ion-refresher>

      <!-- Baris 14: Pembungkus tata letak mobile dengan batas lebar maksimal 480px -->
      <div class="mobile-container">
        <!-- Baris 15: Baris informasi ringkas jumlah data koin dan waktu pembaruan -->
        <div class="status-meta">
          <span class="count-badge">Menampilkan: {{ filteredCoins.length }} Koin</span>
          <span v-if="isFallback" class="fallback-pill">Mode Offline</span>
          <span class="time-label">{{ lastUpdated }}</span>
        </div>

        <!-- Baris 16: Indikator loading saat proses pemanggilan API awal berlangsung -->
        <div v-if="isLoading && coins.length === 0" class="loading-state">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <p>Memuat data cryptocurrency dari Coinlore API...</p>
        </div>

        <!-- Baris 17: Pesan galat jika koneksi jaringan bermasalah -->
        <div v-else-if="errorMessage" class="error-box">
          <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
          <p>{{ errorMessage }}</p>
          <ion-button size="small" color="primary" @click="fetchData(false)">Coba Lagi</ion-button>
        </div>

        <!-- Baris 18: DAFTAR KARTU CRYPTOCURRENCY SESUAI PERSIS MOCKUP SOAL TUGAS 3 -->
        <div v-else class="crypto-list">
          <!-- Baris 19: Perulangan v-for untuk me-render setiap kartu koin secara dinamis -->
          <div
            v-for="coin in filteredCoins"
            :key="coin.id"
            class="crypto-card"
          >
            <!-- Baris 20: Kolom 1 (Kiri) - Menampilkan Rank koin -->
            <div class="col-rank">
              <span class="field-label">Rank</span>
              <span class="field-rank">{{ coin.rank }}</span>
            </div>

            <!-- Baris 21: Kolom 2 (Tengah) - Menampilkan Nama Lengkap & Simbol Koin -->
            <div class="col-name-symbol">
              <span class="field-name">{{ coin.name }}</span>
              <span class="field-symbol">{{ coin.symbol }}</span>
            </div>

            <!-- Baris 22: Kolom 3 (Kanan) - Menampilkan Label USD & Nominal Harga Terkini -->
            <div class="col-price">
              <span class="field-label">USD</span>
              <span class="field-price">{{ formatPrice(coin.price_usd) }}</span>
              <!-- Baris 23: Fitur Kreativitas: Badge persentase naik/turun harga 24 jam -->
              <span
                v-if="coin.percent_change_24h"
                class="pct-badge"
                :class="parseFloat(coin.percent_change_24h) >= 0 ? 'pct-up' : 'pct-down'"
              >
                {{ parseFloat(coin.percent_change_24h) >= 0 ? '+' : '' }}{{ coin.percent_change_24h }}%
              </span>
            </div>
          </div>

          <!-- Baris 24: Tampilan jika pencarian koin tidak ditemukan -->
          <div v-if="filteredCoins.length === 0" class="empty-state">
            <p>Tidak ada koin yang cocok dengan "{{ searchQuery }}"</p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// Baris 25: Impor komponen UI mobile resmi dari pustaka @ionic/vue
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonIcon
} from '@ionic/vue';
// Baris 26: Impor ikon SVG resmi Ionicons (refresh dan alert)
import { refreshOutline, alertCircleOutline } from 'ionicons/icons';
// Baris 27: Impor fungsi reaktivitas inti Vue 3 Composition API (ref, computed, onMounted)
import { ref, computed, onMounted } from 'vue';
// Baris 28: Impor interface definisi tipe data TypeScript CryptoCoin
import type { CryptoCoin } from '../types/crypto';
// Baris 29: Impor fungsi pemanggil API dari berkas layanan cryptoService
import { getCryptoTickers } from '../services/cryptoService';

// Baris 30: State reaktif untuk menyimpan array data cryptocurrency
const coins = ref<CryptoCoin[]>([]);
// Baris 31: State boolean untuk melacak status proses loading pengambilan data
const isLoading = ref<boolean>(false);
// Baris 32: State penanda apakah data berasal dari cache lokal (offline fallback)
const isFallback = ref<boolean>(false);
// Baris 33: State string untuk menampung pesan error jika pemanggilan API gagal
const errorMessage = ref<string>('');
// Baris 34: State string untuk menampung kata kunci pencarian dari searchbar
const searchQuery = ref<string>('');
// Baris 35: State string untuk menampilkan waktu pembaruan data terakhir
const lastUpdated = ref<string>('');

// Baris 36: Fungsi helper untuk memformat angka harga ke format desimal rapi (contoh: 27604.54)
const formatPrice = (val: string | number): string => {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return '0.00';
  if (num >= 1) {
    // Memformat angka ribuan dengan pemisah koma dan dua angka di belakang desimal
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    // Koin mikro bernilai di bawah 1 USD tetap menampilkan nilai desimal aslinya
    return num.toString();
  }
};

// Baris 37: Computed property untuk menyaring daftar koin secara instan sesuai kata kunci pencarian
const filteredCoins = computed(() => {
  if (!searchQuery.value.trim()) return coins.value;
  const q = searchQuery.value.toLowerCase().trim();
  return coins.value.filter(
    c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
  );
});

// Baris 38: Fungsi asinkron utama untuk mengambil data cryptocurrency dari Coinlore API
const fetchData = async (isPull = false) => {
  // Hanya aktifkan spinner besar jika bukan dipicu oleh pull-to-refresh
  if (!isPull) isLoading.value = true;
  errorMessage.value = '';

  try {
    // Memanggil API Coinlore untuk mengambil 100 koin teratas dunia
    const result = await getCryptoTickers(0, 100);
    coins.value = result.data;
    isFallback.value = result.fromCache;
    const now = new Date();
    lastUpdated.value = `${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB`;
  } catch (err: any) {
    errorMessage.value = err.message || 'Gagal memuat data dari API';
  } finally {
    isLoading.value = false;
  }
};

// Baris 39: Handler penanganan event gestur mobile pull-to-refresh
const handlePullRefresh = async (event: CustomEvent) => {
  await fetchData(true);
  // Memberitahu Ionic bahwa proses refresh data telah selesai
  (event.target as HTMLIonRefresherElement).complete();
};

// Baris 40: Hook siklus hidup Vue 3 yang otomatis dieksekusi saat komponen terpasang di layar
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Baris 41: Latar belakang keseluruhan layar aplikasi mobile */
.content-background { --background: #f0f2f5; }

/* Baris 42: Batas lebar wadah aplikasi ponsel cerdas agar simetris */
.mobile-container { max-width: 480px; margin: 0 auto; padding-bottom: 24px; }

/* Baris 43: Tombol Refresh Header berwarna biru sesuai gambar mockup soal Tugas 3 */
.header-refresh-btn {
  --background: #0d6efd;
  --color: #ffffff;
  --border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  height: 32px;
  margin-right: 8px;
}

/* Baris 44: Animasi putaran ikon saat tombol ditekan */
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

.search-toolbar { --min-height: 48px; padding-bottom: 4px; }
.custom-search { --background: #ffffff; --color: #1a1a1a; --border-radius: 8px; padding-top: 0; }

.status-meta {
  display: flex; justify-content: space-between; align-items: center;
  margin: 10px 4px 14px 4px; font-size: 12px; color: #495057;
}
.count-badge { background: #e3f2fd; color: #0d47a1; padding: 3px 8px; border-radius: 12px; font-weight: 600; }
.fallback-pill { background: #fff3cd; color: #856404; padding: 3px 8px; border-radius: 12px; font-size: 11px; }
.time-label { font-size: 11px; color: #6c757d; }

.crypto-list { display: flex; flex-direction: column; gap: 10px; }

/* Baris 45: DESAIN KARTU SESUAI PERSIS MOCKUP TUGAS 3: Latar Krem Emas (#FEF9E7) & Garis Emas (#EBDCB2) */
.crypto-card {
  display: flex;
  align-items: center;
  background-color: #fef9e7;
  border: 1px solid #ebdcb2;
  border-radius: 10px;
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

/* Baris 46: Penataan Kolom 1 (Rank Kiri) */
.col-rank { display: flex; flex-direction: column; align-items: flex-start; min-width: 50px; }
.field-label { font-size: 11px; font-weight: 500; color: #6c757d; margin-bottom: 2px; }
.field-rank { font-size: 22px; font-weight: 800; color: #212529; line-height: 1.1; }

/* Baris 47: Penataan Kolom 2 (Name & Symbol Tengah) */
.col-name-symbol { display: flex; flex-direction: column; align-items: flex-start; flex: 1; padding: 0 12px; overflow: hidden; }
.field-name { font-size: 12px; font-weight: 500; color: #495057; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
.field-symbol { font-size: 20px; font-weight: 800; color: #111827; letter-spacing: 0.5px; line-height: 1.1; }

/* Baris 48: Penataan Kolom 3 (USD Price Kanan) */
.col-price { display: flex; flex-direction: column; align-items: flex-end; text-align: right; min-width: 110px; }
.field-price { font-size: 17px; font-weight: 700; color: #1e293b; line-height: 1.2; }

/* Baris 49: Indikator persentase 24 jam (Hijau = Naik, Merah = Turun) */
.pct-badge { font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 4px; margin-top: 3px; }
.pct-up { background-color: #d1e7dd; color: #0f5132; }
.pct-down { background-color: #f8d7da; color: #842029; }

.loading-state, .error-box, .empty-state {
  text-align: center; padding: 36px 16px; background: #ffffff; border-radius: 12px; margin-top: 16px;
}
.error-icon { font-size: 40px; color: #dc3545; margin-bottom: 8px; }
</style>
