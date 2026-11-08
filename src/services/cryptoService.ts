/**
 * BERKAS: src/services/cryptoService.ts
 * DESKRIPSI: Modul layanan HTTP asinkron untuk mengambil data dari REST API Coinlore
 */

import axios from 'axios';                                              // Baris 1: Impor library HTTP client Axios
import type { CryptoCoin, CoinloreResponse } from '../types/crypto';     // Baris 2: Impor interface data TypeScript

// Baris 3: URL endpoint resmi Coinlore API untuk mengambil daftar harga cryptocurrency
const API_BASE_URL = 'https://api.coinlore.net/api/tickers/';

// Baris 4: Data cadangan lokal presisi sesuai gambar mockup soal Tugas 3 (jika perangkat offline)
export const FALLBACK_COINS: CryptoCoin[] = [
  { id: '90', rank: 1, name: 'Bitcoin', symbol: 'BTC', price_usd: '27604.54', percent_change_24h: '1.45', nameid: 'bitcoin' },
  { id: '80', rank: 2, name: 'Ethereum', symbol: 'ETH', price_usd: '1720.54', percent_change_24h: '-0.82', nameid: 'ethereum' },
  { id: '518', rank: 3, name: 'Tether', symbol: 'USDT', price_usd: '1.00', percent_change_24h: '0.01', nameid: 'tether' },
  { id: '2710', rank: 4, name: 'Binance Coin', symbol: 'BNB', price_usd: '255.15', percent_change_24h: '2.10', nameid: 'binance-coin' },
  { id: '33285', rank: 5, name: 'USD Coin', symbol: 'USDC', price_usd: '0.999867', percent_change_24h: '-0.02', nameid: 'usd-coin' },
  { id: '58', rank: 6, name: 'XRP', symbol: 'XRP', price_usd: '0.533625', percent_change_24h: '3.75', nameid: 'xrp' },
  { id: '48543', rank: 7, name: 'Staked Ether', symbol: 'STEHT', price_usd: '1717.92', percent_change_24h: '-0.65', nameid: 'staked-ether' }
];

// Baris 5: Fungsi asinkron utama untuk memanggil REST API Coinlore dengan parameter offset & limit
export async function getCryptoTickers(start = 0, limit = 100): Promise<{ data: CryptoCoin[]; fromCache: boolean }> {
  try {
    // Baris 6: Menyusun query string URL pemanggilan API
    const url = `${API_BASE_URL}?start=${start}&limit=${limit}`;
    // Baris 7: Mengirimkan HTTP GET request ke server API dengan batasan waktu (timeout) 8 detik
    const response = await axios.get<CoinloreResponse>(url, { timeout: 8000 });
    
    // Baris 8: Memeriksa validitas data apakah berupa array dan tidak kosong
    if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      // Baris 9: Mengembalikan data live hasil request API online (fromCache: false)
      return { data: response.data.data, fromCache: false };
    }
    // Baris 10: Melempar galat jika data kosong
    throw new Error('Data respon API kosong');
  } catch (err) {
    // Baris 11: Menangkap galat jaringan (misalnya saat offline atau emulator tanpa internet)
    console.warn('Gagal memanggil API Coinlore online, beralih ke data cadangan:', err);
    // Baris 12: Mengembalikan data cadangan lokal agar aplikasi tetap tampil sempurna (fromCache: true)
    return { data: FALLBACK_COINS, fromCache: true };
  }
}
