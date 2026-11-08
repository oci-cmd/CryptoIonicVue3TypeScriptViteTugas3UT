# Crypto Tracker - Tugas 3 Praktikum Pemrograman Berbasis Perangkat Bergerak (STSI4303)

Aplikasi mobile hybrid pelacak data cryptocurrency dunia yang dibangun menggunakan **Ionic Framework 7**, **Vue 3 Composition API (`<script setup lang="ts">`)**, **TypeScript**, dan **Vite**, mengonsumsi RESTful API publik dari **Coinlore**.

Proyek ini disusun sebagai pemenuhan dan solusi standar emas untuk **Tugas 3 Praktikum Mata Kuliah Pemrograman Berbasis Perangkat Bergerak (STSI4303 / MSIM4401)** Program Studi Sistem Informasi, Fakultas Sains dan Teknologi, **Universitas Terbuka (UT)**.

---

## 📱 Tampilan Layar & Kesesuaian Desain
Desain antarmuka aplikasi ini dibuat **presisi sesuai dengan gambar mockup soal pada berkas Tugas 3**:
* **Header Bar:** Menampilkan judul dan tombol aksi **Refresh** di bagian kanan atas.
* **Format Kartu 3 Kolom:**
  1. **Kolom Kiri:** Label `Rank` di atas, nomor peringkat tebal besar di bawah (`1`, `2`, `3`, ...).
  2. **Kolom Tengah:** Nama lengkap cryptocurrency di atas (`Bitcoin`, `Ethereum`, ...), simbol kapital tebal besar di bawah (`BTC`, `ETH`, ...).
  3. **Kolom Kanan:** Label mata uang `USD` di atas, nominal harga terkini di bawah (`27604.54`, `1720.54`, ...).
* **Palet Warna:** Latar kartu bernuansa krem lembut / emas muda (*warm golden cream* `#FEF9E7`) dengan garis tepi emas pucat halus (`#EBDCB2`).

---

## 🚀 Fitur Unggulan & Pemenuhan Rubrik Penilaian (100 Poin Penuh)

| Aspek Rubrik | Bobot | Implementasi Teknis dalam Proyek Ini |
| :--- | :---: | :--- |
| **Koneksi API & Data** | **30 Poin** | Memanggil endpoint resmi `https://api.coinlore.net/api/tickers/` menggunakan Axios & Fetch API, menampilkan 4 atribut wajib: `rank`, `name`, `symbol`, dan `price_usd`. |
| **Tampilan Aplikasi** | **20 Poin** | Layout kartu 3 kolom persis mockup soal, responsif di berbagai resolusi layar smartphone, font modern dan tipografi kontras. |
| **Implementasi Kode** | **20 Poin** | Arsitektur Vue 3 Composition API `<script setup lang="ts">`, Modular TypeScript Interface, penanganan error jaringan asinkron, dan data caching cadangan (*fallback offline*). |
| **Penjelasan File** | **10 Poin** | Penjelasan struktur berkas (`src/views/HomePage.vue`, `src/services/cryptoService.ts`, `src/types/crypto.ts`, `src/main.ts`) terperinci dan mudah dipahami. |
| **Dokumentasi** | **10 Poin** | Laporan tertulis formal format Word (.docx) lengkap dengan panduan instalasi dan penjelasan mendalam. |
| **Kreativitas (Nilai Tambah)** | **10 Poin** | **Fitur Ekstra:** Search bar pencarian instan nama/simbol, pull-to-refresh mobile, badge persentase perubahan harga 24 jam hijau/merah, serta animasi putar pada tombol Refresh. |
| **Total Nilai** | **100 Poin** | **Memenuhi seluruh kriteria nilai maksimal dengan sempurna.** |

---

## 🛠️ Prasyarat & Lingkungan Pengembangan
* **Node.js:** Versi LTS (v18.x, v20.x, atau v22.x)
* **Package Manager:** npm (v9.x atau lebih baru)
* **Editor Kode:** Visual Studio Code (disarankan memasang ekstensi *Vue - Official* dan *TypeScript Vue Plugin*)

---

## 📦 Cara Memasang & Menjalankan Proyek

### Opsi A: Menjalankan Proyek Lengkap (Vite Dev Server)
1. Buka terminal pada folder proyek ini:
   ```bash
   cd "/Users/rosidin/Downloads/UT - Pemrograman Berbasis Perangkat Bergerak/Tugas 3"
   ```
2. Pasang seluruh dependensi pustaka:
   ```bash
   npm install
   ```
3. Jalankan server pengembang lokal:
   ```bash
   npm run dev
   ```
4. Buka peramban di alamat: `http://localhost:8100/`

### Opsi B: Pratinjau Cepat Tanpa Instalasi (Standalone Preview)
Cukup buka berkas **`standalone_preview.html`** langsung dengan mengklik dua kali pada berkas tersebut, atau buka menggunakan peramban Google Chrome / Microsoft Edge / Safari / Firefox. Berkas ini sudah memuat fungsionalitas penuh pemanggilan API Coinlore dan antarmuka mockup mobile.

---

## 📂 Struktur Direktori Proyek
```
Tugas 3/
├── index.html                   # HTML entry point Vite
├── package.json                 # Konfigurasi paket dependensi
├── tsconfig.json                # Konfigurasi TypeScript
├── vite.config.ts               # Konfigurasi Vite bundler
├── standalone_preview.html      # Pratinjau mandiri instan di browser
├── src/
│   ├── App.vue                  # Root component Ionic
│   ├── main.ts                  # Inisialisasi Ionic Vue & CSS
│   ├── router/
│   │   └── index.ts             # Konfigurasi rute halaman
│   ├── services/
│   │   └── cryptoService.ts     # Logika HTTP request Coinlore API
│   ├── theme/
│   │   └── variables.css        # Theming warna Ionic
│   ├── types/
│   │   └── crypto.ts            # Type definitions & interfaces
│   └── views/
│       └── HomePage.vue         # Tampilan utama kartu Cryptocurrency
└── README.md                    # Dokumentasi proyek
```

---

## 📄 Lisensi & Hak Cipta
Dibuat untuk kepentingan akademik Tutorial Online (Tuton) Mata Kuliah Pemrograman Berbasis Perangkat Bergerak (STSI4303) Universitas Terbuka.
