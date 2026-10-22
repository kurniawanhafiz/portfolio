# Portfolio – Kurniawan Hafiz

Website portfolio pribadi yang menampilkan profil, proyek, pencapaian, dan informasi kontak. Dibangun sebagai situs statis (HTML) sehingga ringan, cepat, dan mudah di-deploy.

🌐 **Live:** [kurniawanhafiz.web.id](https://kurniawanhafiz.web.id)

---

## ✨ Fitur

- Halaman utama (profil singkat)
- Daftar **proyek** yang pernah dikerjakan
- Halaman **pencapaian** (achievements)
- Halaman **kontak**
- Halaman **404** kustom
- Optimasi SEO: `sitemap.xml`, `robots.txt`, serta verifikasi Google & Bing
- Konfigurasi redirect melalui `_redirects`

## 📁 Struktur Proyek

```
portfolio/
├── assets/                 # Gambar, CSS, JS, dan aset statis lainnya
├── index.html              # Halaman utama
├── projects.html           # Halaman proyek
├── achievements.html       # Halaman pencapaian
├── contact.html            # Halaman kontak
├── 404.html                # Halaman error 404
├── linktree-old.html       # Versi lama halaman linktree
├── _redirects              # Aturan redirect untuk hosting
├── robots.txt              # Aturan crawler mesin pencari
├── sitemap.xml             # Peta situs untuk SEO
├── BingSiteAuth.xml        # Verifikasi Bing Webmaster
├── googleafe4934d99747ec0.html  # Verifikasi Google Search Console
└── favicon.ico
```

## 🚀 Menjalankan Secara Lokal

Karena berupa situs statis, tidak ada proses build yang diperlukan.

1. Clone repository:

   ```bash
   git clone https://github.com/kurniawanhafiz/portfolio.git
   cd portfolio
   ```

2. Buka `index.html` langsung di browser, **atau** jalankan local server agar perilaku lebih mirip production:

   ```bash
   # Python
   python3 -m http.server 8000

   # atau Node.js
   npx serve .
   ```

3. Buka `http://localhost:8000` di browser.

## 🌍 Deployment

Situs ini cocok di-deploy ke hosting statis seperti Netlify, Cloudflare Pages, atau GitHub Pages. File `_redirects` digunakan untuk mengatur redirect pada platform yang mendukungnya (misalnya Netlify / Cloudflare Pages).

Langkah umum:

1. Hubungkan repository ini ke platform hosting.
2. Pilih branch `main`.
3. Kosongkan *build command* dan set *publish directory* ke `/` (root).

## 🛠️ Kustomisasi

- Ubah konten teks langsung pada file `.html` terkait.
- Ganti gambar dan aset di folder `assets/`.
- Perbarui `sitemap.xml` jika menambah atau menghapus halaman.
- Ganti file verifikasi Google/Bing dengan milik Anda jika melakukan fork.

## 📬 Kontak

- Website: [kurniawanhafiz.web.id](https://kurniawanhafiz.web.id)
- GitHub: [@kurniawanhafiz](https://github.com/kurniawanhafiz)

## 📄 Lisensi

Belum ada lisensi yang ditentukan. Tambahkan file `LICENSE` (misalnya MIT) jika ingin mengizinkan orang lain menggunakan atau memodifikasi kode ini.
