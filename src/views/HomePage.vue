<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-title>Crypto Tracker UT</ion-title>
        <!-- Tombol Refresh Utama di Header Sesuai Desain Tugas 3 -->
        <ion-buttons slot="end">
          <ion-button class="header-refresh-btn" @click="fetchData(false)">
            <ion-icon slot="start" :icon="refreshOutline" :class="{ 'spin-icon': isLoading }"></ion-icon>
            Refresh
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <!-- Fitur Nilai Tambah (Bonus 10 Poin): Search Bar Pencarian Instan -->
      <ion-toolbar color="primary" class="search-toolbar">
        <ion-searchbar
          v-model="searchQuery"
          placeholder="Cari nama atau simbol (cth: BTC, Bitcoin)..."
          :debounce="150"
          class="custom-search"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding content-background">
      <!-- Ionic Pull-to-Refresh untuk pengalaman aplikasi mobile native -->
      <ion-refresher slot="fixed" @ionRefresh="handlePullRefresh($event)">
        <ion-refresher-content pulling-text="Tarik untuk memperbarui..." refreshing-spinner="circles">
        </ion-refresher-content>
      </ion-refresher>

      <div class="mobile-container">
        <!-- Status Bar Ringkas -->
        <div class="status-meta">
          <span class="count-badge">Menampilkan: {{ filteredCoins.length }} Koin</span>
          <span v-if="isFallback" class="fallback-pill">Mode Cadangan (Offline)</span>
          <span class="time-label">{{ lastUpdated }}</span>
        </div>

        <!-- Indikator Loading Spinner -->
        <div v-if="isLoading && coins.length === 0" class="loading-state">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <p>Memuat data cryptocurrency dari Coinlore API...</p>
        </div>

        <!-- Tampilan Galat / Error State -->
        <div v-else-if="errorMessage" class="error-box">
          <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
          <p>{{ errorMessage }}</p>
          <ion-button size="small" color="primary" @click="fetchData(false)">Coba Lagi</ion-button>
        </div>

        <!-- DAFTAR KARTU CRYPTOCURRENCY SESUAI PERSIS DENGAN TAMPILAN SOAL TUGAS 3 -->
        <div v-else class="crypto-list">
          <div
            v-for="coin in filteredCoins"
            :key="coin.id"
            class="crypto-card"
          >
            <!-- 1. Kolom Kiri: Rank -->
            <div class="col-rank">
              <span class="field-label">Rank</span>
              <span class="field-rank">{{ coin.rank }}</span>
            </div>

            <!-- 2. Kolom Tengah: Nama & Simbol -->
            <div class="col-name-symbol">
              <span class="field-name">{{ coin.name }}</span>
              <span class="field-symbol">{{ coin.symbol }}</span>
            </div>

            <!-- 3. Kolom Kanan: Label USD & Nominal Harga -->
            <div class="col-price">
              <span class="field-label">USD</span>
              <span class="field-price">{{ formatPrice(coin.price_usd) }}</span>
              <!-- Nilai Tambah: Indikator Perubahan 24 Jam -->
              <span
                v-if="coin.percent_change_24h"
                class="pct-badge"
                :class="parseFloat(coin.percent_change_24h) >= 0 ? 'pct-up' : 'pct-down'"
              >
                {{ parseFloat(coin.percent_change_24h) >= 0 ? '+' : '' }}{{ coin.percent_change_24h }}%
              </span>
            </div>
          </div>

          <!-- Empty State Pencarian -->
          <div v-if="filteredCoins.length === 0" class="empty-state">
            <p>Tidak ada cryptocurrency yang cocok dengan "{{ searchQuery }}"</p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
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
import { refreshOutline, alertCircleOutline } from 'ionicons/icons';
import { ref, computed, onMounted } from 'vue';
import type { CryptoCoin } from '../types/crypto';
import { getCryptoTickers } from '../services/cryptoService';

// Reactive State
const coins = ref<CryptoCoin[]>([]);
const isLoading = ref<boolean>(false);
const isFallback = ref<boolean>(false);
const errorMessage = ref<string>('');
const searchQuery = ref<string>('');
const lastUpdated = ref<string>('');

