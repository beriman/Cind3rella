---
creator: Beriman Juliano
updated: 2026-10-21
---
# Cind3rella — Dari hati. Untuk dirasa.

Website band dengan hero sinematik, parallax, galeri studio/artwork, katalog musik, dokumentasi panggung, dan formulir draft WhatsApp. Sumber utama ada di GitHub `beriman/Cind3rella`; proyek hosting Vercel bernama `cind3rella`. Situs produksi: https://cind3rella.vercel.app/ .

## Edisi visual
Hero desktop menggunakan `hero-cinematic.webp`; mobile menggunakan komposisi portrait `moonlit-trio.webp`. Galeri berisi 10 gambar dari percakapan proyek (7 retouch Studio, 3 Artwork), filter kategori, navigasi keyboard/panah/swipe, dan lightbox yang mengembalikan fokus ke pemicu. Semua gambar baru disimpan di repository, bukan ditautkan ke host sementara.
Artwork generatif tidak ditampilkan sebagai dokumentasi konser nyata. `studio-editorial.webp` termasuk edit kreatif yang dapat mengubah busana. Foto panggung dan sampul rilisan tetap terpisah. Lihat [kredit aset](docs/ASSETS.md) dan [riset awal](docs/RESEARCH.md).

## Pengembangan dan build
Gunakan Node 22.12+ atau 24 dan npm. Di PowerShell gunakan `npm.cmd` bila kebijakan eksekusi menolak `npm.ps1`.
```sh
npm ci
npm run dev
```
Server lokal: http://127.0.0.1:4186 . `Start-Website.cmd` tetap tersedia.
```sh
npm run build
npm run preview
```
Build menjalankan TypeScript strict dan Vite, dengan output statis `dist/`. Tidak ada backend, secret atau API key. Vercel dapat membangun commit GitHub menggunakan perintah build ini. Runtime dan development hanya bind localhost secara default.

## Arsitektur
- `index.html`: konten semantik dan metadata author/OG/canonical.
- `src/player.ts`: cuplikan resmi Apple Music, play/pause/seek dan kegagalan jaringan; tanpa autoplay.
- `src/motion.ts`: parallax requestAnimationFrame, IntersectionObserver, reduced motion dan preferensi lokal.
- `src/ui.ts`: navigasi, video click-to-load, galeri dokumentasi, booking dan kredit.
- `src/gallery.ts`: galeri studio/artwork dengan klasifikasi sumber dan lightbox aksesibel.
- `src/visual.css`: layout sinematik dan responsive override; desain dasar tetap terisolasi.
- `public/images/2026/manifest.json`: creator, provenance, dimensi, ukuran dan checksum gambar.

Formulir hanya menyiapkan tautan WhatsApp; pengunjung harus membuka dan mengirimnya sendiri. Tidak ada pesan atau data pribadi yang dikirim otomatis ke server kami. Google Fonts, Apple Music, YouTube dan kanal eksternal memerlukan internet dan memiliki kebijakan layanan sendiri.

## Pengujian
`npm run build` memeriksa tipe dan build. `npm run test:ui` memeriksa situs yang berjalan pada localhost:4186 (atau URL pada variabel `TEST_URL`) menggunakan Playwright Chromium. Pasang browser tes dengan `npx playwright install chromium` pada mesin pengujian. Artefak QA disimpan di direktori temporer, tidak di repository.
Tidak ada klaim bahwa satu pengujian Chromium mencakup semua browser, hak publikasi, atau ketersediaan permanen media pihak ketiga.
