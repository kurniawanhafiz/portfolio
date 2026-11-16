# Portfolio Kurniawan Hafiz

Website portfolio multi-halaman bertema dark tech/terminal, dibangun dengan **Vite** dan **GSAP** (+ ScrollTrigger), di-host di **Netlify**.

Live: https://kurniawanhafiz.web.id

## Daftar isi

- [Fitur](#fitur)
- [Tech stack](#tech-stack)
- [Menjalankan di lokal](#menjalankan-di-lokal)
- [Struktur proyek](#struktur-proyek)
- [Cara kerja](#cara-kerja)
- [Mengubah konten](#mengubah-konten)
- [Deploy ke Netlify](#deploy-ke-netlify)
- [Troubleshooting](#troubleshooting)
- [Catatan keamanan dan privasi](#catatan-keamanan-dan-privasi)

## Fitur

**Umum**
- 5 halaman: Home, Achievements, Projects, Contact, dan 404. URL bersih (`/projects`, bukan `/projects.html`).
- Animasi GSAP: reveal saat scroll, counter angka, garis timeline yang ikut scroll, efek tilt pada kartu, tombol magnetik, dan cursor glow.
- Transisi antar halaman (curtain) dan boot loader singkat di kunjungan pertama.
- Dua bahasa (English dan Indonesia). Default mengikuti bahasa browser, pilihan tersimpan di `localStorage`.
- Tema dark dan light, pilihan tersimpan di `localStorage`. Default dark.
- Menghormati `prefers-reduced-motion`: animasi dimatikan dan konten tampil statis.

**Home**
- Hero dengan teks role yang berganti otomatis.
- **Terminal interaktif** `hafiz@portfolio:~$`. Setelah intro selesai, terminal bisa diketik. Lihat [Terminal](#terminal-interaktif).
- Tombol **Download CV** (pilihan Bahasa Indonesia atau English) di hero dan footer.

**Achievements**
- Kartu prestasi LKS (Kabupaten, Provinsi, Nasional) dengan lightbox untuk sertifikat.
- Kartu Cloud Computing sementara memakai diagram topologi AWS sampai sertifikatnya ada.

**Projects**
- Filter: all, web, cloud, network, systems.
- **Lab jaringan interaktif** (Modul D LKSN 2025, Cisco CML). Lihat [Lab CML](#lab-cml-interaktif).
- Diagram statis (bisa di-zoom) untuk AWS High-Availability, Modul A (Linux Debian 12), dan Modul C (Windows Server + Ansible).

**Contact**
- Form kontak lewat Netlify Forms dengan honeypot anti-spam.

## Tech stack

| Bagian | Pilihan |
| --- | --- |
| Build tool | Vite 7 (multi-page) |
| Animasi | GSAP 3.13 + ScrollTrigger |
| Styling | CSS biasa dengan design token (tanpa framework) |
| Font | Space Grotesk dan JetBrains Mono (Google Fonts) |
| Hosting | Netlify (static, Netlify Forms) |
| Generator CV | Python + Playwright (Chromium print-to-PDF) |

Tidak ada framework JavaScript. SplitText tidak dipakai (plugin berbayar), pemecah huruf dibuat manual di `common.js`.

## Menjalankan di lokal

Syarat: Node.js **20.19 atau lebih baru** (Netlify memakai Node 22).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # hasil di dist/
npm run preview    # cek hasil build di lokal
```

Penting: sebelum deploy pertama kali versi ini, jalankan `npm run build` dan `npm run preview` untuk memastikan semuanya bersih.

## Struktur proyek

```
.
├── index.html, achievements.html, projects.html, contact.html, 404.html
├── vite.config.js            # daftar halaman + plugin partial dan clean URL
├── netlify.toml              # build, redirect, header cache dan keamanan
├── package.json
├── public/                   # disalin apa adanya ke dist/
│   ├── cv/                   # CV_Kurniawan_Hafiz_ID.pdf dan _EN.pdf
│   ├── img/                  # foto, sertifikat, og.png, diagram SVG
│   ├── favicon.ico, robots.txt, sitemap.xml
│   └── BingSiteAuth.xml, googleafe4934d99747ec0.html   # verifikasi search engine
├── src/
│   ├── main.js               # entry: init umum lalu memuat modul per halaman
│   ├── styles/main.css       # seluruh style (token, komponen, tema dark/light)
│   ├── partials/             # nav.html, footer.html, cv.html, icons.html
│   ├── data/lab-module-d.json
│   └── js/
│       ├── theme.js, i18n.js, nav.js, transitions.js, common.js   # dipakai semua halaman
│       ├── home.js, terminal.js, cv.js                            # Home dan menu CV
│       ├── achievements.js, projects.js, contact.js, notfound.js  # per halaman
│       ├── lightbox.js                                            # popup gambar
│       └── lab.js                                                 # viewer topologi CML
└── tools/build_cv.py         # generator PDF CV (ID dan EN)
```

## Cara kerja

### Partial HTML
`vite.config.js` punya plugin `htmlPartials` yang mengganti penanda berikut saat build dan dev:

| Penanda | Diganti dengan |
| --- | --- |
| `<!--@icons-->` | `src/partials/icons.html` (sprite ikon SVG) |
| `<!--@nav-->` | `src/partials/nav.html` (link aktif diatur otomatis lewat `data-nav`) |
| `<!--@footer-->` | `src/partials/footer.html` |
| `<!--@cv-->` | tombol Download CV (dropdown membuka ke bawah) |
| `<!--@cv-up-->` | tombol Download CV (dropdown membuka ke atas, dipakai di footer) |

Mengubah file di `src/partials/` memicu full reload di dev server.

### Entry dan modul per halaman
`src/main.js` menjalankan inisialisasi umum (tema, bahasa, nav, transisi, efek umum), lalu memuat modul sesuai halaman secara dinamis. Modul halaman mengekspor fungsi `(ctx)` yang boleh mengembalikan `{ play() }` untuk animasi masuk.

Untuk menambah halaman baru:
1. Buat `halaman.html` (salin kerangka dari halaman lain).
2. Tambahkan nama halaman ke `pages` di `vite.config.js` dan ke `cleanUrls` kalau mau URL bersih.
3. Tambahkan rewrite di `netlify.toml`, link di `nav.html`, dan entri di `sitemap.xml`.
4. (Opsional) buat modul `src/js/halaman.js` dan daftarkan di peta `pages` pada `src/main.js`.

### Dua bahasa (i18n)
Teks yang punya dua bahasa memakai atribut:

```html
<span data-en="Contact Me" data-id="Hubungi Saya">Contact Me</span>
```

`i18n.js` menukar isi elemen sesuai bahasa aktif dan mengirim event `langchange` supaya modul lain (terminal, menu CV, lab) ikut berubah. Prioritas bahasa awal: pilihan tersimpan, lalu bahasa browser (`id*`), lalu English.

### Terminal interaktif
Logika ada di `src/js/terminal.js`. Hanya perintah yang benar-benar didukung situs yang tersedia, dan outputnya mengikuti bahasa situs.

| Kelompok | Perintah |
| --- | --- |
| Info | `whoami`, `about`, `skills`, `experience`, `education`, `achievements`, `certs`, `contact`, `email` |
| Navigasi | `cd <home\|achievements\|projects\|contact>`, `open <halaman>`, `ls`, `projects`, `pwd` |
| Kontrol situs | `theme [dark\|light]`, `lang [en\|id]`, `cv [id\|en]`, `github`, `linkedin`, `instagram` |
| Shell | `help`, `clear` (atau Ctrl+L), `history`, `date`, `echo`, `neofetch` |
| Easter egg | `sudo`, `rm -rf /`, `ping`, `vim`, `exit`, `coffee`, `hello` |

Fitur input: riwayat dengan ↑/↓, autocomplete dengan Tab (perintah dan argumen), dan perintah tidak dikenal menampilkan `command not found`. Di layar sentuh keyboard tidak otomatis muncul. Tersedia tombol perintah cepat yang bisa di-tap, dan keyboard baru muncul saat terminal disentuh.

Cara menambah perintah: tambahkan entri di objek `COMMANDS` dan baris di `HELP`. Cara navigasi memakai klik pada link sementara, jadi transisi halaman tetap berjalan seperti klik biasa.

### Download CV
`src/partials/cv.html` berisi dropdown dengan dua link (`/cv/CV_Kurniawan_Hafiz_ID.pdf` dan `_EN.pdf`). `src/js/cv.js` mengurus buka/tutup menu, menaruh CV sesuai bahasa situs di urutan pertama, dan membalik posisi menu kalau hampir keluar layar. Saat tertutup menu memakai `display: none` supaya tidak melebarkan halaman di HP.

### Lab CML interaktif
Kartu "Enterprise Network & Linux Lab" membuka dialog dengan viewer topologi Modul D LKSN 2025.
- Data: `src/data/lab-module-d.json` berisi 22 node dan 35 link. Hanya nama perangkat, jenis, posisi, dan interface.
- Viewer: `src/js/lab.js` menggambar SVG dari data itu. Ada dua tampilan (Sites dan Routing), hover/klik untuk menyorot tetangga, panel interface, dan animasi paket data dengan GSAP.
- Untuk memperbarui topologi, edit JSON-nya. Posisi zona dihitung otomatis dari node.

### Generator CV
```bash
pip install playwright && playwright install chromium
python3 tools/build_cv.py
```
Script membaca konten dari dictionary `D` (kunci `id` dan `en`) dan menulis PDF ke `public/cv/`. Format satu kolom, ramah ATS, font Liberation Serif, ukuran A4. Ubah isi CV di `tools/build_cv.py`, jalankan ulang, lalu commit PDF-nya.

## Mengubah konten

| Yang ingin diubah | File |
| --- | --- |
| Teks hero dan statistik | `index.html` |
| Data prestasi | `achievements.html` |
| Kartu proyek | `projects.html` (blok `<article class="card project">`; `data-kind` harus cocok dengan `data-filter` pada filter) |
| Email dan link sosial | `contact.html`, `src/partials/footer.html`, dan `terminal.js` (`LINKS`, `EMAIL`) |
| Warna dan font | token di bagian atas `src/styles/main.css` |
| Isi CV | `tools/build_cv.py`, lalu generate ulang PDF |
| Info SEO dan OG | `<head>` tiap halaman, `public/sitemap.xml`, `public/img/og.png` |

Catatan: informasi di terminal (`terminal.js`) ditulis terpisah dari HTML. Kalau data prestasi atau skill berubah, perbarui juga di sana.

## Deploy ke Netlify

`netlify.toml` sudah berisi semuanya: build command `npm run build`, publish directory `dist`, `NODE_VERSION=22`, rewrite URL bersih, redirect `/syntax` ke folder Google Drive, header keamanan, dan cache (`/assets/*` selamanya karena nama file di-hash, `/img/*` 7 hari, `/cv/*` 1 jam).

Langkah:
1. Hubungkan repo ke Netlify (Import from Git). Pengaturan build otomatis terbaca dari `netlify.toml`.
2. Untuk domain custom, atur DNS di Domain management.
3. Aktifkan form di bagian di bawah.

### Netlify Forms
Form kontak (`name="contact"`) dikirim lewat `fetch` ke `/`.
1. Di dashboard Netlify buka **Forms** dan aktifkan **form detection**.
2. Deploy dengan opsi **Clear cache and deploy site** supaya form terdaftar.
3. Atur notifikasi email di **Forms, Form notifications**.

Kalau pengiriman gagal dengan `404 Not Found` pada `POST /`, artinya form belum terdeteksi. Ulangi langkah 1 dan 2.

## Troubleshooting

| Masalah | Penyebab dan solusi |
| --- | --- |
| `POST /` 404 saat kirim form | Form detection belum aktif atau belum deploy ulang. Lihat bagian Netlify Forms. |
| Halaman melebar di HP dan harus di-zoom out | Ada elemen yang lebih lebar dari layar. Cari elemen dengan `getBoundingClientRect().right` lebih besar dari lebar layar. Elemen `visibility:hidden` tetap dihitung, pakai `display:none`. |
| Kartu terpotong di HP | Grid `1fr` bernilai `minmax(auto, 1fr)`. Pakai `minmax(0, 1fr)` dan `min-width: 0` pada anak grid. |
| Dropdown tertutup elemen lain | Elemen dengan `transform` membuat stacking context. Naikkan `z-index` ancestor yang membuka menu (lihat blok `:has(.cv-dl.is-open)` di CSS). |
| Layar zoom saat mengetik di terminal (HP) | Input harus berukuran font minimal 16px di layar sentuh. Sudah diatur lewat `@media (pointer: coarse)`. |
| `/achievements` tidak ketemu di `vite preview` | Sudah ditangani plugin `cleanUrlRewrite`. Pastikan nama halaman ada di `cleanUrls` pada `vite.config.js`. |
| CV tidak ikut ter-update | Cache `/cv/*` satu jam. Hard refresh atau tunggu cache habis. |

## Catatan keamanan dan privasi

- Topologi lab dan diagram proyek hanya memuat nama perangkat, jaringan, dan layanan. Tidak ada konfigurasi, password, atau pre-shared key dari soal lomba.
- CV publik memakai email `fizallinone@gmail.com` dan tidak mencantumkan nomor telepon.
- Diagram Modul A dan C dibuat sendiri berdasarkan deskripsi soal. Mempublikasikan materi soal resmi LKS adalah keputusan pemilik situs.
- Header `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, dan `Permissions-Policy` diatur di `netlify.toml`.
