# 💜 ByteStart - UI Course & Tech Articles Platform

**ByteStart** adalah platform edukasi digital premium berbasis web yang menyajikan katalog kursus pemrograman dan artikel teknologi berkualitas tinggi. Projek ini dirancang **KHUSUS** untuk memenuhi tugas mata kuliah **User Interface (UI)**, berfokus penuh pada estetika visual modern, navigasi responsif (*mobile-friendly*), micro-animations, dan demonstrasi alur (*user experience*) yang mulus.

> [!NOTE]
> Projek ini berjalan murni di sisi front-end (*Pure Front-End Mocking*) tanpa integrasi database asli. Seluruh operasi (seperti keranjang, checkout, manajemen kursus, artikel, siswa, dan peran) disimulasikan secara reaktif menggunakan React State, Zustand, dan `localStorage`.

---

## 🛠️ Tech Stack & Library Kunci

* **Framework Inti**: Next.js 15 (dengan React 19) menggunakan App Router.
* **Sistem Styling**: Tailwind CSS v4 (menggunakan palet warna gelap HSL, ungu neon `#892CDC`, ungu tua `#52057B`, dan aksen emas `#FAEB92`).
* **State Management**: Zustand Preferences Store (sinkronisasi cookie server & client-side).
* **Smooth Scrolling**: Lenis Scroll Provider terintegrasi global dengan event wheel trackpad protection.
* **Ikon Grafik**: `lucide-react`.

---

## 👥 Sistem Multi-Peran (Multi-Role System)

ByteStart memiliki alur navigasi adaptif berbasis peran pengguna yang disimpan secara persisten di Zustand Store dan Cookies:
1. **Calon Pelanggan (Public)**: Dapat melihat landing page, mencari katalog kelas `/courses`, detail silabus, dan membaca artikel `/articles`.
2. **Pelanggan (Student)**: Memiliki hak akses ke keranjang belanja `/cart`, simulasi checkout `/checkout`, dashboard belajar `/dashboard/my-learning`, pemutar video, forum Q&A siswa, bookmark catatan, dan riwayat transaksi.
3. **Course Owner (Instructor)**: Akses ke portal manajemen khusus untuk membuat/mengedit katalog kursus, mengelola kurikulum silabus, moderasi ulasan, menjawab Q&A siswa, menerbitkan artikel baru, dan memantau tabel data siswa.
4. **Admin (System Manager)**: Mengawasi pertumbuhan platform via dashboard statistik, tabel roles & permissions, serta panel manajemen hak akses akun anggota.

---

## 🚀 Fitur Utama & Halaman Aplikasi

### 1. Landing Page Utama (`/`)
* **Header & Floating Navbar**: Menu glassmorphic transparan dengan deteksi posisi sticky, transisi scroll halus, dan tombol eksternal.
* **Featured Courses**: Slider kartu kelas unggulan yang memuat mockup rating, durasi, jumlah pelajaran, dan thumbnail Unsplash.
* **Accordion FAQ Smooth**: Animasi tinggi dinamis buka-tutup akordeon menggunakan transisi CSS Grid (`0fr` -> `1fr`) serta rotasi chevron 180° yang mulus.

### 2. Alur Pembelian & Keranjang (`/cart`, `/checkout`)
* **Interactive Shopping Cart**: Kelola item kursus belanja, fitur simpanan nanti (*Save for Later*), dan validasi kupon kode `BYTESTART` (potongan harga 10%).
* **Simulasi Bank Transfer**: Formulir tagihan pembayaran dilengkapi modal sukses transaksi, taburan animasi confetti warna-warni, cetak invoice dummy, dan unduh kwitansi ramah cetak (`@media print` receipt).