// Format Angka Harga ke format rapi (contoh: 27604.54 atau desimal kecil 0.533625)
const formatPrice = (val: string | number): string => {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return '0.00';
  if (num >= 1) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    // Koin mikro/harga di bawah 1 USD mempertahankan presisi desimal asli
    return num.toString();
  }
};

// Filter Koin berdasarkan input pencarian
const filteredCoins = computed(() => {
  if (!searchQuery.value.trim()) return coins.value;
  const q = searchQuery.value.toLowerCase().trim();
  return coins.value.filter(
    c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
  );
});

// Fungsi Pengambil Data Utama
const fetchData = async (isPull = false) => {
  if (!isPull) isLoading.value = true;
  errorMessage.value = '';

  try {
    const result = await getCryptoTickers(0, 100);
    coins.value = result.data;
    isFallback.value = result.fromCache;
    const now = new Date();
    lastUpdated.value = `Update: ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB`;
  } catch (err: any) {
    errorMessage.value = err.message || 'Gagal memuat data dari API';
  } finally {
    isLoading.value = false;
  }
};

// Handler Pull-to-Refresh
const handlePullRefresh = async (event: CustomEvent) => {
  await fetchData(true);
  (event.target as HTMLIonRefresherElement).complete();
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.content-background {
  --background: #f0f2f5;
}

.mobile-container {
  max-width: 480px;
  margin: 0 auto;
  padding-bottom: 24px;
}

/* Tombol Refresh Header Sesuai Gambar Soal Tugas 3 */
.header-refresh-btn {
  --background: #0d6efd;
  --color: #ffffff;
  --border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  height: 32px;
  margin-right: 8px;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.search-toolbar {
  --min-height: 48px;
  padding-bottom: 4px;
}

.custom-search {
  --background: #ffffff;
  --color: #1a1a1a;
  --placeholder-color: #6c757d;
  --border-radius: 8px;
  padding-top: 0;
  padding-bottom: 4px;
}

.status-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 4px 14px 4px;
  font-size: 12px;
  color: #495057;
}

.count-badge {
  background: #e3f2fd;
  color: #0d47a1;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.fallback-pill {
  background: #fff3cd;
  color: #856404;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
}

.time-label {
  font-size: 11px;
  color: #6c757d;
}

/* DESAIN KARTU CRYPTOCURRENCY:
   Sesuai Persis dengan Gambar Mockup Soal Tugas 3
   Latar Belakang: Krem Hangat / Golden Cream (#FEF9E7)
   Garis Pinggir: Emas Pucat (#E9DEC0)
*/
.crypto-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.crypto-card {
  display: flex;
  align-items: center;
  background-color: #fef9e7;
  border: 1px solid #ebdcb2;
  border-radius: 10px;
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.crypto-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

/* 1. Kolom Kiri: Rank */
.col-rank {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 50px;
}

.field-label {
  font-size: 11px;
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 2px;
  text-transform: capitalize;
}

.field-rank {
  font-size: 22px;
  font-weight: 800;
  color: #212529;
  line-height: 1.1;
}

/* 2. Kolom Tengah: Name & Symbol */
.col-name-symbol {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  padding: 0 12px;
  overflow: hidden;
}

.field-name {
  font-size: 12px;
  font-weight: 500;
  color: #495057;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.field-symbol {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  letter-spacing: 0.5px;
  line-height: 1.1;
}

/* 3. Kolom Kanan: Price USD */
.col-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  min-width: 110px;
}

.field-price {
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

/* Nilai Tambah: Indikator Persentase 24 Jam */
.pct-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  margin-top: 3px;
  display: inline-block;
}

.pct-up {
  background-color: #d1e7dd;
  color: #0f5132;
}

.pct-down {
  background-color: #f8d7da;
  color: #842029;
}

.loading-state,
.error-box,
.empty-state {
  text-align: center;
  padding: 36px 16px;
  background: #ffffff;
  border-radius: 12px;
  margin-top: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.error-icon {
  font-size: 40px;
  color: #dc3545;
  margin-bottom: 8px;
}

.empty-state p {
  color: #6c757d;
  font-size: 14px;
}
</style>
