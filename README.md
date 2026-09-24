# Cind3rella — Dari hati. Untuk dirasa.

Website editorial band dengan foto asli, warna lavender–plum, tipografi Instrument Serif / DM Sans, parallax berlapis, dan pengalaman musik yang benar-benar berfungsi. Dibuat di folder kerja pemilik proyek dan disiapkan untuk preview lokal; tidak otomatis menerbitkan domain atau GitHub Pages.

## Jalankan
Gunakan Node.js yang kompatibel dengan Vite 8 dan npm. Di Windows PowerShell gunakan `npm.cmd` untuk menghindari konflik kebijakan eksekusi skrip npm.ps1.
```sh
npm ci
npm run dev
```
Preview: http://127.0.0.1:4186 . Alternatif Windows: klik dua kali `Start-Website.cmd`.
```sh
npm run build
npm run preview
```
`build` menjalankan pemeriksaan TypeScript strict dan menghasilkan situs statis di `dist/`. Port 4186 memakai strictPort: server tidak diam-diam berpindah port bila sedang digunakan. Jangan jalankan dev dan preview bersamaan pada port yang sama. Hentikan dengan Ctrl+C di terminalnya.

## Fitur dan arsitektur
`index.html` menyediakan konten semantik, tautan asli, SEO, dan dialog. `src/player.ts` mengelola lima cuplikan Apple Music, perpindahan lagu, play/pause, seek, serta kegagalan jaringan. Tidak ada autoplay audio atau unduhan lagu penuh. `src/tracks.json` adalah snapshot katalog tersaring, bukan API live.
`src/motion.ts` memakai requestAnimationFrame saat scroll/resize, IntersectionObserver, preferensi gerakan lokal, dan dukungan prefers-reduced-motion. `src/ui.ts` menangani menu mobile, galeri, video YouTube yang dimuat setelah klik, kredit, serta formulir detail acara.
Booking adalah alur dua langkah: siapkan detail di browser, lalu pengunjung sendiri membuka dan mengirim pesan WhatsApp. Tidak ada backend, penyimpanan lead, pengiriman otomatis, pembayaran, atau formulir yang berpura-pura sudah mengirim.
Google Fonts, audio Apple, dan video YouTube memerlukan koneksi internet. Kegagalan pemutar memiliki pesan serta tautan platform alternatif. Tidak ada key API, token, atau kredensial yang diperlukan.

## Konten dan sumber
Baca [riset](docs/RESEARCH.md) dan [kredit aset](docs/ASSETS.md). Data melampaui profil lama, tetapi tidak mengklaim semua feed sosial dapat diakses. TikTok hanya ditautkan berdasarkan profil; Spotify adalah tautan pencarian berlabel jelas. Tidak ada jadwal konser baru yang direkayasa. Slogan halaman adalah usulan copy kreatif.

## Pemeriksaan lokal
Build produksi, tampilan desktop/tablet/mobile, gambar, pemutar, video dialog, galeri, form, keyboard/fokus, serta preferensi gerakan diperiksa menggunakan Chrome dan Playwright pada laptop proyek. Skenario mencakup lebar 320, 360, 390, 768, dan 1440 piksel; kelima URL cuplikan benar-benar mencapai status bermain. Pemeriksaan pemutar video memvalidasi modal, URL resmi, tautan alternatif, dan penghentian iframe saat ditutup, bukan menjamin seluruh kebijakan embed pihak YouTube.
Skrip dan screenshot QA adalah artefak sementara di direktori Temp pengguna, tidak ikut dikirim ke GitHub. Ini bukan audit keamanan formal, sertifikasi aksesibilitas, atau pengukuran Lighthouse.

## Sebelum publikasi domain
Konfirmasikan copy dan kontak dengan management, tinjau hak publikasi aset, dan lengkapi URL artis Spotify langsung bila sudah dipastikan. Setelah itu `dist/` dapat ditempatkan pada hosting statis; `base: './'` membuat keluaran dapat dipindah ke subdirektori. Tidak ada deployment publik otomatis yang dikonfigurasi.