### 3. Dasbor Belajar & Course Player (`/dashboard/my-learning`)
* **Streak Weekly Tracker**: Widget streak hari belajar menggunakan SVG ring persentase dan ikon api menyala.
* **Course Video Player**: Video player 16:9 mockup (play, volume, speed, custom timeline scrub, fullscreen simulator). Dilengkapi playlist silabus akordeon sebelah kanan yang memiliki tombol resource download popover.
* **Tab Detail Pembelajaran**:
  * *Overview*: Tautan unduhan app seluler, rincian angka, dan deksripsi drop-down.
  * *Q&A*: Integrasi forum tanya jawab, upvoting, filter sortir, dan AI instant assistant banner.
  * *Notes*: Simpan catatan belajar personal ber-timestamp yang dapat diklik untuk melompat (*seek*) ke menit video tersebut.
  * *Announcements*: Feed tulisan instruktur pendukung komentar reaktif siswa.
  * *Reviews*: Diagram feedback breakdown nilai ulasan bintang siswa.

### 4. Portal Pengajar / Course Owner Studio
* **My Courses** (`/dashboard/my-courses`): Metrik studio (Active, Students, Revenue), general editor, dan syllabus manager.
* **My Articles** (`/dashboard/my-articles`): Catalog panel artikel dengan general editor dan content compiler (Section Heading & Paragraph Accordions).
* **My Students** (`/dashboard/my-students`): Daftar 24 siswa terdaftar dilengkapi filter tab status (`All`, `Active`, `Completed`, `Inactive`), pencarian kata kunci, pagination halaman interaktif (8 siswa per halaman), serta modal CRUD tambah/edit data siswa.

### 5. Portal System Administrator
* **Roles & Permissions** (`/dashboard/roles`): Tabel grid visualisasi tingkatan akses (scoped, read only, full), jumlah pengguna, dan daftar izin set (Curriculum Editor, Video Player, System Logs) yang ter-sync dengan filter tipe, owner, dan status.
* **User Management** (`/dashboard/users`): Board kelola data 25 akun anggota tiruan berdomain `@bytestart.edu` lengkap dengan status (active, deactive, suspended, locked) dan divisi (Curriculum, Support, Platform, Finance).

---

## 🏁 Memulai Pengembangan Lokal

### 1. Instalasi Dependensi
Jalankan perintah berikut di root folder projek untuk mengunduh package node modules:
```bash
npm install
```

### 2. Jalankan Server Dev
Mulai server lokal Next.js di port default:
```bash
npm run dev
```
Buka browser dan arahkan ke [http://localhost:3000](http://localhost:3000) untuk mulai menjelajahi aplikasi.

### 3. Build Produksi
Untuk memeriksa kebenaran kompilasi build produksi Next.js:
```bash
npm run build
```

---

## 📁 Struktur Berkas Penting

* **Landing Page**: [src/app/page.tsx](file:///e:/Uner Coding/Design UI/bytestart-project/src/app/page.tsx)
* **Katalog Kursus**: [src/app/courses/page.tsx](file:///e:/Uner Coding/Design UI/bytestart-project/src/app/courses/page.tsx)
* **Detail Kursus**: [src/app/courses/[id]/page.tsx](file:///e:/Uner Coding/Design UI/bytestart-project/src/app/courses/[id]/page.tsx)
* **Keranjang Belanja**: [src/app/cart/page.tsx](file:///e:/Uner Coding/Design UI/bytestart-project/src/app/cart/page.tsx)
* **Course Player**: [src/app/dashboard/my-learning/[id]/page.tsx](file:///e:/Uner Coding/Design UI/bytestart-project/src/app/dashboard/my-learning/[id]/page.tsx)
* **Owner My Students**: [src/app/dashboard/(main)/my-students/page.tsx](file:///e:/Uner Coding/Design UI/bytestart-project/src/app/dashboard/(main)/my-students/page.tsx)
* **Admin Roles Panel**: [src/app/dashboard/(main)/roles/page.tsx](file:///e:/Uner Coding/Design UI/bytestart-project/src/app/dashboard/(main)/roles/page.tsx)
* **Admin Users Panel**: [src/app/dashboard/(main)/users/page.tsx](file:///e:/Uner Coding/Design UI/bytestart-project/src/app/dashboard/(main)/users/page.tsx)
* **Zustand Preferences**: [src/stores/preferences/preferences-store.ts](file:///e:/Uner Coding/Design UI/bytestart-project/src/stores/preferences/preferences-store.ts)
* **Syllabus & Course Mock Database**: [src/data/coursesMock.ts](file:///e:/Uner Coding/Design UI/bytestart-project/src/data/coursesMock.ts)
