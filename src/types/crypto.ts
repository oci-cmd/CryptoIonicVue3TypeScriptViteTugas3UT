/**
 * BERKAS: src/types/crypto.ts
 * DESKRIPSI: Definisi antarmuka (interface) data TypeScript untuk type-safety data API Coinlore
 */

// Interface untuk satu entri objek cryptocurrency dari API
export interface CryptoCoin {
  id: string;                 // Baris 1: ID unik koin dari sistem basis data Coinlore
  symbol: string;             // Baris 2: Simbol/ticker mata uang kripto (contoh: BTC, ETH, USDT)
  name: string;               // Baris 3: Nama lengkap resmi cryptocurrency (contoh: Bitcoin, Ethereum)
  nameid: string;             // Baris 4: Slug identifier untuk URL API Coinlore (contoh: 'bitcoin')
  rank: number;               // Baris 5: Nomor peringkat/ranking berdasarkan kapitalisasi pasar (contoh: 1, 2)
  price_usd: string;          // Baris 6: Harga terkini koin dalam satuan Dolar Amerika (USD)
  percent_change_24h: string; // Baris 7: Persentase naik/turun fluktuasi harga dalam 24 jam terakhir
  percent_change_1h?: string; // Baris 8: Opsional: Persentase perubahan harga 1 jam terakhir
  percent_change_7d?: string; // Baris 9: Opsional: Persentase perubahan harga 7 hari terakhir
  market_cap_usd?: string;    // Baris 10: Opsional: Total estimasi nilai kapitalisasi pasar koin (USD)
}

// Interface untuk metadata paginasi yang dikembalikan oleh API Coinlore
export interface CoinloreInfo {
  coins_num: number;          // Baris 11: Jumlah total koin yang tersedia dalam sistem API
  time: number;               // Baris 12: Timestamp UNIX waktu pengambilan data dari server
}

// Interface struktur payload utama (root response) dari endpoint API Coinlore
export interface CoinloreResponse {
  data: CryptoCoin[];         // Baris 13: Array yang berisi daftar objek koin cryptocurrency
  info: CoinloreInfo;         // Baris 14: Objek metadata statistik dari server Coinlore
}
