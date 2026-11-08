import axios from 'axios';
import type { CryptoCoin, CoinloreResponse } from '../types/crypto';

const API_BASE_URL = 'https://api.coinlore.net/api/tickers/';

/**
 * Data Cadangan (Mock Data) yang presisi sesuai tangkapan layar soal Tugas 3
 * Digunakan sebagai fallback jika perangkat offline atau koneksi API dibatasi.
 */
export const FALLBACK_COINS: CryptoCoin[] = [
  {
    id: "90",
    rank: 1,
    name: "Bitcoin",
    symbol: "BTC",
    nameid: "bitcoin",
    price_usd: "27604.54",
    percent_change_24h: "1.45"
  },
  {
    id: "80",
    rank: 2,
    name: "Ethereum",
    symbol: "ETH",
    nameid: "ethereum",
    price_usd: "1720.54",
    percent_change_24h: "-0.82"
  },
  {
    id: "518",
    rank: 3,
    name: "Tether",
    symbol: "USDT",
    nameid: "tether",
    price_usd: "1.00",
    percent_change_24h: "0.01"
  },
  {
    id: "2710",
    rank: 4,
    name: "Binance Coin",
    symbol: "BNB",
    nameid: "binance-coin",
    price_usd: "255.15",
    percent_change_24h: "2.10"
  },
  {
    id: "33285",
    rank: 5,
    name: "USD Coin",
    symbol: "USDC",
    nameid: "usd-coin",
    price_usd: "0.999867",
    percent_change_24h: "-0.02"
  },
  {
    id: "58",
    rank: 6,
    name: "XRP",
    symbol: "XRP",
    nameid: "xrp",
    price_usd: "0.533625",
    percent_change_24h: "3.75"
  },
  {
    id: "48543",
    rank: 7,
    name: "Staked Ether",
    symbol: "STEHT",
    nameid: "staked-ether",
    price_usd: "1717.92",
    percent_change_24h: "-0.65"
  },
  {
    id: "2",
    rank: 8,
    name: "Dogecoin",
    symbol: "DOGE",
    nameid: "dogecoin",
    price_usd: "0.158420",
    percent_change_24h: "5.12"
  },
  {
    id: "48543",
    rank: 9,
    name: "Cardano",
    symbol: "ADA",
    nameid: "cardano",
    price_usd: "0.485120",
    percent_change_24h: "-1.15"
  },
  {
    id: "45219",
    rank: 10,
    name: "Solana",
    symbol: "SOL",
    nameid: "solana",
    price_usd: "142.68",
    percent_change_24h: "4.30"
  }
];

/**
 * Mengambil daftar data Cryptocurrency dari Coinlore API
 * @param start offset data (default 0)
 * @param limit jumlah entri yang diambil (default 100)
 */
export async function getCryptoTickers(start = 0, limit = 100): Promise<{ data: CryptoCoin[]; fromCache: boolean }> {
  try {
    const url = `${API_BASE_URL}?start=${start}&limit=${limit}`;
    const response = await axios.get<CoinloreResponse>(url, { timeout: 8000 });
    
    if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      return { data: response.data.data, fromCache: false };
    }
    throw new Error('Respon data API kosong');
  } catch (err) {
    console.warn('Gagal memuat API Coinlore daring. Menggunakan data cadangan sesuai panduan Tugas 3:', err);
    return { data: FALLBACK_COINS, fromCache: true };
  }
}
