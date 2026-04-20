# Laporan Analisis & Justifikasi Desain - Interaksi Manusia dan Komputer (IMK)

**Studi Kasus:** Redesain Website SMAN 1 Bantarbolang (dan Portal PPDB)

Berdasarkan tugas analisis desain untuk website sekolah (termasuk halaman `index.html` dan `external.html`), kelompok kami telah melakukan evaluasi dan merombak *UI (User Interface)* dari desain sebelumnya.

Berikut ini adalah pembahasan penentuan perangkat interaksi, penggunaan object control UI, serta justifikasi perubahannya.

---

## 1. Penentuan Perangkat Interaksi Input & Output

Kami menyesuaikan mekanisme input dan output agar interaksi pengguna (orang tua/calon siswa) menjadi lebih intuitif, cepat, dan jelas.

### A. Perangkat Interaksi Input
- **Keyboard (Desktop) / Virtual Keyboard (Mobile):** 
  - **Penerapan:** Spotlight Search (dengan *shortcut* `Ctrl+K`), input Text Field (NISN, Nama) di halaman pendaftaran PPDB.
  - **Justifikasi:** Pengguna membutuhkan pencarian cepat. Spotlight search memungkinkan navigasi instan tanpa harus berpindah ke halaman lain. Input text field pada borang pendaftaran diberi atribut validasi asli (`pattern="\d{10}"`) untuk meminimalisasi kesalahan input manual.
- **Mouse (Desktop) / Touch & Tap (Mobile):**
  - **Penerapan:** Navigasi Hover/Click pada *Dropdown Menu* utama, interaksi *drag/click* pada Custom File Upload, serta interaksi opsi pada Radio Buttons.
  - **Justifikasi:** Desain sebelumnya mungkin terlalu mengandalkan hover atau link statis. Pada *external.html* yang baru, kami menyediakan target tap/klik yang cukup luas (ukuran tombol proporsional, radio button berukuran standar jari) sesuai kaidah Fitts's Law untuk pengguna sentuh (mobile-friendly).

### B. Perangkat Interaksi Output
- **Visual Feedback & Micro-interactions:**
  - **Penerapan:** *Hover effects* (transisi warna), *Loading button spinner*, serta *Stepper progress indicator* di menu PPDB.
  - **Justifikasi:** Saat form disubmit (`script.js`), tombol berubah memunculkan animasi loading (`<span class="loading-spinner"></span>`) dan tombol menjadi statis (disabled). Ini mencegah pengguna (khususnya orang tua) menekan tombol "Kirim" berkali-kali karena bingung apakah sistem sedang memproses.
- **Custom Toast Notifications (Menggantikan Alert Native):**
  - **Penerapan:** Diimplementasikan di `index.html` dan `external.html`. Sistem memberikan pesan melayang (Toast) berwarna sesuai konteks (Hijau-Sukses, Kuning-Peringatan).
  - **Justifikasi:** Pesan output tradisional (seperti `alert()` pada desain sebelumnya) bersifat *blocking* (menghentikan aktivitas *browser*) dan terlihat kaku. *Toast notification* sangat relevan dengan kebutuhan pengguna modern—memberi notifikasi secara asinkron (tidak memblokir interaksi) namun tetap menarik perhatian visual.

---

## 2. Penggunaan Object Control UI yang Paling Tepat

Pada desain `external.html` (Portal Simulasi PPDB), sebelumnya hanya berupa *dummy link* sederhana. Kami merombaknya menjadi simulasi formulir pendaftaran utuh dengan menggunakan kontrol UI spesifik yang didasarkan pada tipe datanya.

| Tipe Data / Kebutuhan | Object Control UI yang Dipilih | Justifikasi Pemilihan |
| :--- | :--- | :--- |
| **Kuantitatif Spesifik** (NISN, Nama) | `Text Input Field` | Membutuhkan entri yang sangat spesifik dan bebas dari pengguna. Diberikan placeholder agar pengguna tidak bingung format teksnya. |
| **Kategorik Tertutup Pendek** (Jenis Kelamin) | `Radio Buttons` | Hanya ada dua pilihan (eksusif) — kontrol UI terpusat agar pengguna langsung bisa melihat semua opsi dan memilih dengan satu klik (lebih cepat dari dropdown). |
| **Kategorik Berderet** (Jalur PPDB) | `Select (Dropdown)` | Karena jalurnya memiliki 4-5 jenis, *select* menghemat *screen real-estate* (ruang layar) tanpa membuat halaman terlihat penuh dan sesak. |
| **Dokumen Fisik** (Unggah Berkas) | `Custom File Input` | Native file input sangat kaku tampilannya. Custom file input yang ditambahkan di UI memberikan umpan balik (output) visual berupa nama file (*fileNameDisp*) saat berhasil dipilih, memberikan *peace of mind* bagi pengguna. |
| **Indikator Proses** (Status Pendaftaran) | `Stepper Indicator` | PPDB adalah proses multi-tahap yang membuat calon pendaftar cemas. *Stepper UI* ("Data Diri" -> "Berkas" -> "Selesai") memberikan kejelasan spasial orientasi: pengguna selalu tahu berada pada titik mana di dalam suatu proses. |

---

## 3. Ringkasan Justifikasi Perubahan Total

Berdasarkan tinjauan situs-situs nyata *(termasuk website asli yang strukturnya kurang bersih)*, perubahan yang kami lakukan (terutama memuat form penuh pada simulasi `external.html`) ditujukan murni untuk pemenuhan kaidah **Efikasi** dan **Kemudahan (Ease of Use)** dalam bidang HCI (Human-Computer Interaction).

- **Mental Model Pengguna:** Saat pengguna mengeklik "Portal PPDB", mental model mereka adalah *"Saya akan dihadapkan pada sebuah borang/formulir pendaftaran atau sistem tracking."* Dengan membuat *external.html* menjadi portal pendaftaran (berupa Form, Select, Radio, Stepper) yang memiliki validasi data, kami menyamakan antarmuka dengan ekspektasi pengguna.
- **Minimalisasi Kesalahan Berbasis Aturan (Slips/Mistakes):** Dengan `pattern="\d{10}"` pada input NISN, serta *required fields* dengan indikator asterisk (`*`), kami membantu pengguna untuk tidak membuat kesalahan sejak di fase input *(Error Prevention)* sebelum data dikirim ke *server*.
