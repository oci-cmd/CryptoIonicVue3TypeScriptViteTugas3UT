/**
 * Interface Data Cryptocurrency dari Coinlore API
 * Endpoint: https://api.coinlore.net/api/tickers/
 * Mata Kuliah: Pemrograman Berbasis Perangkat Bergerak (STSI4303)
 */
export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  nameid: string;
  rank: number;
  price_usd: string;
  percent_change_24h: string;
  percent_change_1h?: string;
  percent_change_7d?: string;
  price_btc?: string;
  market_cap_usd?: string;
  volume24?: number;
  volume24a?: number;
  csupply?: string;
  tsupply?: string;
  msupply?: string;
}

export interface CoinloreInfo {
  coins_num: number;
  time: number;
}

export interface CoinloreResponse {
  data: CryptoCoin[];
  info: CoinloreInfo;
}
